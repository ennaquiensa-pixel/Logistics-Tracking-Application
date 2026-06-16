import type { 
  EmailRequest, 
  NotificationRequest, 
  NotificationResponse, 
  NotificationStatsResponse,
  SMSRequest 
} from "../types/notificationTypes/notificationTypes";
import api from "./AuthService";

export const notificationService = {
  // Envoyer une notification
  sendNotification: async (request: NotificationRequest): Promise<string> => {
    try {
      const response = await api.post('/api/notifications/send', request);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || error.response.data);
      }
      throw new Error("Erreur lors de l'envoi de la notification");
    }
  },

  // Envoyer un email direct
  sendEmail: async (request: EmailRequest): Promise<string> => {
    try {
      const response = await api.post('/api/notifications/email', request);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || error.response.data);
      }
      throw new Error("Erreur lors de l'envoi de l'email");
    }
  },

  // Envoyer un SMS direct
  sendSMS: async (request: SMSRequest): Promise<string> => {
    try {
      const response = await api.post('/api/notifications/sms', request);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || error.response.data);
      }
      throw new Error("Erreur lors de l'envoi du SMS");
    }
  },

  // Récupérer une notification par ID
  getNotificationById: async (id: number): Promise<NotificationResponse> => {
    try {
      const response = await api.get(`/api/notifications/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Notification non trouvée");
      }
      throw new Error("Erreur lors de la récupération de la notification");
    }
  },

  // Récupérer toutes les notifications d'un utilisateur
  getNotificationsByUser: async (userId: number): Promise<NotificationResponse[]> => {
    try {
      const response = await api.get(`/api/notifications/user/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw new Error("Erreur lors de la récupération des notifications de l'utilisateur");
    }
  },

  // Récupérer les notifications non lues d'un utilisateur
  getUnreadNotifications: async (userId: number): Promise<NotificationResponse[]> => {
    try {
      const response = await api.get(`/api/notifications/user/${userId}/unread`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw new Error("Erreur lors de la récupération des notifications non lues");
    }
  },

  // Compter les notifications non lues
  countUnreadNotifications: async (userId: number): Promise<number> => {
    try {
      const response = await api.get(`/api/notifications/user/${userId}/unread/count`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return 0;
      }
      throw new Error("Erreur lors du comptage des notifications non lues");
    }
  },

  // Marquer une notification comme lue
  markAsRead: async (id: number): Promise<void> => {
    try {
      await api.put(`/api/notifications/${id}/read`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Notification non trouvée");
      }
      throw new Error("Erreur lors du marquage de la notification comme lue");
    }
  },

  // Marquer toutes les notifications d'un utilisateur comme lues
  markAllAsRead: async (userId: number): Promise<void> => {
    try {
      await api.put(`/api/notifications/user/${userId}/read-all`);
    } catch (error: any) {
      throw new Error("Erreur lors du marquage de toutes les notifications comme lues");
    }
  },

  // Obtenir les statistiques des notifications
  getNotificationStats: async (): Promise<NotificationStatsResponse> => {
    try {
      const response = await api.get('/api/notifications/stats');
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des statistiques des notifications");
    }
  },

  // Réessayer les notifications échouées
  retryFailedNotifications: async (): Promise<string> => {
    try {
      const response = await api.post('/api/notifications/retry-failed');
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la réessai des notifications échouées");
    }
  },

  // Méthodes utilitaires pour les statistiques avancées
  getNotificationStatsForUser: async (userId: number): Promise<{
    total: number;
    unread: number;
    read: number;
    sent: number;
    failed: number;
  }> => {
    try {
      const [allNotifications, unreadCount] = await Promise.all([
        notificationService.getNotificationsByUser(userId),
        notificationService.countUnreadNotifications(userId)
      ]);

      const sentNotifications = allNotifications.filter(n => 
        n.statut === "ENVOYE" || n.statut === "LU"
      ).length;

      const failedNotifications = allNotifications.filter(n => 
        n.statut === "ECHOUEE"
      ).length;

      const readNotifications = allNotifications.filter(n => 
        n.statut === "LU"
      ).length;

      return {
        total: allNotifications.length,
        unread: unreadCount,
        read: readNotifications,
        sent: sentNotifications,
        failed: failedNotifications
      };
    } catch (error) {
      throw new Error("Erreur lors de la récupération des statistiques des notifications utilisateur");
    }
  },

  // Filtrer les notifications
  filterNotifications: async (filters: {
    userId?: number;
    type?: string;
    categorie?: string;
    statut?: string;
    dateDebut?: string;
    dateFin?: string;
  }): Promise<NotificationResponse[]> => {
    try {
      let notifications: NotificationResponse[] = [];

      if (filters.userId) {
        notifications = await notificationService.getNotificationsByUser(filters.userId);
      } else {
        // Note: Vous aurez besoin d'un endpoint pour récupérer toutes les notifications
        // Si vous en avez un, utilisez-le ici
        throw new Error("Le filtrage global nécessite un endpoint spécifique");
      }

      return notifications.filter(notification => {
        if (filters.type && notification.type !== filters.type) return false;
        if (filters.categorie && notification.categorie !== filters.categorie) return false;
        if (filters.statut && notification.statut !== filters.statut) return false;
        
        // Filtrage par date
        if (filters.dateDebut || filters.dateFin) {
          const notificationDate = new Date(notification.dateEnvoi || notification.createdAt);
          
          if (filters.dateDebut && notificationDate < new Date(filters.dateDebut)) return false;
          if (filters.dateFin && notificationDate > new Date(filters.dateFin)) return false;
        }
        
        return true;
      });
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors du filtrage des notifications");
    }
  },

  // Rechercher des notifications par sujet ou message
  searchNotifications: async (userId: number, query: string): Promise<NotificationResponse[]> => {
    try {
      const notifications = await notificationService.getNotificationsByUser(userId);
      return notifications.filter(notification => 
        notification.sujet.toLowerCase().includes(query.toLowerCase()) ||
        notification.message.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      throw new Error("Erreur lors de la recherche des notifications");
    }
  },

  // Obtenir les notifications récentes (7 derniers jours)
  getRecentNotifications: async (userId: number, days: number = 7): Promise<NotificationResponse[]> => {
    try {
      const notifications = await notificationService.getNotificationsByUser(userId);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return notifications.filter(notification => {
        const notificationDate = new Date(notification.dateEnvoi || notification.createdAt);
        return notificationDate >= cutoffDate;
      });
    } catch (error) {
      throw new Error("Erreur lors de la récupération des notifications récentes");
    }
  }
};

export default notificationService;