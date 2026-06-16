import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  AlertCircle,
  Package,
  User,
  Calendar,
  Users,
  RefreshCw,
  Download,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import deliveryService, { type PaginatedResponse } from "../../services/DeliveryService";
import {
  EtatLivraison,
  TypeLivraison,
  type LivraisonResponse,
} from "../../types/deliveryTypes/deliveryTypes";
import AddDeliveryDialog from "../../components/AddDeliveryDialog";
import AssignDriverDialog from "../../components/AssignDriverDialog";
import SimpleLoader from "../../components/SimpleLoader"; // Import SimpleLoader

interface DeliveryPageState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

const DeliveriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [allLivraisons, setAllLivraisons] = useState<LivraisonResponse[]>([]);
  const [loading, setLoading] = useState({
    deliveries: true,
    actions: false,
  });
  
  const [pagination, setPagination] = useState<DeliveryPageState>({
    currentPage: 0,
    pageSize: 4,
    totalPages: 0,
    totalElements: 0,
  });
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  const [selectedDeliveries, setSelectedDeliveries] = useState<LivraisonResponse[]>([]);
  const [selectedDeliveryIds, setSelectedDeliveryIds] = useState<Set<number>>(new Set());

  const roleColor = "#818CF8";

  useEffect(() => {
    fetchDeliveries();
  }, [pagination.currentPage, pagination.pageSize]);

  const fetchDeliveries = async () => {
    try {
      setLoading(prev => ({ ...prev, deliveries: true }));
      const response: PaginatedResponse<LivraisonResponse> = await deliveryService.getAllLivraisons({
        page: pagination.currentPage,
        size: pagination.pageSize,
      });
      
      setAllLivraisons(response.content);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      }));
      setSelectedDeliveryIds(new Set());
      setSelectedDeliveries([]);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setAllLivraisons([]);
      setPagination(prev => ({
        ...prev,
        totalPages: 0,
        totalElements: 0,
      }));
    } finally {
      setLoading(prev => ({ ...prev, deliveries: false }));
    }
  };

  const handleDeliveryAdded = () => {
    // Reset to first page when a new delivery is added
    setPagination(prev => ({ ...prev, currentPage: 0 }));
    fetchDeliveries();
  };

  const handleAssignmentComplete = () => {
    fetchDeliveries();
  };

  const toggleDeliverySelection = (delivery: LivraisonResponse) => {
    const newSelectedIds = new Set(selectedDeliveryIds);

    if (newSelectedIds.has(delivery.idLivraison)) {
      newSelectedIds.delete(delivery.idLivraison);
    } else {
      if (!delivery.livreurId) {
        newSelectedIds.add(delivery.idLivraison);
      }
    }

    setSelectedDeliveryIds(newSelectedIds);
    setSelectedDeliveries(
      allLivraisons.filter((d) => newSelectedIds.has(d.idLivraison))
    );
  };

  const selectAllUnassigned = () => {
    const unassignedDeliveries = allLivraisons.filter((d) => !d.livreurId);
    const unassignedIds = new Set(
      unassignedDeliveries.map((d) => d.idLivraison)
    );

    setSelectedDeliveryIds(unassignedIds);
    setSelectedDeliveries(unassignedDeliveries);
  };

  const clearSelections = () => {
    setSelectedDeliveryIds(new Set());
    setSelectedDeliveries([]);
  };

  const handleOpenAssignDialog = () => {
    if (selectedDeliveries.length > 0) {
      setShowAssignDialog(true);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination(prev => ({ 
      ...prev, 
      pageSize: newSize,
      currentPage: 0 // Reset to first page when changing page size
    }));
  };

  const unassignedCount = allLivraisons.filter((d) => !d.livreurId).length;
  const selectedUnassignedCount = selectedDeliveries.length;

  const filteredDeliveries = allLivraisons.filter((delivery) => {
    const matchesSearch =
      delivery.idLivraison.toString().includes(searchTerm) ||
      delivery.orderId.toString().includes(searchTerm) ||
      delivery.livreurNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.adresseDestination.ville
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.adresseDestination.rue
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      delivery.etat === statusFilter ||
      (statusFilter === "ASSIGNEE" && delivery.livreurId) ||
      (statusFilter === "UNASSIGNED" && !delivery.livreurId);

    const matchesType = typeFilter === "all" || delivery.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (etat: EtatLivraison) => {
    switch (etat) {
      case EtatLivraison.EN_ATTENTE:
        return "#F59E0B";
      case EtatLivraison.ASSIGNEE:
        return "#818CF8";
      case EtatLivraison.EN_PREPARATION:
        return "#8B5CF6";
      case EtatLivraison.EN_COURS:
        return "#6366F1";
      case EtatLivraison.LIVREE:
        return "#10B981";
      case EtatLivraison.RETOURNEE:
        return "#F97316";
      case EtatLivraison.ANNULEE:
        return "#EF4444";
      case EtatLivraison.ECHEC:
        return "#DC2626";
      default:
        return "#9CA3AF";
    }
  };

  const getStatusIcon = (etat: EtatLivraison) => {
    switch (etat) {
      case EtatLivraison.EN_ATTENTE:
        return <Clock className="h-4 w-4" />;
      case EtatLivraison.ASSIGNEE:
        return <User className="h-4 w-4" />;
      case EtatLivraison.EN_PREPARATION:
        return <Package className="h-4 w-4" />;
      case EtatLivraison.EN_COURS:
        return <Truck className="h-4 w-4" />;
      case EtatLivraison.LIVREE:
        return <CheckCircle className="h-4 w-4" />;
      case EtatLivraison.RETOURNEE:
        return <AlertCircle className="h-4 w-4" />;
      case EtatLivraison.ANNULEE:
      case EtatLivraison.ECHEC:
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: TypeLivraison) => {
    switch (type) {
      case TypeLivraison.STANDARD:
        return "#10B981";
      case TypeLivraison.EXPRESS:
        return "#F59E0B";
      case TypeLivraison.PRIORITAIRE:
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  const getStatusText = (etat: EtatLivraison) => {
    switch (etat) {
      case EtatLivraison.EN_ATTENTE:
        return "En Attente";
      case EtatLivraison.ASSIGNEE:
        return "Assignée";
      case EtatLivraison.EN_PREPARATION:
        return "En Préparation";
      case EtatLivraison.EN_COURS:
        return "En Cours";
      case EtatLivraison.LIVREE:
        return "Livrée";
      case EtatLivraison.RETOURNEE:
        return "Retournée";
      case EtatLivraison.ANNULEE:
        return "Annulée";
      case EtatLivraison.ECHEC:
        return "Échec";
      default:
        return etat;
    }
  };

  const getTypeText = (type: TypeLivraison) => {
    switch (type) {
      case TypeLivraison.STANDARD:
        return "Standard";
      case TypeLivraison.EXPRESS:
        return "Express";
      case TypeLivraison.PRIORITAIRE:
        return "Prioritaire";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, pagination.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(pagination.totalPages - 1, startPage + maxPagesToShow - 1);
    
    // Adjust start page if we're at the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-[#E0E7FF]/5 via-white to-[#818CF8]/5"></div>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.random() * 40 + 10 + 'px',
              height: Math.random() * 40 + 10 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: `radial-gradient(circle, ${['#E0E7FF', '#818CF8', '#6366F1'][i % 3]} 0%, transparent 70%)`,
              opacity: 0.1,
              filter: 'blur(15px)',
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
                 style={{
                   backgroundColor: `${roleColor}15`,
                   color: roleColor
                 }}>
              <Truck className="h-3 w-3" />
              <span>Gestion des Livraisons</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#1f2937' }}>
              Tableau des Livraisons
            </h1>
            <p className="text-lg" style={{ color: '#6b7280' }}>
              Visualisez, assignez et gérez les livraisons en temps réel
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchDeliveries}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(224, 231, 255, 0.5)',
                color: roleColor,
                boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
              }}
              disabled={loading.deliveries}
            >
              {loading.deliveries ? (
                <>
                  <SimpleLoader size="small" />
                  <span>Chargement...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Actualiser</span>
                </>
              )}
            </button>
            <button 
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: roleColor,
                color: '#FFFFFF',
                boxShadow: `0 4px 20px ${roleColor}40`
              }}
            >
              <Plus className="h-4 w-4" />
              Nouvelle Livraison
            </button>
          </div>
        </div>

        {/* Action Bar */}
        {selectedUnassignedCount > 0 && (
          <div className="bg-white rounded-2xl p-6 mb-6 transition-all duration-500 hover:shadow-xl group"
               style={{
                 border: '1px solid rgba(224, 231, 255, 0.5)',
                 boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
               }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                     style={{ backgroundColor: `${roleColor}15` }}>
                  <Package className="h-6 w-6" style={{ color: roleColor }} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: '#1f2937' }}>
                    {selectedUnassignedCount} livraison(s) sélectionnée(s)
                  </h3>
                  <p className="text-sm" style={{ color: '#6b7280' }}>
                    Total colis: {selectedDeliveries.reduce((total, d) => total + d.colis.length, 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearSelections}
                  className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(224, 231, 255, 0.5)',
                    color: '#6b7280',
                    boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                  }}
                  disabled={loading.actions}
                >
                  Effacer
                </button>
                <button
                  onClick={handleOpenAssignDialog}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    boxShadow: `0 4px 20px #10B98140`
                  }}
                  disabled={loading.actions}
                >
                  <Users className="h-4 w-4" />
                  Assigner ({selectedUnassignedCount})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Info */}
        <div className="bg-white rounded-2xl p-6 mb-6"
             style={{
               border: '1px solid rgba(224, 231, 255, 0.5)',
               boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
             }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm" style={{ color: '#6b7280' }}>
              {loading.deliveries ? (
                <div className="flex items-center gap-2">
                  <SimpleLoader size="small" />
                  <span>Chargement...</span>
                </div>
              ) : (
                <>
                  Affichage de {(pagination.currentPage * pagination.pageSize) + 1} à{' '}
                  {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)} sur{' '}
                  {pagination.totalElements} livraisons
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: '#6b7280' }}>Éléments par page:</span>
                <select
                  value={pagination.pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(224, 231, 255, 0.5)',
                    color: '#1f2937'
                  }}
                  disabled={loading.deliveries}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 0 || loading.deliveries}
                  className="p-2 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: pagination.currentPage === 0 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(129, 140, 248, 0.1)',
                    border: '1px solid rgba(224, 231, 255, 0.5)',
                    color: pagination.currentPage === 0 ? '#9CA3AF' : roleColor
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {generatePageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      pageNum === pagination.currentPage ? 'font-bold' : ''
                    }`}
                    style={{
                      backgroundColor: pageNum === pagination.currentPage 
                        ? roleColor 
                        : 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(224, 231, 255, 0.5)',
                      color: pageNum === pagination.currentPage 
                        ? '#FFFFFF' 
                        : '#6b7280',
                      boxShadow: pageNum === pagination.currentPage 
                        ? `0 4px 20px ${roleColor}40`
                        : 'none'
                    }}
                    disabled={loading.deliveries}
                  >
                    {pageNum + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages - 1 || loading.deliveries}
                  className="p-2 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: pagination.currentPage >= pagination.totalPages - 1 
                      ? 'rgba(255, 255, 255, 0.9)' 
                      : 'rgba(129, 140, 248, 0.1)',
                    border: '1px solid rgba(224, 231, 255, 0.5)',
                    color: pagination.currentPage >= pagination.totalPages - 1 
                      ? '#9CA3AF' 
                      : roleColor
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl p-6 mb-6"
             style={{
               border: '1px solid rgba(224, 231, 255, 0.5)',
               boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
             }}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-[#818CF8]" />
                <input
                  type="text"
                  placeholder="Rechercher par ID, livreur, ville ou rue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent group-hover:shadow-lg"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(224, 231, 255, 0.5)',
                    color: '#1f2937'
                  }}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors group-hover:text-[#818CF8]" style={{ color: '#9CA3AF' }} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3.5 rounded-xl appearance-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent group-hover:shadow-lg"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(224, 231, 255, 0.5)',
                    color: '#1f2937',
                    minWidth: '200px'
                  }}
                >
                  <option value="all">Tous les États</option>
                  {Object.values(EtatLivraison).map((etat) => (
                    <option key={etat} value={etat}>
                      {getStatusText(etat)}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent hover:shadow-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(224, 231, 255, 0.5)',
                  color: '#1f2937',
                  minWidth: '180px'
                }}
              >
                <option value="all">Tous les Types</option>
                {Object.values(TypeLivraison).map((type) => (
                  <option key={type} value={type}>
                    {getTypeText(type)}
                  </option>
                ))}
              </select>

              <button
                onClick={() => { setTypeFilter("all"); setStatusFilter("all"); }}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(224, 231, 255, 0.5)',
                  color: roleColor,
                  boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                }}
              >
                <Filter className="h-4 w-4" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl overflow-hidden"
             style={{
               border: '1px solid rgba(224, 231, 255, 0.5)',
               boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
             }}>
          {/* Table Header */}
          <div className="p-6 border-b" style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: '#1f2937' }}>
                Liste des Livraisons
              </h2>
              {loading.deliveries ? (
                <div className="flex items-center gap-2 text-sm" style={{ color: '#6b7280' }}>
                  <SimpleLoader size="small" />
                  <span>Chargement...</span>
                </div>
              ) : unassignedCount > 0 && selectedUnassignedCount === 0 ? (
                <button
                  onClick={selectAllUnassigned}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: `${roleColor}15`,
                    color: roleColor,
                    boxShadow: `0 4px 20px ${roleColor}20`
                  }}
                >
                  <Users className="h-4 w-4" />
                  Sélectionner Non-Assignées ({unassignedCount})
                </button>
              ) : null}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading.deliveries && allLivraisons.length === 0 ? (
              <div className="p-12 text-center">
                <SimpleLoader />
                <p className="mt-4 text-lg" style={{ color: '#6b7280' }}>Chargement des livraisons...</p>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="border-b" style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280', width: '50px' }}>
                        <input
                          type="checkbox"
                          checked={selectedUnassignedCount === unassignedCount && unassignedCount > 0}
                          onChange={selectAllUnassigned}
                          disabled={unassignedCount === 0 || loading.deliveries}
                          className="h-4 w-4 rounded transition-colors focus:ring-[#818CF8] focus:ring-2"
                          style={{
                            borderColor: '#D1D5DB',
                            backgroundColor: selectedUnassignedCount === unassignedCount ? roleColor : 'white'
                          }}
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Commande
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Livreur
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Destination
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Date Livraison
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.map((delivery) => (
                      <tr
                        key={delivery.idLivraison}
                        className="border-b transition-all duration-300 "
                        style={{
                          borderColor: 'rgba(224, 231, 255, 0.5)',
                          backgroundColor: selectedDeliveryIds.has(delivery.idLivraison)
                            ? `${roleColor}08`
                            : 'transparent'
                        }}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedDeliveryIds.has(delivery.idLivraison)}
                            onChange={() => toggleDeliverySelection(delivery)}
                            disabled={!!delivery.livreurId}
                            className="h-4 w-4 rounded transition-colors focus:ring-[#818CF8] focus:ring-2"
                            style={{
                              borderColor: '#D1D5DB',
                              backgroundColor: selectedDeliveryIds.has(delivery.idLivraison) ? roleColor : 'white',
                              opacity: delivery.livreurId ? 0.4 : 1
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium" style={{ color: '#1f2937' }}>
                            CMD-{delivery.orderId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" style={{ color: delivery.livreurNom ? '#6b7280' : '#9CA3AF' }} />
                            <span
                              className={`font-medium ${delivery.livreurNom ? '' : 'italic'}`}
                              style={{ color: delivery.livreurNom ? '#1f2937' : '#9CA3AF' }}
                            >
                              {delivery.livreurNom || "Non assigné"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 group-hover:scale-105"
                               style={{
                                 backgroundColor: `${getStatusColor(delivery.etat)}15`,
                                 borderColor: `${getStatusColor(delivery.etat)}30`,
                                 color: getStatusColor(delivery.etat)
                               }}>
                            {getStatusIcon(delivery.etat)}
                            <span className="text-sm font-medium">
                              {getStatusText(delivery.etat)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 group-hover:scale-105"
                                style={{
                                  backgroundColor: `${getTypeColor(delivery.type)}15`,
                                  color: getTypeColor(delivery.type)
                                }}>
                            {getTypeText(delivery.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                            <div>
                              <div className="font-medium truncate" style={{ color: '#1f2937' }}>
                                {delivery.adresseDestination.ville}
                              </div>
                              <div className="text-sm truncate" style={{ color: '#6b7280' }}>
                                {delivery.adresseDestination.rue}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                            <div>
                              <div className="text-sm" style={{ color: '#1f2937' }}>
                                {formatDate(delivery.dateLivraisonPrevue)}
                              </div>
                              {delivery.dateLivraisonEffective && (
                                <div className="text-xs" style={{ color: '#10B981' }}>
                                  Effectuée: {formatDate(delivery.dateLivraisonEffective)}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Empty State */}
                {filteredDeliveries.length === 0 && !loading.deliveries && (
                  <div className="text-center py-12">
                    <Truck className="h-16 w-16 mx-auto mb-4" style={{ color: '#E0E7FF' }} />
                    <p className="text-lg mb-2" style={{ color: '#6b7280' }}>Aucune livraison trouvée</p>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>
                      Essayez d'ajuster votre recherche ou vos filtres
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t" style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="text-sm" style={{ color: '#6b7280' }}>
                {loading.deliveries ? (
                  <div className="flex items-center gap-2">
                    <SimpleLoader size="small" />
                    <span>Chargement des données...</span>
                  </div>
                ) : (
                  <>
                    Page {pagination.currentPage + 1} sur {pagination.totalPages} • 
                    Affichage de {filteredDeliveries.length} livraisons
                    {selectedUnassignedCount > 0 && (
                      <span className="ml-2 font-medium" style={{ color: roleColor }}>
                        • {selectedUnassignedCount} sélectionnée(s)
                      </span>
                    )}
                  </>
                )}
              </div>
              {!loading.deliveries && pagination.totalPages > 1 && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(224, 231, 255, 0.5)',
                      color: '#6b7280',
                      boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </button>
                  <button 
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages - 1}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(224, 231, 255, 0.5)',
                      color: '#6b7280',
                      boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                    }}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddDeliveryDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onDeliveryAdded={handleDeliveryAdded}
      />

      <AssignDriverDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        selectedDeliveries={selectedDeliveries}
        onAssignmentComplete={handleAssignmentComplete}
      />
    </div>
  );
};

export default DeliveriesPage;