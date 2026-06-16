import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Truck,
  CheckCircle,
  Clock,
  Warehouse,
  MapPin,
  TrendingUp,
  Download,
  RefreshCw,
  Eye,
  CoinsIcon,
  Filter,
  Plus,
  AlertTriangle,
  Package,
  DollarSign,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/UserService";
import type { UserResponse } from "../../types/UserTypes";
import deliveryService from "../../services/DeliveryService";
import {
  EtatLivraison,
  type LivraisonResponse,
} from "../../types/deliveryTypes/deliveryTypes";
import AddWarehouseDialog from "../../components/AddWarehouseDialog";
import { wareHouseService } from "../../services/WareHouseService";
import orderService from "../../services/OrderService";
import { toast } from "react-toastify";
import type { GainResponse } from "../../types/orderTypes/orderTypes";
import AddUser from "../../components/AddUser";
import SimpleLoader from "../../components/SimpleLoader";
import { getFromCache, saveToCache } from "../../utils/cache";

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [totalClients, setTotalClients] = useState<number>(0);
  const [totalLivreurs, setTotalLivreurs] = useState<number>(0);
  const [totalManagers, setTotalManagers] = useState<number>(0);
  const [activeDeliveries, setActiveDeliveries] = useState<number>(0);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [recentUsers, setRecentUsers] = useState<UserResponse[]>([]);
  const [isAddWarehouseOpen, setIsAddWarehouseOpen] = useState(false);
  const [allwarehouses, setAllwarehouses] = useState<number>(0);
  const [orders, setOrders] = useState<number>(0);
  const [totalGain, setTotalGain] = useState<GainResponse>({
    gain: 0,
    currency: "",
  });
  const [allLivraisons, setAllLivraisons] = useState<LivraisonResponse[]>([]);
  const [totalGainBetween, setTotalGainBetween] = useState<GainResponse>({
    gain: 0,
    currency: "",
    start: "",
    end: "",
  });

  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Loading states
  const [loading, setLoading] = useState({
    clients: true,
    livreurs: true,
    managers: true,
    deliveries: true,
    recentUsers: true,
    totalGain: true,
    gainBetween: true,
    warehouses: true,
    orders: true,
    allLivraisons: true,
  });

  useEffect(() => {
    // const getAllClients = async () => {
    //   try {
    //     const response = await userService.getAllClients();
    //     setTotalClients(response.length);
    //   } catch (error) {
    //     console.error("Error fetching clients:", error);
    //     setTotalClients(0);
    //   } finally {
    //     setLoading(prev => ({ ...prev, clients: false }));
    //   }
    // };

    const getAllClients = async () => {
      try {
        const cacheKey = "dashboard_clients";

        const cached = getFromCache<any[]>(cacheKey, CACHE_TTL);
        if (cached) {
          setTotalClients(cached.length);
          return;
        }

        const response = await userService.getAllClients();
        setTotalClients(response.length);
        saveToCache(cacheKey, response);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setTotalClients(0);
      } finally {
        setLoading((prev) => ({ ...prev, clients: false }));
      }
    };

    // const getActiveDeliveries = async () => {
    //   try {
    //     const response = await deliveryService.getActiveLivraisons();
    //     setActiveDeliveries(response.length);
    //   } catch (error) {
    //     console.error("Error fetching active deliveries:", error);
    //     setActiveDeliveries(0);
    //   } finally {
    //     setLoading(prev => ({ ...prev, deliveries: false }));
    //   }
    // };
    const getActiveDeliveries = async () => {
      try {
        const cacheKey = "dashboard_active_deliveries";

        // 1️⃣ Vérifier le cache
        const cached = getFromCache<any[]>(cacheKey, CACHE_TTL);
        if (cached) {
          setActiveDeliveries(cached.length);
          return;
        }

        // 2️⃣ Fetch backend si pas de cache
        const response = await deliveryService.getActiveLivraisons();

        setActiveDeliveries(response.length);

        // 3️⃣ Sauvegarder dans le cache
        saveToCache(cacheKey, response);
      } catch (error) {
        console.error("Error fetching active deliveries:", error);
        setActiveDeliveries(0);
      } finally {
        setLoading((prev) => ({ ...prev, deliveries: false }));
      }
    };

    // const getAllLivreurs = async () => {
    //   try {
    //     const response = await userService.getAllLivreurs();
    //     setTotalLivreurs(response.length);
    //   } catch (error) {
    //     console.error("Error fetching livreurs:", error);
    //     setTotalLivreurs(0);
    //   } finally {
    //     setLoading(prev => ({ ...prev, livreurs: false }));
    //   }
    // };

    const getAllLivreurs = async () => {
      try {
        const cacheKey = "dashboard_livreurs";

        // 1️⃣ Vérifier le cache
        const cached = getFromCache<any[]>(cacheKey, CACHE_TTL);
        if (cached) {
          setTotalLivreurs(cached.length);
          return;
        }

        // 2️⃣ Fetch backend
        const response = await userService.getAllLivreurs();

        setTotalLivreurs(response.length);

        // 3️⃣ Sauvegarder dans le cache
        saveToCache(cacheKey, response);
      } catch (error) {
        console.error("Error fetching livreurs:", error);
        setTotalLivreurs(0);
      } finally {
        setLoading((prev) => ({ ...prev, livreurs: false }));
      }
    };

    // const getAllManagers = async () => {
    //   try {
    //     const response = await userService.getAllManagers();
    //     setTotalManagers(response.length);
    //   } catch (error) {
    //     console.error("Error fetching managers:", error);
    //     setTotalManagers(0);
    //   } finally {
    //     setLoading(prev => ({ ...prev, managers: false }));
    //   }
    // };
    const getAllManagers = async () => {
      try {
        const cacheKey = "dashboard_managers";

        // 1️⃣ Vérifier le cache
        const cached = getFromCache<any[]>(cacheKey, CACHE_TTL);
        if (cached) {
          setTotalManagers(cached.length);
          return;
        }

        // 2️⃣ Fetch backend
        const response = await userService.getAllManagers();

        setTotalManagers(response.length);

        // 3️⃣ Sauvegarder dans le cache
        saveToCache(cacheKey, response);
      } catch (error) {
        console.error("Error fetching managers:", error);
        setTotalManagers(0);
      } finally {
        setLoading((prev) => ({ ...prev, managers: false }));
      }
    };

    // const getRecentUsers = async () => {
    //   try {
    //     const response = await userService.getRecentUsers(5);
    //     console.log("recent users", response);
    //     setRecentUsers(response);
    //   } catch (error) {
    //     console.error("Error fetching recent users:", error);
    //     setRecentUsers([]);
    //   } finally {
    //     setLoading(prev => ({ ...prev, recentUsers: false }));
    //   }
    // };
    const getRecentUsers = async () => {
      try {
        const cacheKey = "dashboard_recent_users";
        const cached = getFromCache<UserResponse[]>(cacheKey, CACHE_TTL);

        if (cached) {
          setRecentUsers(cached);
          return;
        }

        const response = await userService.getRecentUsers(5);
        setRecentUsers(response);
        saveToCache(cacheKey, response);
      } catch (error) {
        setRecentUsers([]);
      } finally {
        setLoading((prev) => ({ ...prev, recentUsers: false }));
      }
    };

    const getTotalGain = async () => {
      try {
        const response = await orderService.getTotalGain();
        console.log("total gain", response);
        setTotalGain(response);
      } catch (error) {
        console.error("Error fetching total gain:", error);
        setTotalGain({ gain: 0, currency: "" });
      } finally {
        setLoading((prev) => ({ ...prev, totalGain: false }));
      }
    };

    const getGainLast7Days = async () => {
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        const startISO = start.toISOString();
        const endISO = end.toISOString();
        const response = await orderService.getGainBetween(startISO, endISO);
        console.log("Gain between last 7 days:", response);
        setTotalGainBetween(response);
      } catch (error) {
        console.error("Erreur lors de la récupération du gain:", error);
        setTotalGainBetween({ gain: 0, currency: "", start: "", end: "" });
      } finally {
        setLoading((prev) => ({ ...prev, gainBetween: false }));
      }
    };

    const getAllWarehouses = async () => {
      try {
        const response = await wareHouseService.getAllWareHouses();
        setAllwarehouses(response.length);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
        setAllwarehouses(0);
      } finally {
        setLoading((prev) => ({ ...prev, warehouses: false }));
      }
    };

    // const getAllLivraisons = async () => {
    //   try {
    //     const delivered = await deliveryService.getLivraisonsByStatus(
    //       EtatLivraison.LIVREE
    //     );
    //     const pending = await deliveryService.getLivraisonsByStatus(
    //       EtatLivraison.EN_ATTENTE
    //     );
    //     const en_cours = await deliveryService.getLivraisonsByStatus(
    //       EtatLivraison.EN_COURS
    //     );
    //     const combineDeliveries: LivraisonResponse[] = [
    //       ...delivered,
    //       ...pending,
    //       ...en_cours,
    //     ];
    //     setAllLivraisons(combineDeliveries);
    //   } catch (error) {
    //     console.error("Error fetching livraisons:", error);
    //     setAllLivraisons([]);
    //   } finally {
    //     setLoading((prev) => ({ ...prev, allLivraisons: false }));
    //   }
    // };
    const getAllLivraisons = async () => {
      try {
        const cacheKey = "dashboard_all_livraisons";

        // 1️⃣ Vérifier le cache
        const cached = getFromCache<LivraisonResponse[]>(cacheKey, CACHE_TTL);
        if (cached) {
          setAllLivraisons(cached);
          return;
        }

        // 2️⃣ Fetch backend (3 appels)
        const delivered = await deliveryService.getLivraisonsByStatus(
          EtatLivraison.LIVREE
        );
        const pending = await deliveryService.getLivraisonsByStatus(
          EtatLivraison.EN_ATTENTE
        );
        const en_cours = await deliveryService.getLivraisonsByStatus(
          EtatLivraison.EN_COURS
        );

        const combineDeliveries: LivraisonResponse[] = [
          ...delivered,
          ...pending,
          ...en_cours,
        ];

        setAllLivraisons(combineDeliveries);

        // 3️⃣ Sauvegarder dans le cache
        saveToCache(cacheKey, combineDeliveries);
      } catch (error) {
        console.error("Error fetching livraisons:", error);
        setAllLivraisons([]);
      } finally {
        setLoading((prev) => ({ ...prev, allLivraisons: false }));
      }
    };

    // const getAllOrders = async () => {
    //   try {
    //     const response = await orderService.getAllOrders();
    //     console.log("orders", response);
    //     setOrders(response.length);
    //   } catch (error) {
    //     console.error("Error fetching orders:", error);
    //     setOrders(0);
    //     toast.error("Error loading orders");
    //   } finally {
    //     setLoading((prev) => ({ ...prev, orders: false }));
    //   }
    // };

    const getAllOrders = async () => {
      try {
        const cacheKey = "dashboard_orders";

        const cached = getFromCache<any[]>(cacheKey, CACHE_TTL);
        if (cached) {
          setOrders(cached.length);
          return;
        }

        const response = await orderService.getAllOrders();
        console.log("orders", response);

        setOrders(response.length);

        saveToCache(cacheKey, response);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders(0);
        toast.error("Error loading orders");
      } finally {
        setLoading((prev) => ({ ...prev, orders: false }));
      }
    };

    // Fetch all data
    getActiveDeliveries();
    getGainLast7Days();
    getTotalGain();
    getRecentUsers();
    getAllManagers();
    getAllClients();
    getAllLivreurs();
    getAllWarehouses();
    getAllLivraisons();
    getAllOrders();
  }, []);

  const handleWarehouseAdded = async () => {
    try {
      const response = await wareHouseService.getAllWareHouses();
      setAllwarehouses(response.length);
      toast.success("Warehouse added successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Error refreshing warehouse data");
    }
  };

  const handleUserAdded = async (newUser: any) => {
    try {
      setLoading((prev) => ({
        ...prev,
        clients: true,
        livreurs: true,
        managers: true,
        recentUsers: true,
      }));

      const [clients, livreurs, managers, recentUsersData] = await Promise.all([
        userService.getAllClients(),
        userService.getAllLivreurs(),
        userService.getAllManagers(),
        userService.getRecentUsers(5),
      ]);

      setTotalClients(clients.length);
      setTotalLivreurs(livreurs.length);
      setTotalManagers(managers.length);
      setRecentUsers(recentUsersData);
      localStorage.removeItem("dashboard_livreurs");
      localStorage.removeItem("dashboard_managers");
      localStorage.removeItem("dashboard_clients");
      localStorage.removeItem("dashboard_recent_users");
      localStorage.removeItem("dashboard_all_livraisons");
      localStorage.removeItem("dashboard_orders");
      localStorage.removeItem("dashboard_active_deliveries");

      toast.success("User added successfully!");
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast.error("Error refreshing user data");
    } finally {
      setLoading((prev) => ({
        ...prev,
        clients: false,
        livreurs: false,
        managers: false,
        recentUsers: false,
      }));
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const keyMetrics = {
    onTimeDelivery: 92,
  };

  const gainDataBetweenTwoDates = [
    { date: formatDate(totalGainBetween.start || ""), gain: 0 },
    {
      date: formatDate(totalGainBetween.end || ""),
      gain: totalGainBetween.gain,
    },
  ];

  const performanceMetrics = [
    { metric: "On-time Delivery", value: 92, target: 95 },
    { metric: "Customer Satisfaction", value: 88, target: 90 },
    { metric: "Order Accuracy", value: 96, target: 98 },
    { metric: "Response Time", value: 85, target: 80 },
  ];

  const deliveryStatusData = [
    {
      name: "Completed",
      value: allLivraisons.filter(
        (livraison) => livraison.etat === EtatLivraison.LIVREE
      ).length,
      color: "#10B981",
    },
    {
      name: "In Progress",
      value: allLivraisons.filter(
        (livraison) => livraison.etat === EtatLivraison.EN_COURS
      ).length,
      color: "#6366F1",
    },
    {
      name: "Pending",
      value: allLivraisons.filter(
        (livraison) => livraison.etat === EtatLivraison.EN_ATTENTE
      ).length,
      color: "#F59E0B",
    },
    {
      name: "Failed",
      value: allLivraisons.filter(
        (livraison) => livraison.etat === EtatLivraison.ANNULEE
      ).length,
      color: "#EF4444",
    },
  ];

  // const priorityData = [
  //   { priority: "High", count: 15, color: "#EF4444" },
  //   { priority: "Medium", count: 45, color: "#F59E0B" },
  //   { priority: "Low", count: 25, color: "#10B981" },
  // ];

  const getStatusColor = (status: boolean) => {
    switch (status) {
      case false:
        return "text-red-500";
      case true:
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getRoleColor = () => {
    if (!user?.role) return "#6366F1";
    switch (user.role) {
      case "ADMIN":
        return "#4F46E5";
      case "MANAGER":
        return "#818CF8";
      case "LIVREUR":
        return "#6366F1";
      case "CLIENT":
        return "#818CF8";
      default:
        return "#6366F1";
    }
  };

  const roleColor = getRoleColor();

  // Calculate if any data is still loading
  const isLoading = Object.values(loading).some((value) => value);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-[#E0E7FF]/5 via-white to-[#6366F1]/5"></div>
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

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
              style={{
                backgroundColor: `${roleColor}15`,
                color: roleColor,
              }}
            >
              <Truck className="h-3 w-3" />
              <span>Dashboard</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
              style={{ color: "#1f2937" }}
            >
              {user?.role} Dashboard
            </h1>
            <p className="text-lg" style={{ color: "#6b7280" }}>
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(224, 231, 255, 0.5)",
                color: roleColor,
                boxShadow: "0 4px 20px rgba(99, 102, 241, 0.1)",
              }}
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: roleColor,
                color: "#FFFFFF",
                boxShadow: `0 4px 20px ${roleColor}40`,
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {/* Total Users Card */}
          <div
            className="bg-white rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer"
            style={{
              border: "1px solid rgba(224, 231, 255, 0.5)",
              boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: "#6b7280" }}
                >
                  Total Users
                </p>
                <p
                  className="text-2xl font-bold transition-all duration-500 group-hover:scale-110"
                  style={{ color: "#1f2937" }}
                >
                  {loading.clients || loading.livreurs || loading.managers ? (
                    <SimpleLoader />
                  ) : (
                    totalClients + totalLivreurs + totalManagers
                  )}
                </p>
                <div className="flex gap-3 text-xs mt-2">
                  <span
                    className="px-2 py-1 rounded-full transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: `${roleColor}15`,
                      color: roleColor,
                    }}
                  >
                    C:{" "}
                    {loading.clients ? (
                      <SimpleLoader size="small" />
                    ) : (
                      totalClients
                    )}
                  </span>
                  <span
                    className="px-2 py-1 rounded-full transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: `${roleColor}15`,
                      color: roleColor,
                    }}
                  >
                    L:{" "}
                    {loading.livreurs ? (
                      <SimpleLoader size="small" />
                    ) : (
                      totalLivreurs
                    )}
                  </span>
                  <span
                    className="px-2 py-1 rounded-full transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: `${roleColor}15`,
                      color: roleColor,
                    }}
                  >
                    M:{" "}
                    {loading.managers ? (
                      <SimpleLoader size="small" />
                    ) : (
                      totalManagers
                    )}
                  </span>
                </div>
              </div>
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{ backgroundColor: `${roleColor}15` }}
              >
                <Users className="h-6 w-6" style={{ color: roleColor }} />
              </div>
            </div>
          </div>

          {/* Active Deliveries Card */}
          <div
            className="bg-white rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer"
            style={{
              border: "1px solid rgba(224, 231, 255, 0.5)",
              boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: "#6b7280" }}
                >
                  Active Deliveries
                </p>
                <p
                  className="text-2xl font-bold transition-all duration-500 group-hover:scale-110"
                  style={{ color: "#1f2937" }}
                >
                  {loading.deliveries ? <SimpleLoader /> : activeDeliveries}
                </p>
                <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>
                  In progress
                </p>
              </div>
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{ backgroundColor: `${roleColor}15` }}
              >
                <Truck className="h-6 w-6" style={{ color: roleColor }} />
              </div>
            </div>
          </div>

          {/* Completed Today Card */}
          <div
            className="bg-white rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer"
            style={{
              border: "1px solid rgba(224, 231, 255, 0.5)",
              boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: "#6b7280" }}
                >
                  Completed Today
                </p>
                <p
                  className="text-2xl font-bold transition-all duration-500 group-hover:scale-110"
                  style={{ color: "#1f2937" }}
                >
                  {loading.allLivraisons ? (
                    <SimpleLoader />
                  ) : (
                    allLivraisons.filter((l) => l.etat === EtatLivraison.LIVREE)
                      .length
                  )}
                </p>
                <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>
                  Deliveries
                </p>
              </div>
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{ backgroundColor: `${roleColor}15` }}
              >
                <CheckCircle className="h-6 w-6" style={{ color: roleColor }} />
              </div>
            </div>
          </div>

          {/* Pending Orders Card */}
          <div
            className="bg-white rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer"
            style={{
              border: "1px solid rgba(224, 231, 255, 0.5)",
              boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: "#6b7280" }}
                >
                  Pending Orders
                </p>
                <p
                  className="text-2xl font-bold transition-all duration-500 group-hover:scale-110"
                  style={{ color: "#1f2937" }}
                >
                  {loading.orders ? <SimpleLoader /> : orders}
                </p>
                <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>
                  Awaiting action
                </p>
              </div>
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{ backgroundColor: `${roleColor}15` }}
              >
                <Clock className="h-6 w-6" style={{ color: roleColor }} />
              </div>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div
            className="bg-white rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer"
            style={{
              border: "1px solid rgba(224, 231, 255, 0.5)",
              boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: "#6b7280" }}
                >
                  Total Revenue
                </p>
                <p
                  className="text-2xl font-bold transition-all duration-500 group-hover:scale-110"
                  style={{ color: "#1f2937" }}
                >
                  {loading.totalGain ? (
                    <SimpleLoader />
                  ) : (
                    `${totalGain.gain} ${totalGain.currency}`
                  )}
                </p>
                <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>
                  This month
                </p>
              </div>
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{ backgroundColor: `${roleColor}15` }}
              >
                <CoinsIcon className="h-6 w-6" style={{ color: roleColor }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 group"
            style={{
              backgroundColor: roleColor,
              color: "#FFFFFF",
              boxShadow: `0 4px 20px ${roleColor}40`,
            }}
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
          {/* <button 
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 group"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(224, 231, 255, 0.5)',
              color: roleColor
            }}
          >
            <Truck className="h-4 w-4" />
            Assign Delivery
          </button> */}
          {/* <button 
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 group"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(224, 231, 255, 0.5)',
              color: roleColor
            }}
          >
            <MapPin className="h-4 w-4" />
            Manage Routes
          </button> */}
          <button
            onClick={() => setIsAddWarehouseOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 group"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(224, 231, 255, 0.5)",
              color: roleColor,
            }}
          >
            <Warehouse className="h-4 w-4" />
            New Warehouse
          </button>
          {/* <button 
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 group"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(224, 231, 255, 0.5)',
              color: roleColor
            }}
          >
            <AlertTriangle className="h-4 w-4" />
            View Alerts
          </button> */}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{
              border: "1px solid rgba(224, 231, 255, 0.5)",
              boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.1)",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold" style={{ color: "#1f2937" }}>
                Revenue Trend
              </h2>
              <Filter
                className="h-4 w-4 cursor-pointer"
                style={{ color: "#9CA3AF" }}
              />
            </div>
            {loading.gainBetween ? (
              <div className="h-[300px] flex items-center justify-center">
                <SimpleLoader />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={gainDataBetweenTwoDates}>
                  <defs>
                    <linearGradient id="colorGain" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={roleColor}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={roleColor}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid rgba(224, 231, 255, 0.5)",
                      color: "#1f2937",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 20px rgba(99, 102, 241, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="gain"
                    stroke={roleColor}
                    fill="url(#colorGain)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Delivery Status & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Delivery Status Pie Chart */}
            <div
              className="bg-white rounded-2xl p-6"
              style={{
                border: "1px solid rgba(224, 231, 255, 0.5)",
                boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.1)",
              }}
            >
              <h2
                className="text-lg font-bold mb-6"
                style={{ color: "#1f2937" }}
              >
                Delivery Status
              </h2>
              {loading.allLivraisons ? (
                <div className="h-[200px] flex items-center justify-center">
                  <SimpleLoader />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={deliveryStatusData.filter(
                        (item) => item.value !== 0
                      )}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      label
                    >
                      {deliveryStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Priority Distribution */}
            {/* <div className="bg-white rounded-2xl p-6"
                 style={{
                   border: '1px solid rgba(224, 231, 255, 0.5)',
                   boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.1)'
                 }}>
              <h2 className="text-lg font-bold mb-6" style={{ color: '#1f2937' }}>
                Priority Distribution
              </h2>
              <div className="space-y-4">
                {priorityData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium" style={{ color: '#6b7280' }}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold" style={{ color: '#1f2937' }}>{item.count}</span>
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(item.count / 85) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>

        {/* Performance Metrics */}
        <div
          className="bg-white rounded-2xl p-6 mb-8"
          style={{
            border: "1px solid rgba(224, 231, 255, 0.5)",
            boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.1)",
          }}
        >
          <h2 className="text-lg font-bold mb-6" style={{ color: "#1f2937" }}>
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div
                key={index}
                className="p-4 rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor:
                    metric.value >= metric.target
                      ? `${roleColor}10`
                      : "#FEF2F2",
                  border: `1px solid ${
                    metric.value >= metric.target ? `${roleColor}30` : "#FECACA"
                  }`,
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#6b7280" }}
                  >
                    {metric.metric}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      metric.value >= metric.target
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {metric.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metric.value >= metric.target
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${(metric.value / 100) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-2">
                  <span style={{ color: "#9CA3AF" }}>
                    Current: {metric.value}%
                  </span>
                  <span style={{ color: "#9CA3AF" }}>
                    Target: {metric.target}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div
            className="bg-white rounded-2xl"
            style={{
              border: "1px solid rgba(224, 231, 255, 0.5)",
              boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.1)",
            }}
          >
            <div
              className="flex justify-between items-center p-6 border-b"
              style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}
            >
              <h2 className="text-lg font-bold" style={{ color: "#1f2937" }}>
                Recent Users
              </h2>
              <Eye
                className="h-4 w-4 cursor-pointer"
                style={{ color: "#9CA3AF" }}
              />
            </div>
            <div className="p-4">
              {loading.recentUsers ? (
                <div className="h-[200px] flex items-center justify-center">
                  <SimpleLoader />
                </div>
              ) : recentUsers.length > 0 ? (
                recentUsers.map((userItem, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow mb-2"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(224, 231, 255, 0.5)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: roleColor,
                          color: "#FFFFFF",
                        }}
                      >
                        {userItem.nom.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: "#1f2937" }}>
                          {userItem.nom}
                        </p>
                        <p className="text-sm" style={{ color: "#6b7280" }}>
                          {userItem.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm" style={{ color: "#9CA3AF" }}>
                        {userItem.createdAt}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          userItem.active ?? false
                        )}`}
                      >
                        {userItem.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-[200px] flex items-center justify-center text-gray-500">
                  No recent users found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <AddUser
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          onUserAdded={handleUserAdded}
          defaultRole="CLIENT"
          title="Add New User"
          description="Create a new user account in the system"
          showRoleSelector={true}
          allowedRoles={["CLIENT", "LIVREUR", "MANAGER", "ADMIN"]}
        />
        <AddWarehouseDialog
          open={isAddWarehouseOpen}
          onOpenChange={setIsAddWarehouseOpen}
          onWarehouseAdded={handleWarehouseAdded}
        />
      </div>
    </div>
  );
};

export default DashboardHome;
