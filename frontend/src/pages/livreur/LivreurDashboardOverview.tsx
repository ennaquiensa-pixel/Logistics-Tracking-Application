import React, { useEffect, useState } from "react";
import {
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  DollarSign,
  Star,
  TrendingUp,
  Navigation,
  Package,
  User,
  Phone,
  MessageCircle,
  MoreVertical,
  RefreshCw,
  BarChart3,
  Award,
  TruckIcon,
  Mail,
  PhoneCall,
  MessagesSquare,
  LocateFixed,
  CurrencyIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import deliveryService from "../../services/DeliveryService";
import {
  EtatLivraison,
  type LivraisonResponse,
} from "../../types/deliveryTypes/deliveryTypes";
import SimpleLoader from "../../components/SimpleLoader"; // Import SimpleLoader
import { toast } from "react-toastify";
import UpdateUserDialog from "../../components/UpdateUserDialog";
import userService from "../../services/UserService";

const LivreurDashboardOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("today");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [phone, setPhone] = useState<string>("");
  const [createdAt , setCreatedAt] = useState<string>("")
  const [livreurDeliveries, setLivreurDeliveries] = useState<
    LivraisonResponse[]
  >([]);
  const [loading, setLoading] = useState({
    deliveries: true,
    stats: true,
  });

  const roleColor = "#818CF8";
  const { user, setUser } = useAuth();

  const handleUserUpdated = async (updatedUser: any) => {
    try {
      if (!user?.userId) {
        toast.error("Utilisateur non trouvé");
        return;
      }

      // Fetch fresh user data from the server
      const freshUserResponse = await userService.getUserById(
        Number(user.userId)
      );
      const freshUser = {
        userId: freshUserResponse.idUser,
        email: freshUserResponse.email,
        role: freshUserResponse.role,
        nom: freshUserResponse.nom,
      };
      // Update the auth context
      setUser(freshUser);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(freshUser));

      toast.success("Profil mis à jour avec succès!");
    } catch (error) {
      console.error("Error updating user context:", error);
      toast.error("Profil mis à jour, mais erreur lors du rafraîchissement");
    }
  };
  useEffect(() => {
    const getLivraisonsByDriver = async () => {
      try {
        setLoading((prev) => ({ ...prev, deliveries: true, stats: true }));
        const response = await deliveryService.getLivraisonsByDriver(
          Number(user?.userId)
        );
        setLivreurDeliveries(response);
      } catch (error) {
        console.log(error);
        setLivreurDeliveries([]);
      } finally {
        setLoading((prev) => ({ ...prev, deliveries: false, stats: false }));
      }
    };

    const userPhone = async()=>{
      try {
        const res = await userService.getUserById(Number(user?.userId));
        setPhone(String(res.telephone).trim())
        setCreatedAt(String(res.createdAt).trim())
      } catch (error) {
        console.log(error);
      }
    }

    if (user?.userId) {
      getLivraisonsByDriver();
      userPhone();
    }
  }, [user?.userId]);


  // Calculate delivery statistics
  const activeDeliveriesCount = livreurDeliveries.filter(
    (delivery) => delivery.etat === EtatLivraison.EN_COURS
  ).length;
  const completedDeliveriesCount = livreurDeliveries.filter(
    (delivery) => delivery.etat === EtatLivraison.LIVREE
  ).length;
  const pendingDeliveriesCount = livreurDeliveries.filter(
    (delivery) => delivery.etat === EtatLivraison.EN_ATTENTE
  ).length;
  const assignedDeliveriesCount = livreurDeliveries.filter(
    (delivery) => delivery.etat === EtatLivraison.ASSIGNEE
  ).length;

  const livreurGain = livreurDeliveries
    .filter((delivery) => delivery.etat === EtatLivraison.LIVREE)
    .reduce((sum, item) => sum + (item.prixLivraison ?? 0), 0)
    .toFixed(2);

    const livreurGainNumber = parseFloat(livreurGain);
console.log(typeof livreurGainNumber)
  // Driver stats data
  const stats = [
    // {
    //   icon: Truck,
    //   label: "Livraisons Actives",
    //   value: loading.deliveries ? <SimpleLoader size="small" /> : activeDeliveriesCount,
    //   description: "En cours",
    //   color: roleColor,
    //   trend: "+2 depuis hier"
    // },
    // {
    //   icon: CheckCircle,
    //   label: "Livraisons Terminées",
    //   value: loading.deliveries ? <SimpleLoader size="small" /> : completedDeliveriesCount,
    //   description: "Réussies",
    //   color: "#10B981",
    //   trend: "Dans les temps"
    // },
    // {
    //   icon: Clock,
    //   label: "En Attente",
    //   value: loading.deliveries ? <SimpleLoader size="small" /> : pendingDeliveriesCount,
    //   description: "À récupérer",
    //   color: "#F59E0B",
    //   trend: "-1 depuis ce matin"
    // },
    {
      icon: CurrencyIcon,
      label: "Gains du Jour",
      value: !livreurGainNumber ? <SimpleLoader  /> : livreurGainNumber + "DH",
      description: "",
      color: "#8B5CF6",
      trend: " ",
    },
  ];

  // Performance metrics
  const performanceData = [
    { day: "Lun", deliveries: 8, earnings: 180 },
    { day: "Mar", deliveries: 12, earnings: 245 },
    { day: "Mer", deliveries: 10, earnings: 210 },
    { day: "Jeu", deliveries: 14, earnings: 285 },
    { day: "Ven", deliveries: 11, earnings: 235 },
    { day: "Sam", deliveries: 9, earnings: 195 },
    { day: "Dim", deliveries: 6, earnings: 145 },
  ];

  // Delivery status breakdown
  const deliveryStatusData = [
    { status: "Terminées", count: completedDeliveriesCount, color: "#10B981" },
    { status: "En Cours", count: activeDeliveriesCount, color: "#6366F1" },
    { status: "En Attente", count: pendingDeliveriesCount, color: "#F59E0B" },
    { status: "Assignee", count: assignedDeliveriesCount, color: "#EF4444" },
  ].filter((item) => item.count > 0); // Only show statuses with deliveries

  // Today's deliveries (for now, using sample data)
  const todaysDeliveries = [
    {
      id: 1,
      orderId: "ORD-4567",
      customer: "Ahmed Benali",
      address: "123 Downtown St, Casablanca",
      status: "in_progress",
      scheduledTime: "14:30",
      priority: "high",
      phone: "+212 612-345-678",
    },
    {
      id: 2,
      orderId: "ORD-4568",
      customer: "Fatima Zahra",
      address: "456 Business District",
      status: "pending",
      scheduledTime: "15:15",
      priority: "medium",
      phone: "+212 623-456-789",
    },
    {
      id: 3,
      orderId: "ORD-4569",
      customer: "Karim Mohamed",
      address: "789 Residential Area",
      status: "pending",
      scheduledTime: "16:00",
      priority: "low",
      phone: "+212 634-567-890",
    },
    {
      id: 4,
      orderId: "ORD-4570",
      customer: "Sarah Johnson",
      address: "321 Industrial Zone",
      status: "completed",
      scheduledTime: "13:45",
      priority: "high",
      phone: "+212 645-678-901",
    },
  ];

  const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
  // Driver profile info
  const driverProfile = {
    name: user?.nom,
    rating: user?.email,
    totalDeliveries: completedDeliveriesCount,
    memberSince: formatDate(createdAt),
    vehicle: "Toyota Hilux - ABC123",
    currentLocation: "Downtown Casablanca",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10B981";
      case "in_progress":
        return "#6366F1";
      case "pending":
        return "#F59E0B";
      default:
        return "#9CA3AF";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminée";
      case "in_progress":
        return "En Cours";
      case "pending":
        return "En Attente";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#10B981";
      default:
        return "#9CA3AF";
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="bg-white border p-4 rounded-xl shadow-xl"
          style={{
            borderColor: "rgba(224, 231, 255, 0.5)",
            boxShadow: "0 10px 30px -10px rgba(129, 140, 248, 0.1)",
          }}
        >
          <p className="font-bold mb-2" style={{ color: "#1f2937" }}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm font-medium"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleRefresh = async () => {
    try {
      setLoading((prev) => ({ ...prev, deliveries: true, stats: true }));
      const response = await deliveryService.getLivraisonsByDriver(
        Number(user?.userId)
      );
      setLivreurDeliveries(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading((prev) => ({ ...prev, deliveries: false, stats: false }));
    }
  };

  // if (loading.deliveries && livreurDeliveries.length === 0) {
  //   return (
  //     <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
  //       <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF]/5 via-white to-[#818CF8]/5"></div>
  //       <div className="relative z-10 text-center">
  //         <SimpleLoader />
  //         <p className="mt-4 text-lg" style={{ color: '#6b7280' }}>
  //           Chargement de votre tableau de bord...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF]/5 via-white to-[#818CF8]/5"></div>
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
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-500 hover:scale-110 hover:rotate-6 group"
              style={{ backgroundColor: `${roleColor}15` }}
            >
              <TruckIcon style={{ color: roleColor }} />
            </div>
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-2"
                style={{
                  backgroundColor: `${roleColor}15`,
                  color: roleColor,
                }}
              >
                <User className="h-3 w-3" />
                <span>Tableau de Bord Livreur</span>
              </div>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 capitalize"
                style={{ color: "#1f2937" }}
              >
                {user?.nom ? `Welcome Back, ${user.nom} !` : "Welcome Back, Livreur !"}
              </h1>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(224, 231, 255, 0.5)",
              color: roleColor,
              boxShadow: "0 4px 20px rgba(129, 140, 248, 0.1)",
            }}
            disabled={loading.deliveries}
          >
            {loading.deliveries ? (
              <>
                <SimpleLoader size="small" />
                <span>Actualisation...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Actualiser</span>
              </>
            )}
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map(
            (
              { icon: Icon, label, value, description, color, trend },
              index
            ) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer"
                style={{
                  border: "1px solid rgba(224, 231, 255, 0.5)",
                  boxShadow: "0 10px 30px -10px rgba(129, 140, 248, 0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${color}15`,
                      color,
                    }}
                  >
                    {trend}
                  </span>
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold transition-all duration-500 group-hover:scale-110 min-h-[40px] flex items-center"
                    style={{ color: "#1f2937" }}
                  >
                    {value}
                  </h2>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "#6b7280" }}
                  >
                    {label}
                  </p>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>
                    {description}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Performance Chart */}
          <div
            className="xl:col-span-2 bg-white rounded-2xl p-6"
            style={{
              border: "1px solid rgba(224, 231, 255, 0.5)",
              boxShadow: "0 10px 30px -10px rgba(129, 140, 248, 0.1)",
            }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-lg font-bold" style={{ color: "#1f2937" }}>
                Performance Hebdomadaire
              </h2>
              <div className="flex gap-2">
                {["today", "week", "month"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all duration-300 hover:scale-105 ${
                      activeTab === tab ? "text-white" : "text-gray-700"
                    }`}
                    style={{
                      backgroundColor:
                        activeTab === tab
                          ? roleColor
                          : "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(224, 231, 255, 0.5)",
                      boxShadow: "0 4px 20px rgba(129, 140, 248, 0.1)",
                    }}
                  >
                    {tab === "today"
                      ? "Aujourd'hui"
                      : tab === "week"
                      ? "Semaine"
                      : "Mois"}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis yAxisId="left" stroke="#6B7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  yAxisId="left"
                  dataKey="deliveries"
                  fill={roleColor}
                  name="Livraisons"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="earnings"
                  fill="#10B981"
                  name="Gains (€)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Delivery Status & Profile */}
          <div className="space-y-6">
            {/* Delivery Status */}
            <div
              className="bg-white rounded-2xl p-6"
              style={{
                border: "1px solid rgba(224, 231, 255, 0.5)",
                boxShadow: "0 10px 30px -10px rgba(129, 140, 248, 0.1)",
              }}
            >
              <h2
                className="text-lg font-bold mb-6"
                style={{ color: "#1f2937" }}
              >
                Statut des Livraisons
              </h2>
              {loading.deliveries ||
              deliveryStatusData.filter((item) => item.count > 0).length ===
                0 ? (
                <div className="h-[200px] flex flex-col items-center justify-center">
                  <SimpleLoader />
                  <p className="mt-4 text-sm" style={{ color: "#6b7280" }}>
                    {loading.deliveries
                      ? "Chargement des données..."
                      : "Aucune livraison disponible"}
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={deliveryStatusData.filter((item) => item.count > 0)}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      label={({ status, count }) => `${status}: ${count}`}
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

            {/* Driver Profile Summary */}
            <div
              className="bg-white rounded-2xl p-6"
              style={{
                border: "1px solid rgba(224, 231, 255, 0.5)",
                boxShadow: "0 10px 30px -10px rgba(129, 140, 248, 0.1)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold" style={{ color: "#1f2937" }}>
                  Votre Profil
                </h2>
                <div className="flex items-center gap-1">
                  <Mail className="h-5 w-5" style={{ color: "#F59E0B" }} />
                  <span className="font-bold" style={{ color: "#1f2937" }}>
                    {driverProfile.rating}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#6b7280" }}>Phone Number</span>
                  <span className="font-bold" style={{ color: "#1f2937" }}>
                    {!phone ? <SimpleLoader/> : phone}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#6b7280" }}>Livraisons Total</span>
                  <span className="font-bold" style={{ color: "#1f2937" }}>
                    {!driverProfile.totalDeliveries ? <SimpleLoader/> : driverProfile.totalDeliveries}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#6b7280" }}>Membre depuis</span>
                  <span className="font-bold" style={{ color: "#1f2937" }}>
                    {!driverProfile.memberSince ? <SimpleLoader/> : driverProfile.memberSince}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#6b7280" }}>Véhicule</span>
                  <span className="font-bold" style={{ color: "#1f2937" }}>
                    {driverProfile.vehicle}
                  </span>
                </div>
                <div
                  className="pt-4 border-t"
                  style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}
                >
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsUpdateDialogOpen(true)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: roleColor,
                        color: "#FFFFFF",
                        boxShadow: `0 4px 20px ${roleColor}40`,
                      }}
                    >
                      <User className="h-4 w-4" />
                      Mettre à Jour
                    </button>
                    <button
                      className="p-2.5 rounded-lg transition-all duration-300 hover:scale-110"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid rgba(224, 231, 255, 0.5)",
                        color: roleColor,
                        boxShadow: "0 4px 20px rgba(129, 140, 248, 0.1)",
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Deliveries */}
        <div
          className="bg-white rounded-2xl mb-8"
          style={{
            border: "1px solid rgba(224, 231, 255, 0.5)",
            boxShadow: "0 10px 30px -10px rgba(129, 140, 248, 0.1)",
          }}
        >
          <div
            className="flex justify-between items-center p-6 border-b"
            style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}
          >
            <h2 className="text-lg font-bold" style={{ color: "#1f2937" }}>
              Livraisons du Jour
            </h2>
            {loading.deliveries ? (
              <div className="flex items-center gap-2">
                <SimpleLoader size="small" />
                <span className="text-sm" style={{ color: "#9CA3AF" }}>
                  Chargement...
                </span>
              </div>
            ) : (
              <span className="text-sm" style={{ color: "#9CA3AF" }}>
                Dernière mise à jour: À l'instant
              </span>
            )}
          </div>

          <div className="p-4">
            {loading.deliveries ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((skeleton) => (
                  <div
                    key={skeleton}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl animate-pulse"
                    style={{
                      backgroundColor: "rgba(249, 250, 251, 0.9)",
                      border: "1px solid rgba(224, 231, 255, 0.5)",
                    }}
                  >
                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 rounded-xl bg-gray-200"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-3 w-32 bg-gray-200 rounded"></div>
                        <div className="h-3 w-40 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : todaysDeliveries.length > 0 ? (
              <div className="space-y-4">
                {livreurDeliveries
                  .filter((delivery) => delivery.distanceKm != 0)
                  .map((delivery) => (
                    <div
                      key={delivery.idLivraison}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid rgba(224, 231, 255, 0.5)",
                        boxShadow: "0 4px 20px rgba(129, 140, 248, 0.1)",
                      }}
                    >
                      {/* LEFT */}
                      <div className="flex items-start gap-4 mb-4 sm:mb-0">
                        <div
                          className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                          style={{ backgroundColor: `${roleColor}15` }}
                        >
                          <Package
                            className="h-6 w-6"
                            style={{ color: roleColor }}
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className="font-bold text-sm transition-colors duration-300 group-hover:text-[#818CF8]"
                              style={{ color: "#1f2937" }}
                            >
                              Order #{delivery.orderId}
                            </span>

                            <span
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-105"
                              style={{
                                backgroundColor: `${getPriorityColor(
                                  String(delivery.distanceKm)
                                )}15`,
                                color: getPriorityColor(
                                  String(delivery.distanceKm)
                                ),
                              }}
                            >
                              {delivery.distanceKm} km
                            </span>
                          </div>

                          <p
                            className="font-medium text-sm mb-1"
                            style={{ color: "#1f2937" }}
                          >
                            Client ID: {delivery.clientId}
                          </p>

                          <div className="flex items-center gap-1 text-sm">
                            <MapPin
                              className="h-3 w-3"
                              style={{ color: "#9CA3AF" }}
                            />
                            <span style={{ color: "#6b7280" }}>
                              {delivery.adresseDestination.ville}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex flex-col items-start sm:items-end gap-2">
                          <span
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 group-hover:scale-105"
                            style={{
                              backgroundColor: `${getStatusColor(
                                delivery.etat
                              )}15`,
                              color: getStatusColor(delivery.etat),
                            }}
                          >
                            {getStatusText(delivery.etat)}
                          </span>

                          <p className="text-xs" style={{ color: "#9CA3AF" }}>
                            {delivery.dateLivraisonPrevue}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                            style={{
                              backgroundColor: `${roleColor}15`,
                              color: roleColor,
                            }}
                            title="Call Client"
                          >
                            {/* Optional nicer icon: PhoneCall */}
                            <PhoneCall className="h-4 w-4" />
                          </button>

                          <button
                            className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                            style={{
                              backgroundColor: `#10B98115`,
                              color: "#10B981",
                            }}
                            title="Send Message"
                          >
                            {/* Optional nicer icon: MessagesSquare */}
                            <MessagesSquare className="h-4 w-4" />
                          </button>

                          <button
                            className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                            style={{
                              backgroundColor: `#6366F115`,
                              color: "#6366F1",
                            }}
                            title="Navigate"
                          >
                            {/* Optional nicer icon: LocateFixed */}
                            <LocateFixed className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Truck
                  className="h-16 w-16 mx-auto mb-6"
                  style={{ color: "#E0E7FF" }}
                />
                <p className="text-lg mb-2" style={{ color: "#6b7280" }}>
                  Aucune livraison programmée aujourd'hui
                </p>
                <p className="text-sm" style={{ color: "#9CA3AF" }}>
                  Consultez vos livraisons à venir ou contactez votre
                  responsable
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <UpdateUserDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        onUserUpdated={handleUserUpdated}
        user={{
          id: Number(user?.userId),
          nom: user?.nom || "",
          email: user?.email || "",
          telephone: "",
        }}
      />
    </div>
  );
};

export default LivreurDashboardOverview;
