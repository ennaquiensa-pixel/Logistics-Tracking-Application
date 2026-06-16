// Updated Payment.tsx component with date input for expiry
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard,
  MapPin,
  User,
  CheckCircle,
  Plus,
  Home,
  Loader,
  ArrowLeft,
  Package,
  Navigation,
  Shield,
  Lock,
  Smartphone,
  ShoppingBag,
  AlertCircle,
  Calendar,
} from "lucide-react";
import userService from "../../services/UserService";
import { useAuth } from "../../context/AuthContext";

// Import Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import orderService from "../../services/OrderService";
import { PaymentStatus, type CreateOrderRequest } from "../../types/orderTypes/orderTypes";
import { toast } from "react-toastify";

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Using your provided types
interface ClientResponse {
  idUser: number;
  email: string;
  nom: string;
  telephone: string;
  active: boolean;
  createdAt: string;
  adresses: AdresseResponse[];
}

interface AdresseResponse {
  idAdresse: number;
  rue: string;
  ville: string;
  codePostal: string;
  pays: string;
  complement?: string;
}

interface AdresseRequest {
  rue: string;
  ville: string;
  codePostal: string;
  pays?: string;
  latitude?: number;
  longitude?: number;
  estPrincipale?: boolean;
}

interface ProductOrder {
  product: {
    id: number;
    name: string;
    description?: string;
    sku: string;
    price: number;
    weightKg?: number;
    imageUrl?: string;
  };
  quantity: number;
}

// Card validation function using Luhn algorithm
const validateCardNumber = (cardNumber: string): boolean => {
  // Remove all non-digit characters
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // Check if it's a valid length (13-19 digits)
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }
  
  // Luhn algorithm implementation
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through digits from right to left
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

const validateExpiryDate = (expiryDate: string): boolean => {
  if (!expiryDate) return false;
  
  // Parse the date string (format: YYYY-MM)
  const [year, month] = expiryDate.split('-').map(Number);
  
  // Get current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  
  // Validate month
  if (month < 1 || month > 12) return false;
  
  // Validate year (should be current year or later)
  if (year < currentYear) return false;
  
  // If it's the current year, month must be current or later
  if (year === currentYear && month < currentMonth) return false;
  
  // Don't allow dates too far in the future (e.g., 10 years max)
  if (year > currentYear + 10) return false;
  
  return true;
};

// Helper function to format expiry date for display
const formatExpiryDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  return `${month}/${year.slice(-2)}`;
};

