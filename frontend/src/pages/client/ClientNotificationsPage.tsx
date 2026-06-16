import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, AlertTriangle, Info, X, Trash2, EyeOff, Settings, Mail, Smartphone, RefreshCw } from "lucide-react";
import notificationService from "../../services/NotificationService";
import { CategorieNotification, StatutNotification, TypeNotification } from "../../types/notificationTypes/notificationTypes";
import { useAuth } from "../../context/AuthContext";

const ClientNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const {user} = useAuth()

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getNotificationsByUser(Number(user?.userId));
      setNotifications(data);
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: TypeNotification) => {
    switch (type) {
      case TypeNotification.EMAIL: return <Mail className="h-5 w-5" />;
      case TypeNotification.SMS: return <Smartphone className="h-5 w-5" />;
      case TypeNotification.PUSH: return <Bell className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: TypeNotification) => {
    switch (type) {
      case TypeNotification.EMAIL: return "bg-blue-100 border-blue-200 text-blue-600";
      case TypeNotification.SMS: return "bg-green-100 border-green-200 text-green-600";
      case TypeNotification.PUSH: return "bg-purple-100 border-purple-200 text-purple-600";
      default: return "bg-gray-100 border-gray-200 text-gray-600";
    }
  };

  const getStatusIcon = (statut: StatutNotification) => {
    switch (statut) {
      case StatutNotification.ENVOYE:
      case StatutNotification.LU:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case StatutNotification.ECHOUEE:
        return <X className="h-4 w-4 text-red-600" />;
      case StatutNotification.EN_ATTENTE:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (statut: StatutNotification) => {
    switch (statut) {
      case StatutNotification.ENVOYE:
      case StatutNotification.LU:
        return "bg-green-100 text-green-700";
      case StatutNotification.ECHOUEE:
        return "bg-red-100 text-red-700";
      case StatutNotification.EN_ATTENTE:
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryColor = (categorie: CategorieNotification) => {
    switch (categorie) {
      case CategorieNotification.COMMANDE: return "bg-purple-100 text-purple-700";
      case CategorieNotification.LIVRAISON: return "bg-orange-100 text-orange-700";
      case CategorieNotification.PAIEMENT: return "bg-red-100 text-red-700";
      case CategorieNotification.PROMOTION: return "bg-pink-100 text-pink-700";
      case CategorieNotification.SYSTEME: return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryLabel = (categorie: CategorieNotification) => {
    switch (categorie) {
      case CategorieNotification.COMMANDE: return "Order";
      case CategorieNotification.LIVRAISON: return "Delivery";
      case CategorieNotification.PAIEMENT: return "Payment";
      case CategorieNotification.PROMOTION: return "Promotion";
      case CategorieNotification.SYSTEME: return "System";
      default: return "Other";
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return notification.statut !== StatutNotification.LU;
    if (filter === "read") return notification.statut === StatutNotification.LU;
    if (filter === "sent") return notification.statut === StatutNotification.ENVOYE;
    if (filter === "failed") return notification.statut === StatutNotification.ECHOUEE;
    return notification.categorie === filter;
  });

  const markAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(note => 
        note.idNotification === id 
          ? { ...note, statut: StatutNotification.LU, dateLecture: new Date().toISOString() }
          : note
      ));
    } catch (err: any) {
      setError(err.message || "Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(Number(user?.userId));
      await loadNotifications(); // Reload to get updated data
    } catch (err: any) {
      setError(err.message || "Failed to mark all as read");
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      // Note: You'll need to add a delete endpoint in your backend
      // For now, we'll just filter locally
      setNotifications(notifications.filter(note => note.idNotification !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete notification");
    }
  };

  const retryFailedNotifications = async () => {
    try {
      await notificationService.retryFailedNotifications();
      await loadNotifications(); // Reload to get updated data
    } catch (err: any) {
      setError(err.message || "Failed to retry failed notifications");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const unreadCount = notifications.filter(note => note.statut !== StatutNotification.LU).length;
  const failedCount = notifications.filter(note => note.statut === StatutNotification.ECHOUEE).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5] mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-3">
            <X className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-700">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
          <button
            onClick={loadNotifications}
            className="mt-4 bg-white text-red-600 px-4 py-2 rounded-lg border border-red-300 hover:bg-red-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-8 w-8 text-[#4F46E5]" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#4F46E5] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Stay updated with your activities</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {failedCount > 0 && (
            <button
              onClick={retryFailedNotifications}
              className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry Failed ({failedCount})</span>
            </button>
          )}
          <button 
            onClick={markAllAsRead}
            className="bg-[#4F46E5] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#4338CA] transition-colors shadow-sm"
            disabled={unreadCount === 0}
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark all as read</span>
          </button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm">Unread</p>
          <p className="text-2xl font-bold text-[#4F46E5]">{unreadCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm">Success Rate</p>
          <p className="text-2xl font-bold text-green-600">
            {notifications.length > 0 
              ? `${Math.round((notifications.filter(n => n.statut === StatutNotification.ENVOYE || n.statut === StatutNotification.LU).length / notifications.length) * 100)}%`
              : "0%"
            }
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              filter === "all" 
                ? "bg-[#4F46E5] text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              filter === "unread" 
                ? "bg-[#4F46E5] text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              filter === "read" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Read ({notifications.length - unreadCount})
          </button>
          <button
            onClick={() => setFilter(CategorieNotification.COMMANDE)}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              filter === CategorieNotification.COMMANDE
                ? "bg-purple-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.idNotification}
            className={`bg-white p-6 rounded-xl border transition-all duration-300 hover:shadow-md ${
              notification.statut === StatutNotification.LU
                ? "border-gray-200 opacity-90" 
                : "border-gray-300 shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`p-2 rounded-lg border ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="text-gray-900 text-lg font-medium">{notification.sujet}</p>
                    {notification.statut !== StatutNotification.LU && (
                      <span className="bg-[#4F46E5] text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{notification.message}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-gray-500">{formatDate(notification.dateEnvoi)}</span>
                    <span className={`px-2 py-1 rounded-full ${getCategoryColor(notification.categorie)}`}>
                      {getCategoryLabel(notification.categorie)}
                    </span>
                    <span className={`px-2 py-1 rounded-full flex items-center space-x-1 ${getStatusColor(notification.statut)}`}>
                      {getStatusIcon(notification.statut)}
                      <span>{notification.statut.toLowerCase().replace('_', ' ')}</span>
                    </span>
                    {notification.referenceExterne && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        Ref: {notification.referenceExterne}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {notification.statut !== StatutNotification.LU && (
                  <button
                    onClick={() => markAsRead(notification.idNotification)}
                    className="p-2 text-gray-500 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <EyeOff className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.idNotification)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="bg-white rounded-xl border border-gray-200 p-12 max-w-md mx-auto shadow-sm">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600 mb-6">
              {filter === "all" 
                ? "You're all caught up! No notifications at the moment."
                : `No ${filter} notifications found.`
              }
            </p>
            {filter !== "all" && (
              <button 
                onClick={() => setFilter("all")}
                className="bg-[#4F46E5] text-white px-6 py-3 rounded-lg hover:bg-[#4338CA] transition-colors shadow-sm"
              >
                View all notifications
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientNotificationsPage;