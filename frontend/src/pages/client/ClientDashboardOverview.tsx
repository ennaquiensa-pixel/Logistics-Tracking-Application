import React from "react";
import { Truck, CheckCircle, Clock, AlertTriangle, TrendingUp, Package, Users, DollarSign } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ClientDashboardOverview: React.FC = () => {
  const stats = [
    { 
      label: "Active Orders", 
      value: 3, 
      icon: Truck, 
      bgColor: "bg-gray-900",
      iconColor: "text-white",
      borderColor: "border-gray-700"
    },
    { 
      label: "Completed Orders", 
      value: 15, 
      icon: CheckCircle, 
      bgColor: "bg-white",
      iconColor: "text-black",
      borderColor: "border-gray-200"
    },
    { 
      label: "Pending Orders", 
      value: 2, 
      icon: Clock, 
      bgColor: "bg-gray-900",
      iconColor: "text-white",
      borderColor: "border-gray-700"
    },
    { 
      label: "Issues", 
      value: 1, 
      icon: AlertTriangle, 
      bgColor: "bg-white",
      iconColor: "text-black",
      borderColor: "border-gray-200"
    },
  ];

  // Chart data
  const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 5200 },
    { month: 'Mar', revenue: 3800 },
    { month: 'Apr', revenue: 6100 },
    { month: 'May', revenue: 4900 },
    { month: 'Jun', revenue: 7300 },
  ];

  const orderStatusData = [
    { name: 'Delivered', value: 65 },
    { name: 'In Transit', value: 20 },
    { name: 'Processing', value: 10 },
    { name: 'Delayed', value: 5 },
  ];

  const performanceData = [
    { day: 'Mon', orders: 12, revenue: 1200 },
    { day: 'Tue', orders: 19, revenue: 1900 },
    { day: 'Wed', orders: 8, revenue: 800 },
    { day: 'Thu', orders: 15, revenue: 1500 },
    { day: 'Fri', orders: 22, revenue: 2200 },
    { day: 'Sat', orders: 18, revenue: 1800 },
    { day: 'Sun', orders: 11, revenue: 1100 },
  ];

  const COLORS = ['#FFFFFF', '#888888', '#444444', '#000000'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg">
          <p className="text-white font-semibold">{`${label}`}</p>
          <p className="text-white">
            {`${payload[0].dataKey}: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-2">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm">Last updated</p>
            <p className="text-white font-semibold">Just now</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className={`${stat.bgColor} p-6 rounded-xl border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className={`mt-1 ${stat.bgColor === 'bg-white' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {stat.label}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor === 'bg-white' ? 'bg-gray-100' : 'bg-gray-800'}`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend Chart */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Revenue Trend</h3>
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#FFFFFF" 
                strokeWidth={3}
                dot={{ fill: '#FFFFFF', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#FFFFFF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Order Status</h3>
            <Package className="h-5 w-5 text-white" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Weekly Performance</h3>
          <Users className="h-5 w-5 text-white" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="day" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="orders" fill="#FFFFFF" name="Orders" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" fill="#888888" name="Revenue ($)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gray-800 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg. Order Value</p>
              <p className="text-white text-xl font-bold">$245.67</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gray-800 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Success Rate</p>
              <p className="text-white text-xl font-bold">98.2%</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gray-800 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg. Delivery Time</p>
              <p className="text-white text-xl font-bold">2.3 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardOverview;