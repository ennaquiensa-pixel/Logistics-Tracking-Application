export interface WareHouseResponse {
  idEntrepot: number;
  code: string;
  nom: string;
  type: string; // or TypeEntrepot enum
  statut: string; // or StatutEntrepot enum
  adresse: AdresseDTO;
  capaciteMax: number;
  capaciteActuelle: number;
  capaciteDisponible: number;
  tauxOccupation: number;
  superficieM2: number;
  telephone: string;
  email: string;
  responsableNom: string;
  responsableTelephone: string;
  horairesOuverture: string;
  description: string;
  createdAt: string;   // ISO date string (LocalDateTime)
  updatedAt: string;   // ISO date string (LocalDateTime)
}
export interface AdresseDTO {
   rue: string;
  ville: string;
  codePostal: string;
  pays: string;
  latitude: number;
  longitude: number;
}

// TypeScript enum for warehouse type
export enum TypeEntrepot {
  PRINCIPAL = "PRINCIPAL",
  REGIONAL = "REGIONAL",
  LOCAL = "LOCAL",
  TEMPORAIRE = "TEMPORAIRE",
  TRANSIT = "TRANSIT",
}



// Warehouse request interface
export interface WarehouseRequest {
  code: string
  nom: string
  type: TypeEntrepot
  adresse: AdresseDTO
  capaciteMax: number
  superficieM2?: number
  telephone?: string
  email?: string
  responsableNom?: string
  responsableTelephone?: string
  horairesOuverture?: string
  description?: string
}
