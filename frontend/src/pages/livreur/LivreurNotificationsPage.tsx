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
  MapPin,
  User,
  Phone,
  MessageCircle,
  Navigation
} from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "critical" | "assignment";
  category: "delivery" | "system" | "customer" | "route" | "payment";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  actionRequired?: boolean;
  relatedOrder?: string;
  customerPhone?: string;
  deliveryAddress?: string;
}

const LivreurNotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const notifications: Notification[] = [
    {
      id: "1",
      type: "assignment",
      category: "delivery",
      title: "New Delivery Assigned",
      message: "You have been assigned a new delivery. Order #ORD-4572 to Downtown area.",
      timestamp: "2024-01-15T14:25:00Z",
      read: false,
      priority: "high",
      actionRequired: true,
      relatedOrder: "ORD-4572",
      customerPhone: "+212 612-345-678",
      deliveryAddress: "123 Downtown Street, Casablanca"
    },
    {
      id: "2",
      type: "warning",
      category: "route",
      title: "Route Delay Alert",
      message: "Heavy traffic reported on your current route. Expected delay: 15-20 minutes.",
      timestamp: "2024-01-15T13:45:00Z",
      read: false,
      priority: "medium",
      actionRequired: false
    },
    {
      id: "3",
      type: "info",
      category: "customer",
      title: "Customer Update",
      message: "Customer requested delivery between 15:00-16:00. Please adjust schedule.",
      timestamp: "2024-01-15T12:30:00Z",
      read: true,
      priority: "medium",
      relatedOrder: "ORD-4568",
      customerPhone: "+212 623-456-789"
    },
    {
      id: "4",
      type: "success",
      category: "payment",
      title: "Payment Received",
      message: "Cash payment of $145.50 received for Order #ORD-4567. Thank you!",
      timestamp: "2024-01-15T11:15:00Z",
      read: true,
      priority: "low",
      relatedOrder: "ORD-4567"
    },
    {
      id: "5",
      type: "critical",
      category: "system",
      title: "Vehicle Maintenance Required",
      message: "Scheduled maintenance for your vehicle is due tomorrow. Please visit the service center.",
      timestamp: "2024-01-15T10:00:00Z",
      read: false,
      priority: "high",
      actionRequired: true
    },
    {
      id: "6",
      type: "info",
      category: "delivery",
      title: "Delivery Completed",
      message: "Order #ORD-4566 marked as successfully delivered. Great job!",
      timestamp: "2024-01-15T09:30:00Z",
      read: true,
      priority: "low",
      relatedOrder: "ORD-4566"
    },
    {
      id: "7",
      type: "warning",
      category: "customer",
      title: "Customer Not Available",
      message: "Customer for Order #ORD-4565 was not available. Please attempt redelivery.",
      timestamp: "2024-01-14T16:45:00Z",
      read: true,
      priority: "medium",
      actionRequired: true,
      relatedOrder: "ORD-4565",
      customerPhone: "+212 634-567-890"
    },
    {
      id: "8",
      type: "success",
      category: "payment",
      title: "Weekly Bonus Earned",
      message: "You've earned a €50 bonus for excellent performance this week!",
      timestamp: "2024-01-14T15:20:00Z",
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
      case "assignment": return <Package className="h-5 w-5" />;
      case "warning": return <AlertTriangle className="h-5 w-5" />;
      case "info": return <Info className="h-5 w-5" />;
      case "success": return <CheckCircle className="h-5 w-5" />;
      case "critical": return <XCircle className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getCategoryIcon = (category: Notification["category"]) => {
    switch (category) {
      case "delivery": return <Truck className="h-4 w-4" />;
      case "system": return <Settings className="h-4 w-4" />;
      case "customer": return <User className="h-4 w-4" />;
      case "route": return <MapPin className="h-4 w-4" />;
      case "payment": return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "assignment": return "bg-blue-100 text-blue-800 border-blue-200";
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

  const handleCallCustomer = (phone: string) => {
    console.log(`Calling: ${phone}`);
    // Implement call functionality
  };

  const handleMessageCustomer = (phone: string) => {
    console.log(`Messaging: ${phone}`);
    // Implement messaging functionality
  };

  const handleNavigate = (address: string) => {
    console.log(`Navigating to: ${address}`);
    // Implement navigation functionality
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length;

  return (
    <div className="p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-lg">
            <Bell className="h-8 w-8 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
            <p className="text-gray-400">
              Stay updated with delivery assignments and important alerts
            </p>
          </div>
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
              <p className="text-sm text-gray-600 mb-1">New Assignments</p>
              <p className="text-2xl font-bold text-black">
                {notifications.filter(n => n.type === "assignment" && !n.read).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
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
                { value: "assignment", label: "New Assignments" },
                { value: "delivery", label: "Delivery Updates" },
                { value: "customer", label: "Customer Messages" },
                { value: "route", label: "Route Alerts" },
                { value: "payment", label: "Payment Updates" }
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
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div 
            key={notification.id}
            className={`bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-all duration-300 ${
              !notification.read ? 'border-l-4 border-l-blue-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-lg ${getTypeColor(notification.type)}`}>
                  {getTypeIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`font-semibold text-lg ${
                      !notification.read ? 'text-black' : 'text-gray-900'
                    }`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        {getCategoryIcon(notification.category)}
                        <span className="capitalize">{notification.category}</span>
                      </span>
                      {notification.actionRequired && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Action Required
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{notification.message}</p>
                  
                  {/* Additional Information */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {notification.relatedOrder && (
                      <span className="font-mono text-gray-700">Order: {notification.relatedOrder}</span>
                    )}
                    <span className="text-gray-500">{getTimeAgo(notification.timestamp)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mt-4">
                    {notification.customerPhone && (
                      <>
                        <button 
                          onClick={() => handleCallCustomer(notification.customerPhone!)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          Call Customer
                        </button>
                        <button 
                          onClick={() => handleMessageCustomer(notification.customerPhone!)}
                          className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Message
                        </button>
                      </>
                    )}
                    {notification.deliveryAddress && (
                      <button 
                        onClick={() => handleNavigate(notification.deliveryAddress!)}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        <Navigation className="h-4 w-4" />
                        Navigate
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={() => toggleSelectNotification(notification.id)}
                  className="rounded border-gray-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
          <p className="text-gray-500">You're all caught up! No notifications match your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default LivreurNotificationsPage;