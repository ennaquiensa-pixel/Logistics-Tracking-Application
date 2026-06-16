// Types pour les adresses
export interface Adresse {
  rue: string;
  ville: string;
  codePostal: string;
  pays: string;
  latitude: number;
  longitude: number;
}

// Types pour les colis
export interface ColisRequest {
  packageId: number;
  poids: number;
  description: string;
  dimensions: string;
}

export interface ColisResponse {
  packageId: number;
  poids: number;
  description: string;
  dimensions: string;
}

// Enumérations
export enum EtatLivraison {
  EN_ATTENTE = "EN_ATTENTE",
  ASSIGNEE = "ASSIGNEE",
  EN_PREPARATION = "EN_PREPARATION",
  // PLANIFIEE = "PLANIFIEE",
  EN_COURS = "EN_COURS",
  LIVREE = "LIVREE",
  RETOURNEE = "RETOURNEE",
  ANNULEE = "ANNULEE",
  ECHEC = "ECHEC",
}

export enum TypeLivraison {
  STANDARD = "STANDARD",
  EXPRESS = "EXPRESS",
  PRIORITAIRE = "PRIORITAIRE",
}

// Types pour les requêtes
export interface LivraisonRequest {
  orderId: number;
  clientId: number;
  adresseDestination: Adresse;
  adresseOrigine?: Adresse;
  type: TypeLivraison;
  colis: ColisRequest[];
  dateLivraisonPrevue?: string;
  notes?: string;
}

export interface AssignDriverRequest {
  livraisonId: number;
  livreurId: number;
}

export interface UpdateLivraisonStatusRequest {

  etat: EtatLivraison;
  notes?: string;
}

export interface WeeklyPerformanceDTO {
  name: string;        // Mon, Tue, Wed...
  deliveries: number;  // total deliveries
  completed: number;   // completed deliveries
  time: number;        // average time in hours
}

export interface RecentActivityDTO {
  id: number;
  driver: string;
  status: string;
  time: string;
  location: string;
}


// Types pour les réponses
export interface LivraisonResponse {
  idLivraison: number;
  orderId: number;
  clientId: number;
  livreurId?: number;
  livreurNom?: string;
  dateCreation: string;
  dateLivraisonPrevue: string;
  dateLivraisonEffective?: string;
  etat: EtatLivraison;
  type: TypeLivraison;
  distanceKm?: number;
  adresseOrigine: Adresse;
  adresseDestination: Adresse;
  notes?: string;
  prixLivraison?: number;
  colis: ColisResponse[];
  createdAt: string;
  updatedAt: string;
}

// Types pour les filtres
export interface LivraisonFilters {
  status?: EtatLivraison;
  clientId?: number;
  livreurId?: number;
  type?: TypeLivraison;
  dateDebut?: string;
  dateFin?: string;
}

export interface LivraisonStats {
  etat: EtatLivraison;
  notes?: string;
}