// Helper function to get next month's date as default min value
const getNextMonthDate = (): string => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const year = nextMonth.getFullYear();
  const month = String(nextMonth.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// Helper function to get max date (current year + 10 years)
const getMaxDate = (): string => {
  const now = new Date();
  const maxYear = now.getFullYear() + 10;
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${maxYear}-${month}`;
};

// Main Payment Component
const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [client, setClient] = useState<ClientResponse | null>(null);
  const [adresses, setAdresses] = useState<AdresseResponse[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const { user } = useAuth();

  // Card information state
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "", // Format: YYYY-MM
    cvv: "",
  });

  // Validation state
  const [validation, setValidation] = useState({
    cardNumberValid: false,
    cardHolderValid: false,
    expiryValid: false,
    cvvValid: false,
  });

  // Check if all fields are valid
  const isFormValid = validation.cardNumberValid && 
                     validation.cardHolderValid && 
                     validation.expiryValid && 
                     validation.cvvValid;

  // Get data from location state
  const productOrder = location.state as {
    product: {
      id: number;
      name: string;
      description?: string;
      sku: string;
      price: number;
      weightKg?: number;
      imageUrl?: string;
      warehouseId?: number;
    };
    quantity: number;
    totalPrice: number;
    warehouseId?: number;
  } | null;

  // Calculate totals
  const subtotal = productOrder ? productOrder.totalPrice : 0;
  const shippingCost = 0;
  const totalAmount = subtotal + shippingCost;

  // References for Leaflet map
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // States for geolocation
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  // New address form state
  const [newAddress, setNewAddress] = useState<AdresseRequest>({
    rue: "",
    ville: "",
    codePostal: "",
    pays: "Morocco",
    estPrincipale: false,
  });

  useEffect(() => {
    // Clean up map when component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Check if we have product order data
    if (!productOrder || !productOrder.product) {
      setError("No order information received. Please return to the product page.");
      setIsLoading(false);
      toast.error("Please select a product first");
      navigate('/products');
      return;
    }

    // Check if user is authenticated and is a client
    if (!user) {
      setError("Please log in to place an order.");
      setIsLoading(false);
      navigate('/login');
      return;
    }

    if (user.role !== "CLIENT") {
      setError("Unauthorized access. This page is for clients only.");
      setIsLoading(false);
      navigate('/');
      return;
    }

    // Load client data
    loadClientData();
  }, []);

  // Initialize map when form opens
  useEffect(() => {
    if (showNewAddressForm && !mapInitialized) {
      const timer = setTimeout(() => {
        const defaultLat = 33.5731;
        const defaultLng = -7.5898;
        if (mapContainerRef.current && !mapRef.current) {
          initializeMap(defaultLat, defaultLng);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showNewAddressForm, mapInitialized]);

  useEffect(() => {
    // Validate card information whenever it changes
    const cardNumberValid = validateCardNumber(cardInfo.cardNumber);
    const cardHolderValid = cardInfo.cardHolder.trim().length >= 3;
    const expiryValid = validateExpiryDate(cardInfo.expiryDate);
    const cvvValid = validateCVV(cardInfo.cvv);

    setValidation({
      cardNumberValid,
      cardHolderValid,
      expiryValid,
      cvvValid,
    });
  }, [cardInfo]);

  const initializeMap = (lat: number, lng: number) => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView([lat, lng], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapRef.current);

    markerRef.current = L.marker([lat, lng], {
      draggable: true,
      autoPan: true,
    })
      .addTo(mapRef.current)
      .bindPopup(
        "Your delivery location<br>Drag the marker to adjust"
      )
      .openPopup();

    markerRef.current.on("dragend", function (event) {
      const marker = event.target;
      const position = marker.getLatLng();
      setNewAddress((prev) => ({
        ...prev,
        latitude: position.lat,
        longitude: position.lng,
      }));
      reverseGeocode(position.lat, position.lng);
    });

    mapRef.current.on("click", function (event) {
      const { lat, lng } = event.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          draggable: true,
          autoPan: true,
        })
          .addTo(mapRef.current ? mapRef.current : null!)
          .bindPopup(
            "Your delivery location<br>Drag the marker to adjust"
          )
          .openPopup();
      }
      setNewAddress((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
      reverseGeocode(lat, lng);
    });

    setMapInitialized(true);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.address) {
        const address = data.address;
        setNewAddress((prev) => ({
          ...prev,
          rue: address.road || address.pedestrian || address.footway || "",
          ville:
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            "",
          codePostal: address.postcode || "",
          pays: address.country_code
            ? address.country_code.toUpperCase() === "MA"
              ? "Morocco"
              : address.country
            : "Morocco",
          latitude: lat,
          longitude: lng,
        }));
      }
    } catch (err) {
      console.error("Error reverse geocoding:", err);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            markerRef.current = L.marker([latitude, longitude], {
              draggable: true,
              autoPan: true,
            })
              .addTo(mapRef.current)
              .bindPopup(
                "Your delivery location<br>Drag the marker to adjust"
              )
              .openPopup();
          }
        } else {
          initializeMap(latitude, longitude);
        }

        setNewAddress((prev) => ({
          ...prev,
          latitude: latitude,
          longitude: longitude,
        }));
        reverseGeocode(latitude, longitude);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Geolocation permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Geolocation request timed out";
            break;
        }
        setError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const loadClientData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const clientData = await userService.getClientById(user!.userId);
      console.log("Client data loaded:", clientData);

      setClient(clientData);
      setAdresses(clientData.adresses || []);

      // Auto-select first address if available
      if (clientData.adresses && clientData.adresses.length > 0) {
        setSelectedAddress(0);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Error loading client data";
      setError(errorMessage);
      console.error("Error loading client data:", err);
      toast.error("Unable to load your information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.userId) {
      setError("Invalid client ID");
      return;
    }

    if (!newAddress.rue || !newAddress.ville || !newAddress.codePostal) {
      setError(
        "Please fill all required fields (street, city, postal code)"
      );
      return;
    }

    try {
      setError("");
      
      await userService.addClientAdresse(
        user.userId,
        newAddress
      );

      await loadClientData();

      setShowNewAddressForm(false);
      setNewAddress({
        rue: "",
        ville: "",
        codePostal: "",
        pays: "Morocco",
        estPrincipale: false,
      });

      toast.success("Address added successfully!");

    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error adding address";
      setError(errorMessage);
      console.error("Error adding address:", err);
      toast.error("Error adding address");
    }
  };

  const handleCreateOrder = async () => {
    try {
      setIsProcessing(true);
      setError("");

      // Validate required fields
      if (!productOrder?.product?.warehouseId) {
        throw new Error("Missing warehouse ID for product");
      }

      if (selectedAddress === null || selectedAddress >= adresses.length) {
        throw new Error("Please select a valid delivery address");
      }

      if (!productOrder?.product) {
        throw new Error("Missing product information");
      }

      const selectedAddressObj = adresses[selectedAddress];

      // Prepare order data
      const orderData: CreateOrderRequest = {
        userId: user!.userId,
        warehouseId: productOrder.product.warehouseId,
        expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        shippingCost: 0, // Free shipping
        currency: "MAD",
        notes: `Order for product ${productOrder.product.sku}, Quantity: ${productOrder.quantity}`,
        items: [
          {
            sku: productOrder.product.sku,
            description: productOrder.product.description || productOrder.product.name || "Product",
            quantity: productOrder.quantity,
            unitPrice: productOrder.product.price,
            weightKg: productOrder.product.weightKg || undefined,
          },
        ],
      };

      console.log("Creating order with data:", orderData);
      const createdOrder = await orderService.createOrder(orderData);
      console.log("Order created successfully:", createdOrder);

      setCreatedOrder(createdOrder);
      toast.success("Order created successfully!");
      return createdOrder;

    } catch (err: any) {
      console.error("Order creation error:", err);
      let errorMessage = "Error creating order";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response) {
        errorMessage = err.response.data?.message || `Error ${err.response.status}`;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      setIsProcessing(false);
      return null;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    setCardInfo(prev => ({ ...prev, cardNumber: value }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardInfo(prev => ({ ...prev, expiryDate: value }));
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setCardInfo(prev => ({ ...prev, cvv: value }));
  };

  const handlePayment = async () => {
    if (!isFormValid) {
      setError("Please check your card information");
      return;
    }

    if (!productOrder) {
      setError("No product selected");
      return;
    }

    if (selectedAddress === null || selectedAddress >= adresses.length) {
      setError("Please select a valid delivery address");
      return;
    }

    // Create order first
    const order = await handleCreateOrder();
    if (!order) {
      return; // Error already set by handleCreateOrder
    }

    // Simulate payment processing
    setIsProcessing(true);
    try {
      // In a real application, you would send the payment to your backend here
      // For demonstration, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update order payment status to PAID
      await orderService.updatePaymentStatus(
        order.id,
        { paymentStatus: PaymentStatus.PAID }
      );

      // Navigate to success page
      navigate("/dashboard/client");
      toast.success("Payment successful! Your order has been created.");

    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment processing failed");
      setError("Payment processing failed. Please try again.");
      
      // Update order payment status to FAILED
      if (order) {
        orderService.updatePaymentStatus(
           order.id,
          { paymentStatus: PaymentStatus.FAILED }
        ).catch(err => console.error("Failed to update payment status:", err));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#6366F1' }} />
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF]/10 via-white to-[#6366F1]/5"></div>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.random() * 40 + 10 + 'px',
              height: Math.random() * 40 + 10 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: `radial-gradient(circle, ${['#E0E7FF', '#818CF8', '#6366F1'][i % 3]} 0%, transparent 70%)`,
              opacity: 0.1,
              filter: 'blur(15px)',
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                style={{ color: '#6366F1' }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to product
              </button>
              <span className="text-gray-400">/</span>
              <span className="font-medium" style={{ color: '#1f2937' }}>
                Secure Payment
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Order Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border"
                     style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Package className="h-6 w-6 mr-3" style={{ color: '#6366F1' }} />
                      <h2 className="text-xl font-bold" style={{ color: '#1f2937' }}>
                        Order Summary
                      </h2>
                    </div>
                    {productOrder?.product?.sku && (
                      <span className="text-sm font-mono px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                        {productOrder.product.sku}
                      </span>
                    )}
                  </div>
                  
                  {productOrder ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b"
                           style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
                        <div>
                          <p className="font-medium" style={{ color: '#1f2937' }}>
                            {productOrder.product.name || productOrder.product.sku}
                          </p>
                          <div className="text-sm space-y-1 mt-1">
                            <p style={{ color: '#6b7280' }}>Quantity: {productOrder.quantity}</p>
                            {productOrder.product.description && (
                              <p className="text-gray-500 italic">{productOrder.product.description}</p>
                            )}
                            {productOrder.product.weightKg && (
                              <p style={{ color: '#6b7280' }}>Weight: {productOrder.product.weightKg} kg</p>
                            )}
                            {productOrder.product.warehouseId && (
                              <p style={{ color: '#6b7280' }}>Warehouse: #{productOrder.product.warehouseId}</p>
                            )}
                          </div>
                        </div>
                        <p className="font-bold" style={{ color: '#6366F1' }}>
                          ${(productOrder.product.price * productOrder.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p style={{ color: '#6b7280' }}>No product selected</p>
                    </div>
                  )}
                </div>

                {/* Card Information Form */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border"
                     style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
                  <div className="flex items-center mb-6">
                    <CreditCard className="h-6 w-6 mr-3" style={{ color: '#6366F1' }} />
                    <h2 className="text-xl font-bold" style={{ color: '#1f2937' }}>
                      Payment Details
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>
                        Card Number *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardInfo.cardNumber}
                          onChange={handleCardNumberChange}
                          maxLength={19}
                          placeholder="0000 0000 0000 0000"
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all pl-12 ${
                            cardInfo.cardNumber ? (validation.cardNumberValid ? 'border-green-500' : 'border-red-500') : ''
                          }`}
                          style={{
                            color: '#1f2937',
                            caretColor: '#6366F1'
                          }}
                        />
                        <CreditCard className="absolute left-4 top-3.5 h-5 w-5" style={{ color: '#9CA3AF' }} />
                      </div>
                      {cardInfo.cardNumber && !validation.cardNumberValid && (
                        <p className="mt-1 text-sm text-red-500">Invalid card number</p>
                      )}
                    </div>

                    {/* Card Holder */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>
                        Card Holder Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardInfo.cardHolder}
                          onChange={(e) => setCardInfo(prev => ({ ...prev, cardHolder: e.target.value }))}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all pl-12 ${
                            cardInfo.cardHolder ? (validation.cardHolderValid ? 'border-green-500' : 'border-red-500') : ''
                          }`}
                          style={{
                            color: '#1f2937',
                            caretColor: '#6366F1'
                          }}
                        />
                        <User className="absolute left-4 top-3.5 h-5 w-5" style={{ color: '#9CA3AF' }} />
                      </div>
                      {cardInfo.cardHolder && !validation.cardHolderValid && (
                        <p className="mt-1 text-sm text-red-500">Name must be at least 3 characters</p>
                      )}
                    </div>

                    {/* Expiry Date and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>
                          Expiry Date *
                        </label>
                        <div className="relative">
                          <input
                            type="month"
                            value={cardInfo.expiryDate}
                            onChange={handleExpiryDateChange}
                            min={getNextMonthDate()}
                            max={getMaxDate()}
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all pr-12 ${
                              cardInfo.expiryDate ? (validation.expiryValid ? 'border-green-500' : 'border-red-500') : ''
                            }`}
                            style={{
                              color: '#1f2937',
                              caretColor: '#6366F1'
                            }}
                          />
                          <Calendar className="absolute right-4 top-3.5 h-5 w-5" style={{ color: '#9CA3AF' }} />
                        </div>
                        {cardInfo.expiryDate && (
                          <div className="flex justify-between items-center mt-1">
                            <p className={`text-sm ${validation.expiryValid ? 'text-green-600' : 'text-red-500'}`}>
                              {validation.expiryValid ? 'Valid expiry date' : 'Invalid expiry date'}
                            </p>
                            {cardInfo.expiryDate && (
                              <p className="text-sm text-gray-500">
                                Display: {formatExpiryDate(cardInfo.expiryDate)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>
                          CVV *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardInfo.cvv}
                            onChange={handleCVVChange}
                            maxLength={4}
                            placeholder="123"
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all pr-12 ${
                              cardInfo.cvv ? (validation.cvvValid ? 'border-green-500' : 'border-red-500') : ''
                            }`}
                            style={{
                              color: '#1f2937',
                              caretColor: '#6366F1'
                            }}
                          />
                          <Lock className="absolute right-4 top-3.5 h-5 w-5" style={{ color: '#9CA3AF' }} />
                        </div>
                        {cardInfo.cvv && !validation.cvvValid && (
                          <p className="mt-1 text-sm text-red-500">CVV must be 3 or 4 digits</p>
                        )}
                      </div>
                    </div>

                    {/* Security Info */}
                    <div className="flex items-center gap-2 text-sm pt-4"
                         style={{ color: '#6b7280' }}>
                      <Shield className="h-4 w-4" />
                      <span>Secure payment. Your information is encrypted and validated.</span>
                    </div>

                    {/* Validation Summary */}
                    <div className="mt-4 p-4 rounded-lg bg-gray-50">
                      <p className="text-sm font-medium mb-2" style={{ color: '#6b7280' }}>
                        Validation Status:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${validation.cardNumberValid ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm" style={{ color: validation.cardNumberValid ? '#10B981' : '#6b7280' }}>
                            Card number {validation.cardNumberValid ? 'valid' : 'invalid'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${validation.cardHolderValid ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm" style={{ color: validation.cardHolderValid ? '#10B981' : '#6b7280' }}>
                            Card holder name {validation.cardHolderValid ? 'valid' : 'invalid'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${validation.expiryValid ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm" style={{ color: validation.expiryValid ? '#10B981' : '#6b7280' }}>
                            Expiry date {validation.expiryValid ? 'valid' : 'invalid'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${validation.cvvValid ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm" style={{ color: validation.cvvValid ? '#10B981' : '#6b7280' }}>
                            CVV {validation.cvvValid ? 'valid' : 'invalid'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Selection */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border"
                     style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <MapPin className="h-6 w-6 mr-3" style={{ color: '#6366F1' }} />
                      <h2 className="text-xl font-bold" style={{ color: '#1f2937' }}>
                        Delivery Address
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowNewAddressForm(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366F1'
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      New Address
                    </button>
                  </div>

                  {showNewAddressForm ? (
                    <div className="space-y-6">
                      {/* Map Container */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold" style={{ color: '#1f2937' }}>
                            Location on Map
                          </h3>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={getUserLocation}
                              disabled={isGettingLocation}
                              className="flex items-center text-sm px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                              style={{
                                backgroundColor: '#6366F1',
                                color: '#FFFFFF'
                              }}
                            >
                              <Navigation className="w-4 h-4 mr-1" />
                              {isGettingLocation ? "Locating..." : "My Location"}
                            </button>
                          </div>
                        </div>
                        <div
                          ref={mapContainerRef}
                          className="h-64 w-full rounded-lg border"
                          style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}
                        />
                      </div>

                      <form onSubmit={handleAddAddress} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: '#6b7280' }}>
                              Street *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAddress.rue}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, rue: e.target.value }))}
                              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                              style={{
                                borderColor: 'rgba(224, 231, 255, 0.5)',
                                color: '#1f2937',
                                caretColor: '#6366F1'
                              }}
                              placeholder="Street name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: '#6b7280' }}>
                              City *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAddress.ville}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, ville: e.target.value }))}
                              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                              style={{
                                borderColor: 'rgba(224, 231, 255, 0.5)',
                                color: '#1f2937',
                                caretColor: '#6366F1'
                              }}
                              placeholder="City name"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: '#6b7280' }}>
                              Postal Code *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAddress.codePostal}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, codePostal: e.target.value }))}
                              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                              style={{
                                borderColor: 'rgba(224, 231, 255, 0.5)',
                                color: '#1f2937',
                                caretColor: '#6366F1'
                              }}
                              placeholder="Postal code"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: '#6b7280' }}>
                              Country
                            </label>
                            <select
                              value={newAddress.pays}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, pays: e.target.value }))}
                              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                              style={{
                                borderColor: 'rgba(224, 231, 255, 0.5)',
                                color: '#1f2937'
                              }}
                            >
                              <option value="Morocco">Morocco</option>
                              <option value="France">France</option>
                              <option value="Spain">Spain</option>
                              <option value="Italy">Italy</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            type="submit"
                            className="flex-1 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                            style={{
                              backgroundColor: '#6366F1',
                              color: '#FFFFFF'
                            }}
                          >
                            Add Address
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowNewAddressForm(false)}
                            className="flex-1 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              border: '1px solid rgba(224, 231, 255, 0.5)',
                              color: '#6366F1'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {adresses.length === 0 ? (
                        <div className="text-center py-8">
                          <Home className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p className="mb-4" style={{ color: '#6b7280' }}>
                            No saved addresses. Please add a delivery address.
                          </p>
                          <button
                            onClick={() => setShowNewAddressForm(true)}
                            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                            style={{
                              backgroundColor: '#6366F1',
                              color: '#FFFFFF'
                            }}
                          >
                            <Plus className="h-4 w-4 inline-block mr-2" />
                            Add Address
                          </button>
                        </div>
                      ) : (
                        adresses.slice(0, 5).map((address, index) => (
                          <div
                            key={address.idAdresse || index}
                            className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                              selectedAddress === index 
                                ? 'border-[#6366F1] bg-[#6366F1]/5' 
                                : 'border-gray-200 hover:border-[#6366F1]/50'
                            }`}
                            onClick={() => setSelectedAddress(index)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <Home className="h-5 w-5 mr-3" style={{ color: '#6366F1' }} />
                                  <span className="font-semibold" style={{ color: '#1f2937' }}>
                                    {address.rue}
                                  </span>
                                </div>
                                <p className="text-sm pl-8" style={{ color: '#6b7280' }}>
                                  {address.codePostal} {address.ville}, {address.pays}
                                </p>
                              </div>
                              {selectedAddress === index && (
                                <CheckCircle className="h-6 w-6" style={{ color: '#6366F1' }} />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 rounded-xl text-sm"
                       style={{
                         backgroundColor: 'rgba(239, 68, 68, 0.1)',
                         color: '#DC2626'
                       }}>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Payment Summary */}
              <div className="space-y-6">
                {/* Payment Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border sticky top-6"
                     style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
                  <h2 className="text-xl font-bold mb-6" style={{ color: '#1f2937' }}>
                    Payment Summary
                  </h2>

                  {/* Show warning if no address selected */}
                  {selectedAddress === null && adresses.length > 0 && (
                    <div className="mb-4 p-3 rounded-lg text-sm"
                         style={{
                           backgroundColor: 'rgba(245, 158, 11, 0.1)',
                           color: '#D97706'
                         }}>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>Please select a delivery address</span>
                      </div>
                    </div>
                  )}

                  {/* Validation status indicator */}
                  <div className="mb-4 p-3 rounded-lg text-sm"
                       style={{
                         backgroundColor: isFormValid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                         color: isFormValid ? '#10B981' : '#D97706'
                       }}>
                    <div className="flex items-center gap-2">
                      {isFormValid ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Card information is valid. Ready to proceed.</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          <span>Please complete all card information correctly</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing || !isFormValid || selectedAddress === null || !productOrder}
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 relative overflow-hidden"
                    style={{
                      backgroundColor: isFormValid && selectedAddress !== null ? '#6366F1' : '#9CA3AF',
                      color: '#FFFFFF',
                      boxShadow: isFormValid && selectedAddress !== null ? '0 8px 30px rgba(99, 102, 241, 0.4)' : 'none',
                      opacity: (isProcessing || !isFormValid || selectedAddress === null || !productOrder) ? 0.5 : 1
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        Pay ${totalAmount.toFixed(2)}
                      </>
                    )}
                  </button>

                  {/* Order Summary */}
                  <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#6b7280' }}>Subtotal</span>
                        <span style={{ color: '#1f2937' }}>${totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#6b7280' }}>Shipping</span>
                        <span style={{ color: '#10B981' }}>Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#6b7280' }}>Tax</span>
                        <span style={{ color: '#1f2937' }}>Included</span>
                      </div>
                      <div className="h-px" style={{ backgroundColor: 'rgba(224, 231, 255, 0.5)' }}></div>
                      <div className="flex justify-between text-lg font-bold">
                        <span style={{ color: '#1f2937' }}>Total</span>
                        <span style={{ color: '#6366F1' }}>${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-6 text-xs" style={{ color: '#9CA3AF' }}>
                      <p className="flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        Secure payment using Luhn algorithm validation
                      </p>
                      <p className="mt-2">
                        By placing an order, you agree to our terms and conditions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="text-center p-3 rounded-xl"
                       style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                    <Shield className="h-8 w-8 mx-auto mb-2" style={{ color: '#6366F1' }} />
                    <p className="text-xs font-medium" style={{ color: '#1f2937' }}>Secure Payment</p>
                  </div>
                  <div className="text-center p-3 rounded-xl"
                       style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                    <Lock className="h-8 w-8 mx-auto mb-2" style={{ color: '#6366F1' }} />
                    <p className="text-xs font-medium" style={{ color: '#1f2937' }}>Encrypted Data</p>
                  </div>
                  <div className="text-center p-3 rounded-xl"
                       style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                    <CheckCircle className="h-8 w-8 mx-auto mb-2" style={{ color: '#6366F1' }} />
                    <p className="text-xs font-medium" style={{ color: '#1f2937' }}>Card Validation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;