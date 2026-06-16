// components/delivery/AddDeliveryDialog.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { TypeLivraison, type ColisRequest, type LivraisonRequest } from "../types/deliveryTypes/deliveryTypes";
import userService from "../services/UserService";
import orderService from "../services/OrderService";
import type { OrderResponse } from "../types/orderTypes/orderTypes";
import deliveryService from "../services/DeliveryService";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";



interface AddDeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeliveryAdded: () => void;
}

interface ClientOption {
  idUser: number;
  nom: string;
  email: string;
}

interface OrderOption {
  idCommande: number;
  prixTotal: number;
  clientId: number;
}

interface DriverOption {
  idUser: number;
  nom: string;
  vehiculeId: number | null;
}

const AddDeliveryDialog: React.FC<AddDeliveryDialogProps> = ({
  open,
  onOpenChange,
  onDeliveryAdded,
}) => {
  const [formData, setFormData] = useState<LivraisonRequest>({
    orderId: 0,
    clientId: 0,
    adresseDestination: {
      rue: "",
      ville: "",
      codePostal: "",
      pays: "Morocco",
      latitude: 33.5731,
      longitude: -7.5898,
    },
    adresseOrigine: {
      rue: "",
      ville: "",
      codePostal: "",
      pays: "Morocco",
      latitude: 33.5731,
      longitude: -7.5898,
    },
    type: TypeLivraison.STANDARD,
    colis: [],
    dateLivraisonPrevue: "",
    notes: "",
  });

  const [clients, setClients] = useState<ClientOption[]>([]);
  const [orders, setOrders] = useState<OrderOption[]>([]);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [availableOrders, setAvailableOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [packageCount, setPackageCount] = useState(1);
  const [currentPackage, setCurrentPackage] = useState<ColisRequest>({
    packageId: 0,
    poids: 0,
    description: "",
    dimensions: "",
  });

  // Fetch initial data
  useEffect(() => {
    if (open) {
      fetchClients();
      fetchDrivers();
    }
  }, [open]);

  useEffect(() => {
    if (formData.clientId > 0) {
      fetchClientOrders(formData.clientId);
    }
  }, [formData.clientId]);

  const fetchClients = async () => {
    try {
      const response = await userService.getAllClients();
      setClients(response.map(client => ({
        idUser: client.idUser,
        nom: client.nom,
        email: client.email
      })));
    } catch (error) {
      toast.error("Failed to fetch clients");
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await userService.getAllLivreurs();
      setDrivers(response.map(driver => ({
        idUser: driver.idUser,
        nom: driver.nom,
        vehiculeId: driver.vehiculeId
      })));
    } catch (error) {
      toast.error("Failed to fetch drivers");
    }
  };

  const fetchClientOrders = async (clientId: number) => {
    try {
      const response = await orderService.getOrdersByUser(clientId);
      setAvailableOrders(response);
    } catch (error) {
      toast.error("Failed to fetch client orders");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith("adresseDestination.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        adresseDestination: {
          ...prev.adresseDestination,
          [field]: field === "latitude" || field === "longitude" 
            ? parseFloat(value) || 0 
            : value
        }
      }));
    } else if (name.startsWith("adresseOrigine.")) {
      const field = name.split(".")[1];
      setFormData(prev => {
        const origine = prev.adresseOrigine ?? {
          rue: "",
          ville: "",
          codePostal: "",
          pays: "Morocco",
          latitude: 33.5731,
          longitude: -7.5898,
        };
        return {
          ...prev,
          adresseOrigine: {
            rue: field === "rue" ? value : origine.rue || "",
            ville: field === "ville" ? value : origine.ville || "",
            codePostal: field === "codePostal" ? value : origine.codePostal || "",
            pays: field === "pays" ? value : origine.pays || "",
            latitude: field === "latitude" ? (parseFloat(value) || 0) : origine.latitude ?? 0,
            longitude: field === "longitude" ? (parseFloat(value) || 0) : origine.longitude ?? 0,
          }
        };
      });
    } else if (name.startsWith("package.")) {
      const field = name.split(".")[1];
      setCurrentPackage(prev => ({
        ...prev,
        [field]: field === "poids" || field === "packageId" 
          ? parseFloat(value) || 0 
          : value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === "orderId" || name === "clientId" 
          ? parseInt(value) || 0 
          : value
      }));
    }
  };

  const addPackage = () => {
    if (currentPackage.description && currentPackage.poids > 0) {
      const newPackage = {
        ...currentPackage,
        packageId: formData.colis.length + 1
      };
      
      setFormData(prev => ({
        ...prev,
        colis: [...prev.colis, newPackage]
      }));
      
      // Reset current package form
      setCurrentPackage({
        packageId: 0,
        poids: 0,
        description: "",
        dimensions: "",
      });
      
      toast.success("Package added successfully!");
    } else {
      toast.error("Please fill all required package fields");
    }
  };

  const removePackage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colis: prev.colis.filter((_, i) => i !== index)
    }));
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format to YYYY-MM-DDTHH:MM
    return tomorrow.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.orderId || formData.orderId <= 0) {
      toast.error("Please select an order");
      return;
    }
    
    if (!formData.clientId || formData.clientId <= 0) {
      toast.error("Please select a client");
      return;
    }
    
    if (formData.colis.length === 0) {
      toast.error("Please add at least one package");
      return;
    }
    
    if (!formData.adresseDestination.rue || !formData.adresseDestination.ville || !formData.adresseDestination.codePostal) {
      toast.error("Please fill all required address fields");
      return;
    }
    
    setLoading(true);

    try {
      // Prepare final data
      const deliveryData: LivraisonRequest = {
        ...formData,
        dateLivraisonPrevue: formData.dateLivraisonPrevue || getCurrentDateTime(),
      };

      await deliveryService.createLivraison(deliveryData);
      toast.success("Delivery created successfully!");
      
      // Reset form
      setFormData({
        orderId: 0,
        clientId: 0,
        adresseDestination: {
          rue: "",
          ville: "",
          codePostal: "",
          pays: "Morocco",
          latitude: 33.5731,
          longitude: -7.5898,
        },
        adresseOrigine: {
          rue: "",
          ville: "",
          codePostal: "",
          pays: "Morocco",
          latitude: 33.5731,
          longitude: -7.5898,
        },
        type: TypeLivraison.STANDARD,
        colis: [],
        dateLivraisonPrevue: "",
        notes: "",
      });
      
      onOpenChange(false);
      onDeliveryAdded();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create delivery";
      toast.error(errorMessage);
      console.error("Delivery creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Delivery</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new delivery order.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client and Order Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Client & Order Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Select Client *</label>
                <select
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">-- Select Client --</option>
                  {clients.map(client => (
                    <option key={client.idUser} value={client.idUser}>
                      {client.nom} ({client.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Select Order *</label>
                <select
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.clientId}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="0">-- Select Order --</option>
                  {availableOrders.map(order => (
                    <option key={order.deliveryId} value={order.deliveryId}>
                      Order #{order.deliveryId} - ${order.totalAmount}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Delivery Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={TypeLivraison.STANDARD}>Standard</option>
                  <option value={TypeLivraison.EXPRESS}>Express</option>
                  <option value={TypeLivraison.PRIORITAIRE}>Prioritaire</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Expected Delivery Date *</label>
                <input
                  type="datetime-local"
                  name="dateLivraisonPrevue"
                  value={formData.dateLivraisonPrevue}
                  onChange={handleInputChange}
                  min={getCurrentDateTime()}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Origin Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Origin Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Street</label>
                <input
                  type="text"
                  name="adresseOrigine.rue"
                  value={formData.adresseOrigine?.rue ?? ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Warehouse Street"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">City *</label>
                <input
                  type="text"
                  name="adresseOrigine.ville"
                  value={formData.adresseOrigine?.ville ?? ""}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Casablanca"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Postal Code *</label>
                <input
                  type="text"
                  name="adresseOrigine.codePostal"
                  value={formData.adresseOrigine?.codePostal ?? ""}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="20000"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Country</label>
                <input
                  type="text"
                  name="adresseOrigine.pays"
                  value={formData.adresseOrigine?.pays ?? "Morocco"}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Morocco"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="adresseOrigine.latitude"
                  value={formData.adresseOrigine?.latitude ?? ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="adresseOrigine.longitude"
                  value={formData.adresseOrigine?.longitude ?? ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Destination Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Destination Address *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Street *</label>
                <input
                  type="text"
                  name="adresseDestination.rue"
                  value={formData.adresseDestination.rue}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Customer Street"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">City *</label>
                <input
                  type="text"
                  name="adresseDestination.ville"
                  value={formData.adresseDestination.ville}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Customer City"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Postal Code *</label>
                <input
                  type="text"
                  name="adresseDestination.codePostal"
                  value={formData.adresseDestination.codePostal}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Customer Postal Code"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Country</label>
                <input
                  type="text"
                  name="adresseDestination.pays"
                  value={formData.adresseDestination.pays}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Morocco"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="adresseDestination.latitude"
                  value={formData.adresseDestination.latitude}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="adresseDestination.longitude"
                  value={formData.adresseDestination.longitude}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Package Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Packages Information</h3>
            
            {/* Current Package Form */}
            <div className="bg-gray-50 p-4 rounded-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Description *</label>
                  <input
                    type="text"
                    name="package.description"
                    value={currentPackage.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Package contents"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="package.poids"
                    value={currentPackage.poids}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5.5"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Dimensions</label>
                  <input
                    type="text"
                    name="package.dimensions"
                    value={currentPackage.dimensions}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="30x20x15 cm"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={addPackage}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Package
              </button>
            </div>

            {/* Added Packages List */}
            {formData.colis.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Added Packages ({formData.colis.length})</h4>
                <div className="space-y-2">
                  {formData.colis.map((pkg, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md border">
                      <div>
                        <span className="font-medium">{pkg.description}</span>
                        <span className="text-sm text-gray-600 ml-3">
                          {pkg.poids} kg • {pkg.dimensions}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePackage(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            <div>
              <label className="text-sm font-medium block mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Special instructions, handling requirements, etc."
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Creating Delivery..." : "Create Delivery"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeliveryDialog;