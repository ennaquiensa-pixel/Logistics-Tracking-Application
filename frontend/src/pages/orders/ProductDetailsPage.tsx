import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  ArrowLeft,
  Plus,
  Minus,
  Truck,
  Shield,
  Clock,
  Weight,
  Star,
  ChevronRight,
  Home,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react";
import productService from "../../services/productService";
import type { CreateOrderRequest } from "../../types/orderTypes/orderTypes";
import { useAuth } from "../../context/AuthContext";
import orderService from "../../services/OrderService";
import { toast } from "react-toastify";
import ThreeDCardDemo from "../../components/CardItem";
import type { ProductResponse } from "../../types/productTYpes/productResponse";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [otherProducts, setOtherProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const productData = await productService.getProductDetails(Number(id));
        console.log("the product is", productData);
        setProduct(productData);

        // Fetch other products (first 5 excluding current)
        const allProducts = await productService.getAllProducts();
        const filteredProducts = allProducts
          .filter((p) => p.id !== productData.id)
          .slice(0, 4); // Show only 4 related products
        setOtherProducts(filteredProducts);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 100) {
      setQuantity(value);
    }
  };

  const handleCreateOrder = async () => {
    try {
      if (!user?.userId) {
        toast.error("Please log in to place an order");
        return;
      }

      if (!product) {
        toast.error("Product not available");
        return;
      }

      if (product.warehouseId === undefined || product.warehouseId === null) {
        toast.error("Product warehouse not available");
        return;
      }

      const orderData: CreateOrderRequest = {
        userId: user.userId,
        warehouseId: product.warehouseId,
        expectedDeliveryDate: "2025-01-15",
        shippingCost: 20,
        currency: "MAD",
        notes: `Auto-order for product ${product.sku}, Quantity: ${quantity}`,
        items: [
          {
            sku: product.sku,
            description: product.description ?? product.name ?? "Product",
            quantity: quantity,
            unitPrice: product.price,
            weightKg: product.weightKg ?? undefined,
          },
        ],
      };

      const response = await orderService.createOrder(orderData);
      toast.success("Order created successfully!");
      setQuantity(1);
    } catch (error) {
      toast.error("Failed to create order");
      console.log(error);
    }
  };

  const [isDescShown, setIsDescShown] = useState(false);
  const showFullDescription = () => {
    setIsDescShown(!isDescShown);
  };
 if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin" style={{ color: "#6366F1" }} />
    </div>
  );
}

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Package
            className="h-16 w-16 mx-auto mb-4"
            style={{ color: "#818CF8" }}
          />
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#1f2937" }}>
            Product Not Found
          </h2>
          <p className="mb-6" style={{ color: "#6b7280" }}>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/products"
            onClick={()=>window.scrollTo(0,0)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "#6366F1",
              color: "#FFFFFF",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = quantity * product.price;
  const productColor = "#6366F1"; 

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-[#E0E7FF]/10 via-white to-[#6366F1]/5"></div>
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.random() * 40 + 10 + "px",
              height: Math.random() * 40 + 10 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              background: `radial-gradient(circle, ${
                ["#E0E7FF", "#818CF8", "#6366F1"][i % 3]
              } 0%, transparent 70%)`,
              opacity: 0.1,
              filter: "blur(15px)",
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Link
                to="/"
                className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                style={{ color: "#6b7280" }}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <ChevronRight className="h-4 w-4" style={{ color: "#9CA3AF" }} />
              <Link
                to="/products"
                className="transition-all duration-300 hover:scale-105"
                style={{ color: "#6b7280" }}
              >
                Products
              </Link>
              <ChevronRight className="h-4 w-4" style={{ color: "#9CA3AF" }} />
              <span
                className="font-medium truncate max-w-[200px] sm:max-w-none"
                style={{ color: productColor }}
              >
                {product.name || product.sku}
              </span>
            </div>
          </div>
        </div>

        {/* Product Layout */}
        <div className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image Section */}
              <div>
                <div className="sticky top-24">
                  <div
                    className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border"
                    style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}
                  >
                    <div className="aspect-square relative overflow-hidden rounded-xl">
                      <img
                        src={
                          product.imageUrl ||
                          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        alt={""}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                        }}
                      />
                      {/* Premium Badge */}
                      <div className="absolute top-4 left-4">
                        <div
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(4px)",
                            color: productColor,
                          }}
                        >
                          <Star className="h-3 w-3 fill-current" />
                          <span>Premium</span>
                        </div>
                      </div>
                    </div>

                    {/* Image Thumbnails (for multiple images) */}
                    <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer hover:scale-105 transition-transform"
                          style={{
                            borderColor:
                              i === 1
                                ? productColor
                                : "rgba(224, 231, 255, 0.3)",
                          }}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-[#E0E7FF] to-[#818CF8]"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {[
                      { icon: Truck, label: "24h Delivery", color: "#818CF8" },
                      { icon: Shield, label: "Insured", color: "#6366F1" },
                      { icon: Clock, label: "Trackable", color: "#4F46E5" },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="text-center p-4 rounded-xl transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: `1px solid ${stat.color}30`,
                        }}
                      >
                        <div className="flex justify-center mb-2">
                          <stat.icon
                            className="h-5 w-5"
                            style={{ color: stat.color }}
                          />
                        </div>
                        <div
                          className="text-xs font-medium"
                          style={{ color: "#6b7280" }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Details Section */}
              <div>
                {/* Product Header */}
                <div className="mb-6">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
                    style={{
                      backgroundColor: `${productColor}15`,
                      color: productColor,
                    }}
                  >
                    {/* <Package className="h-3 w-3" />
                    <span>Delivery Service</span> */}
                  </div>

                  <h1
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3"
                    style={{ color: "#1f2937" }}
                  >
                    {product.name || product.sku}
                  </h1>

                  <p
                    className={`text-lg mb-6 ${
                      isDescShown ? "line-clamp-none" : "line-clamp-6"
                    }`}
                    style={{ color: "#6b7280" }}
                  >
                    {product.description}
                  </p>
                  <button
                    onClick={() => showFullDescription()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
                  >
                    {isDescShown ? (
                      <>
                        Show Less
                        <ChevronUp size={18} />
                      </>
                    ) : (
                      <>
                        Show More
                        <ChevronDown size={18} />
                      </>
                    )}
                  </button>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5"
                          style={{
                            color: i < 4 ? "#FBBF24" : "#E5E7EB",
                            fill: i < 4 ? "#FBBF24" : "none",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      4.8 • 124 reviews
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div
                  className="mb-8 p-6 rounded-2xl"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(224, 231, 255, 0.5)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <div
                        className="text-sm font-medium mb-2"
                        style={{ color: "#6b7280" }}
                      >
                        Unit Price
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-3xl sm:text-4xl font-bold"
                          style={{ color: productColor }}
                        >
                          ${product.price}
                        </span>
                        <span className="text-lg" style={{ color: "#9CA3AF" }}>
                          per item
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-sm font-medium mb-2"
                        style={{ color: "#6b7280" }}
                      >
                        Total Value
                      </div>
                      <div
                        className="text-2xl sm:text-3xl font-bold"
                        style={{ color: "#1f2937" }}
                      >
                        ${totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div
                  className="mb-8 p-6 rounded-2xl"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(224, 231, 255, 0.5)",
                  }}
                >
                  <h3
                    className="text-lg font-bold mb-6"
                    style={{ color: "#1f2937" }}
                  >
                    Product Details
                  </h3>
                  <div className="space-y-4">
                    <DetailRow
                      label="SKU"
                      value={product.sku}
                      color="#818CF8"
                    />
                    <DetailRow
                      label="Weight"
                      value={
                        product.weightKg ? `${product.weightKg} kg` : "N/A"
                      }
                      color="#6366F1"
                    />
                    <DetailRow
                      label="Warehouse"
                      value={`#${product.warehouseId || "N/A"}`}
                      color="#4F46E5"
                    />
                    <DetailRow
                      label="Delivery Time"
                      value={
                        product.weightKg && product.weightKg > 10
                          ? "2-3 business days"
                          : "24 hours"
                      }
                      color="#818CF8"
                    />
                  </div>
                </div>

                {/* Quantity Selector */}
                <div
                  className="mb-8 p-6 rounded-2xl"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(224, 231, 255, 0.5)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ color: "#1f2937" }}
                      >
                        Quantity
                      </h3>
                      <p className="text-sm" style={{ color: "#6b7280" }}>
                        Select the number of items you need
                      </p>
                    </div>

                    <div className="flex items-center">
                      <button
                        onClick={decreaseQuantity}
                        className="p-3 rounded-l-xl border border-r-0 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderColor: "rgba(224, 231, 255, 0.5)",
                          color: productColor,
                        }}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-5 w-5" />
                      </button>

                      <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-24 text-center py-3 border-y transition-all duration-300 focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderColor: "rgba(224, 231, 255, 0.5)",
                          color: "#1f2937",
                          caretColor: productColor,
                        }}
                        min="1"
                        max="100"
                      />

                      <button
                        onClick={increaseQuantity}
                        className="p-3 rounded-r-xl border border-l-0 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderColor: "rgba(224, 231, 255, 0.5)",
                          color: productColor,
                        }}
                        disabled={quantity >= 100}
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Button */}
                <Link
                  to={`${isAuthenticated ? "/product/order" : "/login"}`}
                  state={{
                    product: product,
                    quantity: quantity,
                    totalPrice: totalPrice,
                    warehouseId: product.warehouseId,
                  }}
                  className="block w-full group relative overflow-hidden"
                >
                  <button
                    className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 relative z-10"
                    style={{
                      backgroundColor: productColor,
                      color: "#FFFFFF",
                      boxShadow: "0 8px 30px rgba(99, 102, 241, 0.4)",
                    }}
                  >
                    {/* Shimmer effect */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, #FFFFFF, transparent)",
                        transform: "translateX(-100%)",
                      }}
                    ></div>

                    <span>
                      Order Now ({quantity} {quantity === 1 ? "item" : "items"})
                    </span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div
                    className="mt-3 text-center text-sm"
                    style={{ color: "#6b7280" }}
                  >
                    Total:{" "}
                    <span className="font-bold">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Related Products Section */}
            {otherProducts.length > 0 && (
              <div
                className="mt-20 pt-10 border-t"
                style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <h2
                      className="text-2xl sm:text-3xl font-bold mb-2"
                      style={{ color: "#1f2937" }}
                    >
                      Related Services
                    </h2>
                    <p className="text-lg" style={{ color: "#6b7280" }}>
                      You might also be interested in these delivery services
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="flex items-center gap-2 font-semibold transition-all duration-300 hover:scale-105"
                    style={{ color: productColor }}
                  >
                    View all services
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherProducts.map((otherProduct) => (
                    <div
                      key={otherProduct.id}
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="transition-all duration-300 hover:scale-[1.02]"
                    >
                      <ThreeDCardDemo product={otherProduct} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({
  label,
  value,
  color = "#6366F1",
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <div
    className="flex justify-between items-center py-3 border-b last:border-0"
    style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}
  >
    <div className="flex items-center gap-3">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      ></div>
      <span className="font-medium" style={{ color: "#6b7280" }}>
        {label}
      </span>
    </div>
    <span className="font-semibold" style={{ color: "#1f2937" }}>
      {value}
    </span>
  </div>
);

export default ProductDetails;
