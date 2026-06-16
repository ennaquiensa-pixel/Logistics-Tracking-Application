
export enum TypeNotification {
  EMAIL = "EMAIL",
  SMS = "SMS",
  PUSH = "PUSH"
}

export enum CategorieNotification {
  SYSTEME = "SYSTEME",
  COMMANDE = "COMMANDE",
  LIVRAISON = "LIVRAISON",
  PAIEMENT = "PAIEMENT",
  PROMOTION = "PROMOTION",
  AUTRE = "AUTRE"
}

export enum StatutNotification {
  EN_ATTENTE = "EN_ATTENTE",
  ENVOYE = "ENVOYE",
  ECHOUEE = "ECHOUEE",
  LU = "LUE"
}

// Request DTOs
export interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  templateName?: string;
  templateData?: Record<string, any>;
}

export interface SMSRequest {
  phoneNumber: string;
  message: string;
}

export interface NotificationRequest {
  userId: number;
  type: TypeNotification;
  categorie?: CategorieNotification;
  subject: string;
  message: string;
  templateName?: string;
  templateData?: Record<string, any>;
  referenceExterne?: string;
  priorite?: number;
}

// Response DTOs
export interface NotificationResponse {
  idNotification: number;
  userId: number;
  type: TypeNotification;
  categorie: CategorieNotification;
  statut: StatutNotification;
  destinataire: string;
  sujet: string;
  message: string;
  dateEnvoi: string;
  dateLecture?: string;
  nombreTentatives: number;
  erreurMessage?: string;
  referenceExterne?: string;
  createdAt: string;
}

export interface NotificationStatsResponse {
  totalNotifications: number;
  notificationsEnvoyees: number;
  notificationsEchouees: number;
  notificationsEnAttente: number;
  notificationsLues: number;
  tauxReussite: number;
  tauxLecture: number;
}