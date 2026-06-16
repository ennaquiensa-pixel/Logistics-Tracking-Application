// User-related DTOs
export interface UserResponse {
  idUser: number;
  email: string;
  nom: string;
  telephone?: string;
  role: string;
  active?: boolean;
  createdAt?: string;
}

export interface ClientResponse {
  idUser: number;
  email: string;
  nom: string;
  telephone: string;
  active: boolean;
  createdAt: string;
  adresses: AdresseResponse[];
}

export interface LivreurResponse {
  idUser: number;
  email: string;
  nom: string;
  telephone: string;
  disponibilite: boolean;
  vehiculeId: number | null;
  latitudeActuelle: number | null;
  longitudeActuelle: number | null;
  nombreLivraisonsEffectuees: number;
  noteMoyenne: number;
  active: boolean;
  createdAt: string;
}

export interface ManagerResponse {
  idUser: number;
  email: string;
  nom: string;
  telephone: string;
  region: string;
  equipeTaille: number;
  active: boolean;
  createdAt: string;
}

export interface DashboardResponse {
  totalUsers: number;
  totalClients: number;
  totalLivreurs: number;
  totalManagers: number;
  totalAdmins: number;
  activeUsers: number;
  availableLivreurs: number;
}

export interface ManagerDashboardResponse {
  managerId: number;
  managerName: string;
  region: string;
  teamSize: number;
  totalLivraisonsInRegion: number;
  pendingLivraisons: number;
  completedLivraisons: number;
  availableLivreurs: number;
  averageDeliveryTime: number;
}

export interface AddUserRequest {
  email: string;
  password: string;
  nom: string;
  telephone: string;
  role: 'CLIENT' | 'LIVREUR' | 'MANAGER' | 'ADMIN';
}

export interface UpdateUserRequest {
  nom?: string;
  telephone?: string;
  email?: string;
}

export interface UpdateLivreurPositionRequest {
  latitude: number;
  longitude: number;
}


export interface AdresseRequest {
  rue: string;            // required
  ville: string;          // required
  codePostal: string;     // required
  pays?: string;          // optional (default: "Maroc" on backend)
  latitude?: number;      // optional
  longitude?: number;     // optional
  estPrincipale?: boolean; // optional (default: false on backend)
}

export interface AdresseResponse {
  idAdresse: number;
  rue: string;
  ville: string;
  codePostal: string;
  pays: string;
  complement?: string;
}

export interface OrderResponse {
 
    idCommande: number;
    clientId: number;
    dateCommande: string;
    prixTotal: number;
    statut: string;
    deliveryId: number | null;
  
}

// Statistics types
export interface UsersByRoleStats {
  [key: string]: number;
}

export interface ActiveUsersReport {
  totalActive: number;
  activeByRole: UsersByRoleStats;
  activationRate: number;
}