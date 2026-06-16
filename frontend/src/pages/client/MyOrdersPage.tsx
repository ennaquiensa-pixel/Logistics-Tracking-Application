import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Clock,
  MapPin,
  Download,
  Truck,
  Filter,
  RefreshCw,
  CircleCheckBig,
} from "lucide-react";
import userService from "../../services/UserService";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import orderService from "../../services/OrderService";
import { toast } from "react-toastify";
import SimpleLoader from "../../components/SimpleLoader";
import type { OrderResponse } from "../../types/orderTypes/orderTypes";
import { getFromCache, saveToCache } from "../../utils/cache";

const MyOrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState({
    orders: true,
    user: true,
  });
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const ORDERS_CACHE_TTL = 3 * 60 * 1000;
  const getOrdersCacheKey = (userId: number) => `my_orders_user_${userId}`;

  useEffect(() => {
    if (user?.userId) {
      getOrders();
      getClientById(user?.userId);
    }
  }, [user?.userId]);

  // const getOrders = async () => {
  //   try {
  //     setLoading(prev => ({ ...prev, orders: true }));
  //     setError(null);
  //     const response = await orderService.getOrdersByUser(Number(user?.userId));

  //     if (Array.isArray(response)) {
  //       setOrders(response);
  //     } else if (response) {
  //       setOrders(response);
  //     } else {
  //       setOrders([]);
  //       console.warn('Unexpected response format:', response);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching client orders:', error);
  //     setError('Failed to load orders. Please try again.');
  //     setOrders([]);
  //   } finally {
  //     setLoading(prev => ({ ...prev, orders: false }));
  //   }
  // };

  const getOrders = async () => {
    if (!user?.userId) return;

    const cacheKey = getOrdersCacheKey(user.userId);

    try {
      setLoading((prev) => ({ ...prev, orders: true }));
      setError(null);

      // 1️⃣ Try cache first
      const cachedOrders = getFromCache<OrderResponse[]>(
        cacheKey,
        ORDERS_CACHE_TTL
      );

      if (cachedOrders) {
        setOrders(cachedOrders);
        return;
      }

      // 2️⃣ Fetch backend
      const response = await orderService.getOrdersByUser(Number(user.userId));

      const ordersData = Array.isArray(response)
        ? response
        : response
        ? [response]
        : [];

      setOrders(ordersData);

      // 3️⃣ Save cache
      saveToCache(cacheKey, ordersData);
    } catch (error) {
      console.error("Error fetching client orders:", error);
      setError("Failed to load orders. Please try again.");
      setOrders([]);
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  const getClientById = async (id: number) => {
    try {
      setLoading((prev) => ({ ...prev, user: true }));
      const userDetailsResponse = await userService.getClientById(id);
      console.log("User details:", userDetailsResponse);
      return userDetailsResponse;
    } catch (error) {
      toast.error("Failed to fetch user details. Please try again.");
      console.error("Error fetching user details:", error);
    } finally {
      setLoading((prev) => ({ ...prev, user: false }));
    }
  };

  const calculateOrderValue = (order: any) => {
    if (!order.items) return "0.00 MAD";
    const itemsTotal = order.items.reduce(
      (total: number, item: any) => total + item.unitPrice * item.quantity,
      0
    );
    const total = itemsTotal + (order.shippingCost || 0);
    return `${total.toFixed(2)} ${order.currency || "MAD"}`;
  };

  const getOrderDetails = (order: any) => {
    if (!order.items || order.items.length === 0) return "No items";
    if (order.items.length === 1) return order.items[0].description;
    return `${order.items.length} items`;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.notes &&
        order.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.items &&
        order.items.some((item: any) =>
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    return matchesSearch;
  });

  const isLoading = Object.values(loading).some((value) => value);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
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
                ["#4F46E5", "#818CF8", "#A5B4FC"][i % 3]
              } 0%, transparent 70%)`,
              opacity: 0.08,
              filter: "blur(15px)",
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
              style={{
                backgroundColor: "rgba(79, 70, 229, 0.15)",
                color: "#4F46E5",
              }}
            >
              <Truck className="h-3 w-3" />
              <span>My Orders</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-900">
              My Orders
            </h1>
            <p className="text-lg text-gray-600">
              Track and manage your shipments in real-time
            </p>
          </div>
          <div className="flex gap-3">
            {/* <button 
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-300 hover:border-[#4F46E5]"
              style={{
                backgroundColor: 'white',
                color: '#4F46E5',
              }}
            >
              <Download className="h-4 w-4" />
              Export Report
            </button> */}
            <button
              onClick={() => {
                if (user?.userId) {
                  localStorage.removeItem(getOrdersCacheKey(user.userId));
                  getOrders();
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "#4F46E5",
                color: "#FFFFFF",
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div
          className="bg-white p-6 rounded-2xl border border-gray-200 mb-8 transition-all duration-300 hover:border-gray-300"
          style={{
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search orders by ID, description, or notes..."
                className="w-full bg-white text-gray-900 pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 border border-gray-300 hover:border-[#4F46E5]"
              style={{
                backgroundColor: "white",
                color: "#4F46E5",
              }}
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-gray-300"
          style={{
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-5 px-6 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="py-5 px-6 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">
                    Expected Delivery
                  </th>
                  <th className="py-5 px-6 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">
                    Details
                  </th>
                  <th className="py-5 px-6 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">
                    Value
                  </th>
                  <th className="py-5 px-6 text-left text-gray-600 font-semibold text-sm uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading.orders ? (
                  <tr>
                    <td colSpan={5} className="py-12 px-6">
                      <div className="flex items-center justify-center">
                        <SimpleLoader />
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr
                      key={order.id || index}
                      className="hover:bg-gray-50/80 transition-all duration-300 group"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
                          <span className="text-gray-900 font-semibold group-hover:text-[#4F46E5] transition-colors">
                            #{order.id}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-[#4F46E5]" />
                          <span className="text-gray-700">
                            {order.expectedDeliveryDate}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div>
                          <p className="text-gray-900 group-hover:text-[#4F46E5] transition-colors">
                            {getOrderDetails(order)}
                          </p>
                          <div className="flex items-center space-x-1 mt-2">
                            <CircleCheckBig className="h-3 w-3 text-[#4F46E5]" />
                            <span className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                              {order.status || "Location not specified"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <p className="text-gray-900 font-semibold text-lg group-hover:scale-105 transition-all duration-300">
                          {calculateOrderValue(order)}
                        </p>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex space-x-2">
                          <Link
                            to={`/orders/${order.id}`}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                            style={{
                              backgroundColor: "#4F46E5",
                              color: "#FFFFFF",
                              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            <span>View Details</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 px-6">
                      <div className="text-center">
                        <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {searchTerm
                            ? "No matching orders found"
                            : "No orders found"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {searchTerm
                            ? "Try adjusting your search criteria"
                            : "You haven't placed any orders yet"}
                        </p>
                        {searchTerm && (
                          <button
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-gray-300 hover:border-[#4F46E5]"
                            style={{
                              backgroundColor: "white",
                              color: "#4F46E5",
                            }}
                            onClick={() => setSearchTerm("")}
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Error State */}
        {error && !loading.orders && (
          <div className="text-center py-12">
            <div
              className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto"
              style={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Truck className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Error Loading Orders
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "#DC2626",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 14px rgba(220, 38, 38, 0.3)",
                }}
                onClick={getOrders}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
