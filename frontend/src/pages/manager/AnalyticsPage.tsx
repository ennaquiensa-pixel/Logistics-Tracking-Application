import React, { useState } from "react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Tooltip, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  AreaChart, 
  Area,
  LineChart,
  Line,
  Legend
} from "recharts";
import { Download, Filter, Calendar, TrendingUp, Users, Package, Clock, DollarSign, Star, Award } from "lucide-react";

// Mock data for various charts
const deliveryStatusData = [
  { name: "Delivered", value: 80, color: "#16a34a" },
  { name: "In Progress", value: 12, color: "#2563eb" },
  { name: "Pending", value: 5, color: "#f59e0b" },
  { name: "Failed", value: 3, color: "#dc2626" },
];

const weeklyPerformanceData = [
  { day: "Mon", deliveries: 45, completed: 42, revenue: 1200 },
  { day: "Tue", deliveries: 52, completed: 48, revenue: 1450 },
  { day: "Wed", deliveries: 48, completed: 45, revenue: 1350 },
  { day: "Thu", deliveries: 60, completed: 56, revenue: 1680 },
  { day: "Fri", deliveries: 55, completed: 52, revenue: 1580 },
  { day: "Sat", deliveries: 40, completed: 38, revenue: 1150 },
  { day: "Sun", deliveries: 35, completed: 33, revenue: 980 },
];

const driverPerformanceData = [
  { name: "Hassan B.", deliveries: 156, rating: 4.8, efficiency: 95 },
  { name: "Fatima Z.", deliveries: 142, rating: 4.7, efficiency: 92 },
  { name: "Karim M.", deliveries: 138, rating: 4.6, efficiency: 89 },
  { name: "Aisha T.", deliveries: 125, rating: 4.5, efficiency: 87 },
  { name: "Youssef A.", deliveries: 118, rating: 4.4, efficiency: 84 },
];

const revenueData = [
  { month: "Jan", revenue: 45000, profit: 12000 },
  { month: "Feb", revenue: 52000, profit: 14500 },
  { month: "Mar", revenue: 48000, profit: 13500 },
  { month: "Apr", revenue: 61000, profit: 18500 },
  { month: "May", revenue: 58000, profit: 16800 },
  { month: "Jun", revenue: 65000, profit: 19500 },
];

const categoryDistributionData = [
  { category: "Electronics", deliveries: 45, value: 125000 },
  { category: "Fashion", deliveries: 38, value: 45000 },
  { category: "Home Appliances", deliveries: 28, value: 85000 },
  { category: "Sports", deliveries: 22, value: 32000 },
  { category: "Office", deliveries: 18, value: 28000 },
];

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("week");
  const [activeTab, setActiveTab] = useState<string>("overview");

  const stats = [
    { 
      label: "Total Deliveries", 
      value: "1,284", 
      change: "+12%", 
      trend: "up",
      icon: Package,
      color: "blue"
    },
    { 
      label: "Success Rate", 
      value: "94.2%", 
      change: "+2.1%", 
      trend: "up",
      icon: TrendingUp,
      color: "green"
    },
    { 
      label: "Avg Delivery Time", 
      value: "2.4h", 
      change: "-15min", 
      trend: "down",
      icon: Clock,
      color: "purple"
    },
    { 
      label: "Revenue", 
      value: "$45.8K", 
      change: "+8.5%", 
      trend: "up",
      icon: DollarSign,
      color: "yellow"
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics & Reports</h1>
          <p className="text-gray-400">
            Comprehensive insights into your logistics performance and metrics
          </p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-3 border border-white bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="flex items-center gap-2 border border-white text-white px-4 py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-200">
            <Filter className="h-5 w-5" />
            Filters
          </button>
          <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105">
            <Download className="h-5 w-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-8">
        {["overview", "performance", "revenue", "drivers"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium capitalize transition-colors ${
              activeTab === tab
                ? "text-white border-b-2 border-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Delivery Status Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-black">Delivery Status Distribution</h2>
            <div className="text-sm text-gray-500">This Week</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deliveryStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
              >
                {deliveryStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Performance */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-black">Weekly Performance</h2>
            <div className="flex gap-2 text-sm">
              <span className="flex items-center gap-1 text-gray-600">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                Deliveries
              </span>
              <span className="flex items-center gap-1 text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                Completed
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="deliveries" fill="#2563eb" name="Total Deliveries" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#16a34a" name="Completed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-black">Revenue Trend</h2>
            <div className="text-green-600 font-semibold">↑ 15.2% growth</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#16a34a" fill="url(#colorRevenue)" name="Revenue" />
              <Area type="monotone" dataKey="profit" stroke="#2563eb" fill="url(#colorProfit)" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Driver Performance */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-black">Top Driver Performance</h2>
            <Award className="h-6 w-6 text-yellow-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={driverPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis type="category" dataKey="name" stroke="#6b7280" width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="deliveries" fill="#8b5cf6" name="Deliveries" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-semibold text-black mb-6">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="deliveries" fill="#f59e0b" name="Deliveries" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="value" stroke="#dc2626" name="Value ($)" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Efficiency Metrics */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-semibold text-black mb-6">Key Performance Indicators</h2>
          <div className="space-y-4">
            {[
              { metric: "On-time Delivery Rate", value: "94.2%", target: "95%", progress: 94.2 },
              { metric: "Customer Satisfaction", value: "4.7/5", target: "4.8/5", progress: 94 },
              { metric: "First Attempt Success", value: "88.5%", target: "90%", progress: 88.5 },
              { metric: "Fuel Efficiency", value: "8.2 km/L", target: "8.5 km/L", progress: 96.5 },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">{item.metric}</span>
                  <span className="font-semibold text-black">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Current: {item.value}</span>
                  <span>Target: {item.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;