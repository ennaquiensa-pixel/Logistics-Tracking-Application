import React, { useState } from "react";
import { 
  Bell, 
  Check, 
  Trash2, 
  Filter, 
  Settings, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle, 
  Clock,
  Package,
  Truck,
  Warehouse,
  User
} from "lucide-react";

interface Notification {
  id: string;
  type: "alert" | "info" | "success" | "warning" | "critical";
  category: "delivery" | "warehouse" | "driver" | "system" | "order";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  actionRequired?: boolean;
}

const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const notifications: Notification[] = [
    {
      id: "1",
      type: "warning",
      category: "warehouse",
      title: "Low Stock Alert",
      message: "Warehouse B running low on packaging materials. Current stock: 15%",
      timestamp: "2024-01-15T14:30:00Z",
      read: false,
      priority: "high",
      actionRequired: true
    },
    {
      id: "2",
      type: "critical",
      category: "delivery",
      title: "Delivery Failed",
      message: "Order #ORD-4567 failed delivery attempt. Customer unavailable.",
      timestamp: "2024-01-15T13:15:00Z",
      read: false,
      priority: "high",
      actionRequired: true
    },
    {
      id: "3",
      type: "info",
      category: "driver",
      title: "Driver Offline",
      message: "Driver Omar Hassan went offline unexpectedly.",
      timestamp: "2024-01-15T12:45:00Z",
      read: true,
      priority: "medium"
    },
    {
      id: "4",
      type: "success",
      category: "order",
      title: "Order Completed",
      message: "Order #ORD-4566 delivered successfully 15 minutes ahead of schedule.",
      timestamp: "2024-01-15T11:20:00Z",
      read: true,
      priority: "low"
    },
    {
      id: "5",
      type: "alert",
      category: "system",
      title: "System Maintenance",
      message: "Scheduled maintenance in 2 hours. System may be unavailable for 30 minutes.",
      timestamp: "2024-01-15T10:00:00Z",
      read: false,
      priority: "medium"
    },
    {
      id: "6",
      type: "critical",
      category: "warehouse",
      title: "Equipment Malfunction",
      message: "Forklift #FL-003 requires immediate maintenance in Warehouse A.",
      timestamp: "2024-01-15T09:30:00Z",
      read: false,
      priority: "high",
      actionRequired: true
    },
    {
      id: "7",
      type: "warning",
      category: "delivery",
      title: "Route Delay",
      message: "Heavy traffic reported on Route 5. Expected delays of 20-30 minutes.",
      timestamp: "2024-01-15T08:45:00Z",
      read: true,
      priority: "medium"
    },
    {
      id: "8",
      type: "info",
      category: "driver",
      title: "New Driver Onboarded",
      message: "Sarah Johnson completed training and is now available for deliveries.",
      timestamp: "2024-01-14T16:20:00Z",
      read: true,
      priority: "low"
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "action") return notification.actionRequired;
    return notification.category === filter || notification.type === filter;
  });

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert": return <AlertTriangle className="h-5 w-5" />;
      case "info": return <Info className="h-5 w-5" />;
      case "success": return <CheckCircle className="h-5 w-5" />;
      case "warning": return <AlertTriangle className="h-5 w-5" />;
      case "critical": return <XCircle className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getCategoryIcon = (category: Notification["category"]) => {
    switch (category) {
      case "delivery": return <Package className="h-4 w-4" />;
      case "warehouse": return <Warehouse className="h-4 w-4" />;
      case "driver": return <User className="h-4 w-4" />;
      case "system": return <Settings className="h-4 w-4" />;
      case "order": return <Truck className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "alert": return "bg-blue-100 text-blue-800 border-blue-200";
      case "info": return "bg-gray-100 text-gray-800 border-gray-200";
      case "success": return "bg-green-100 text-green-800 border-green-200";
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const markAsRead = (id: string) => {
    // In a real app, this would update the notification in the backend
    console.log(`Marked notification ${id} as read`);
  };

  const markAllAsRead = () => {
    // In a real app, this would update all notifications in the backend
    console.log("Marked all notifications as read");
  };

  const deleteNotification = (id: string) => {
    // In a real app, this would delete the notification from the backend
    console.log(`Deleted notification ${id}`);
  };

  const deleteSelected = () => {
    // In a real app, this would delete selected notifications from the backend
    selectedNotifications.forEach(id => console.log(`Deleted notification ${id}`));
    setSelectedNotifications([]);
  };

  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(notificationId => notificationId !== id) : [...prev, id]
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length;

  return (
    <div className="p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications & Alerts</h1>
          <p className="text-gray-400">
            Stay updated with real-time alerts and system notifications
          </p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 border border-white text-white px-4 py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-200"
          >
            <Check className="h-5 w-5" />
            Mark All Read
          </button>
          {selectedNotifications.length > 0 && (
            <button 
              onClick={deleteSelected}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              <Trash2 className="h-5 w-5" />
              Delete Selected ({selectedNotifications.length})
            </button>
          )}
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 border border-white text-white px-4 py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-200"
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Notifications</p>
              <p className="text-2xl font-bold text-black">{notifications.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Unread</p>
              <p className="text-2xl font-bold text-black">{unreadCount}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Action Required</p>
              <p className="text-2xl font-bold text-black">{actionRequiredCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Critical Alerts</p>
              <p className="text-2xl font-bold text-black">
                {notifications.filter(n => n.priority === "high").length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <XCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All Notifications" },
                { value: "unread", label: "Unread" },
                { value: "action", label: "Action Required" },
                { value: "critical", label: "Critical" },
                { value: "delivery", label: "Delivery" },
                { value: "warehouse", label: "Warehouse" },
                { value: "driver", label: "Driver" },
                { value: "system", label: "System" }
              ].map((filterOption) => (
                <button
                  key={filterOption.value}
                  onClick={() => setFilter(filterOption.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === filterOption.value
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedNotifications(filteredNotifications.map(n => n.id));
                      } else {
                        setSelectedNotifications([]);
                      }
                    }}
                    checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Notification</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <tr 
                  key={notification.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => toggleSelectNotification(notification.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold text-sm ${
                            !notification.read ? 'text-black' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h3>
                          {notification.actionRequired && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Action Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      {getCategoryIcon(notification.category)}
                      <span className="capitalize">{notification.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(notification.priority)}`} />
                      <span className="text-sm font-medium capitalize">{notification.priority}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {getTimeAgo(notification.timestamp)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">You're all caught up! No notifications match your current filters.</p>
          </div>
        )}
      </div>

      {/* Notification Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <p className="text-gray-600">Configure your notification preferences and alert settings.</p>
              {/* Add notification settings form here */}
              <button 
                onClick={() => setShowSettings(false)}
                className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;