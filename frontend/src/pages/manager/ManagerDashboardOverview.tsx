import React, { useEffect, useState } from "react";
import {
  Truck,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Package,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import deliveryService from "../../services/DeliveryService";
import {
  EtatLivraison,
  type LivraisonResponse,
  type RecentActivityDTO,
  type WeeklyPerformanceDTO,
} from "../../types/deliveryTypes/deliveryTypes";
import userService from "../../services/UserService";
import type { LivreurResponse } from "../../types/UserTypes";

const ManagerDashboardOverview: React.FC = () => {
  const deliveryData = [
    { name: "Mon", deliveries: 12, completed: 10, time: 2.4 },
    { name: "Tue", deliveries: 18, completed: 15, time: 2.1 },
    { name: "Wed", deliveries: 20, completed: 17, time: 1.9 },
    { name: "Thu", deliveries: 25, completed: 22, time: 1.8 },
    { name: "Fri", deliveries: 30, completed: 28, time: 1.7 },
    { name: "Sat", deliveries: 22, completed: 20, time: 1.9 },
    { name: "Sun", deliveries: 15, completed: 14, time: 2.2 },
  ];

  const [activeDeliveries, setActiveDeliveries] = useState<number>(0);
  const [weeklyPerformance, setWeeklyPerformance] = useState<WeeklyPerformanceDTO[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivityDTO[]>([]);
  const [allLivraisons, setAllLivraisons] = useState<LivraisonResponse[]>([]);
  const [availableLivreurs, setAvailableLivreurs] = useState<LivreurResponse[]>([]);

  useEffect(() => {
    const getAllLivraisons = async () => {
      try {
        const response = await deliveryService.getAllLivraisons();
        setAllLivraisons(response.content); // ← ajoute .content
      } catch (error) {
        setAllLivraisons([]);
      }
    };

    const getActiveDeliveries = async () => {
      try {
        const response = await deliveryService.getActiveLivraisons();
        setActiveDeliveries(response.length);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setActiveDeliveries(0);
      }
    };

    const fetchWeeklyPerformance = async () => {
      try {
        const data = await deliveryService.getWeeklyPerformance();
        setWeeklyPerformance(data);
      } catch (error) {
        console.error("Error fetching weekly performance:", error);
      }
    };

    const fetchRecentActivities = async () => {
      try {
        const data = await deliveryService.getRecentActivities();
        setRecentActivities(data);
      } catch (error) {
        console.log("Error fetching recent activities", error);
      }
    };

    fetchRecentActivities();
    fetchWeeklyPerformance();
    getActiveDeliveries();
    getAllLivraisons();
  }, []);

  useEffect(() => {
    const fetchAvailableLivreurs = async () => {
      try {
        const response = await userService.getAvailableLivreurs();
        setAvailableLivreurs(response);
      } catch (error) {}
    };
    fetchAvailableLivreurs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LIVREE":
        return "#10B981";
      case "In Progress":
        return "#F59E0B";
      case "Pickup":
        return "#6366F1";
      case "Delayed":
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  const roleColor = "#818CF8";

  const stats = [
    {
      icon: Truck,
      label: "Active Deliveries",
      value: activeDeliveries,
      description: "In transit",
      trendPositive: true,
    },
    {
      icon: CheckCircle,
      label: "Completed (Week)",
      value: allLivraisons.filter(
        (livraison) => livraison.etat === EtatLivraison.LIVREE
      ).length,
      description: "Successful",
      trendPositive: true,
    },
    {
      icon: Clock,
      label: "Pending Orders",
      value: allLivraisons.filter(
        (livraison) => livraison.etat === EtatLivraison.EN_ATTENTE
      ).length,
      description: "Awaiting pickup",
      trendPositive: true,
    },
    {
      icon: Users,
      label: "Active Drivers",
      value: availableLivreurs.length,
      description: "Online now",
      trendPositive: true,
    },
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
      name: "Retournee",
      value: allLivraisons.filter(
        (livraison) => livraison.etat === EtatLivraison.RETOURNEE
      ).length,
      color: "#EF4444",
    },
  ];

  const isDataEmpty = deliveryStatusData.every((entry) => entry.value === 0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF]/5 via-white to-[#818CF8]/5"></div>
        {/* Floating particles */}
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

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
                 style={{
                   backgroundColor: `${roleColor}15`,
                   color: roleColor
                 }}>
              <BarChart3 className="h-3 w-3" />
              <span>Manager Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#1f2937' }}>
              Dashboard Overview
            </h1>
            <p className="text-lg" style={{ color: '#6b7280' }}>
              Welcome back! Here's your logistics performance summary.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(224, 231, 255, 0.5)',
                color: roleColor,
                boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
              }}
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: roleColor,
                color: '#FFFFFF',
                boxShadow: `0 4px 20px ${roleColor}40`
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map(({ icon: Icon, label, value, description }, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer"
              style={{
                border: '1px solid rgba(224, 231, 255, 0.5)',
                boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                     style={{ backgroundColor: `${roleColor}15` }}>
                  <Icon className="h-6 w-6" style={{ color: roleColor }} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: '#6b7280' }}>{label}</p>
                <h2 className="text-2xl font-bold transition-all duration-500 group-hover:scale-110" 
                     style={{ color: '#1f2937' }}>
                  {value}
                </h2>
                <p className="text-sm mt-2" style={{ color: '#9CA3AF' }}>{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className={`${isDataEmpty ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-6 grid mb-8`}>
          {/* Deliveries Performance */}
          <div className="bg-white rounded-2xl p-6"
               style={{
                 border: '1px solid rgba(224, 231, 255, 0.5)',
                 boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
               }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold" style={{ color: '#1f2937' }}>
                Weekly Delivery Performance
              </h2>
              <div className="flex gap-3">
                <span className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: roleColor }}></div>
                  <span style={{ color: '#6b7280' }}>Total</span>
                </span>
                <span className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10B981' }}></div>
                  <span style={{ color: '#6b7280' }}>Completed</span>
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={!weeklyPerformance.every((entry) => entry.completed === 0) ? weeklyPerformance : deliveryData}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(224, 231, 255, 0.5)',
                    color: '#1f2937',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                  }}
                />
                <Bar
                  dataKey="deliveries"
                  fill={roleColor}
                  name="Total Deliveries"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="completed"
                  fill="#10B981"
                  name="Completed"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Delivery Status Pie Chart */}
          {!isDataEmpty && (
            <div className="bg-white rounded-2xl p-6"
                 style={{
                   border: '1px solid rgba(224, 231, 255, 0.5)',
                   boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
                 }}>
              <h2 className="text-lg font-bold mb-6" style={{ color: '#1f2937' }}>
                Delivery Status Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deliveryStatusData.filter((entry) => entry.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    label
                  >
                    {deliveryStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Activities & Trends */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl"
               style={{
                 border: '1px solid rgba(224, 231, 255, 0.5)',
                 boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
               }}>
            <div className="flex justify-between items-center p-6 border-b"
                 style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1f2937' }}>
                Recent Activities
              </h2>
              <span className="text-sm" style={{ color: '#9CA3AF' }}>Live updates</span>
            </div>
            <div className="p-4">
              {recentActivities.slice(0 , 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow mb-3 group"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(224, 231, 255, 0.5)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                         style={{ backgroundColor: `${roleColor}15` }}>
                      <Truck className="h-5 w-5" style={{ color: roleColor }} />
                    </div>
                    <div>
                      <p className="font-medium transition-colors duration-300 group-hover:text-[#818CF8]"
                         style={{ color: '#1f2937' }}>
                        {activity.driver}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                        <span style={{ color: '#6b7280' }}>{activity.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm" style={{ color: getStatusColor(activity.status) }}>
                      {activity.status}
                    </p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Average Delivery Time Trend */}
          <div className="bg-white rounded-2xl p-6"
               style={{
                 border: '1px solid rgba(224, 231, 255, 0.5)',
                 boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
               }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold" style={{ color: '#1f2937' }}>
                Average Delivery Time Trend
              </h2>
              <div className="text-sm font-medium" style={{ color: '#10B981' }}>
                ↓ 15% improvement
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={!weeklyPerformance.every((entry) => entry.completed === 0) ? weeklyPerformance : deliveryData}
              >
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={roleColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={roleColor} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(224, 231, 255, 0.5)',
                    color: '#1f2937',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="time"
                  stroke={roleColor}
                  fill="url(#colorTime)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default ManagerDashboardOverview;