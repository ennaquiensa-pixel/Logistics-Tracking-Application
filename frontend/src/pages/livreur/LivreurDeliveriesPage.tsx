import React, { useEffect, useState } from "react";
import {
  Truck,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Clock,
  Filter,
  Search,
  MoreVertical,
  RefreshCw,
  Download,
  Package,
  BarChart3,
  Users,
} from "lucide-react";
import deliveryService from "../../services/DeliveryService";
import { useAuth } from "../../context/AuthContext";
import {
  EtatLivraison,
  TypeLivraison,
  type Adresse,
  type LivraisonResponse,
} from "../../types/deliveryTypes/deliveryTypes";
import SimpleLoader from "../../components/SimpleLoader"; // Import SimpleLoader

const LivreurDeliveriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedDelivery, setSelectedDelivery] = useState<LivraisonResponse | null>(null);
  const [deliveries, setDeliveries] = useState<LivraisonResponse[]>([]);
  const [loading, setLoading] = useState({
    deliveries: true,
    actions: false,
  });
  const { user } = useAuth();

  const roleColor = "#818CF8";

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(prev => ({ ...prev, deliveries: true }));
        const response = await deliveryService.getLivraisonsByDriver(
          Number(user?.userId)
        );
        setDeliveries(response);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des livraisons du livreur",
          error
        );
        setDeliveries([]);
      } finally {
        setLoading(prev => ({ ...prev, deliveries: false }));
      }
    };

    fetchDeliveries();
  }, [user?.userId]);

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.orderId
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.adresseDestination.ville
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.adresseDestination.rue
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.clientId
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || delivery.etat === statusFilter;
    const matchesType = typeFilter === "all" || delivery.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: EtatLivraison) => {
    switch (status) {
      case EtatLivraison.EN_ATTENTE:
        return "#F59E0B";
      case EtatLivraison.ASSIGNEE:
        return "#818CF8";
      case EtatLivraison.EN_COURS:
        return "#6366F1";
      case EtatLivraison.LIVREE:
        return "#10B981";
      case EtatLivraison.ANNULEE:
        return "#9CA3AF";
      case EtatLivraison.RETOURNEE:
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  const getStatusIcon = (status: EtatLivraison) => {
    switch (status) {
      case EtatLivraison.EN_ATTENTE:
        return <Clock className="h-4 w-4" />;
      case EtatLivraison.ASSIGNEE:
        return <Truck className="h-4 w-4" />;
      case EtatLivraison.EN_COURS:
        return <Navigation className="h-4 w-4" />;
      case EtatLivraison.LIVREE:
        return <CheckCircle className="h-4 w-4" />;
      case EtatLivraison.ANNULEE:
        return <AlertCircle className="h-4 w-4" />;
      case EtatLivraison.RETOURNEE:
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: EtatLivraison) => {
    switch (status) {
      case EtatLivraison.EN_ATTENTE:
        return "En Attente";
      case EtatLivraison.ASSIGNEE:
        return "Assignée";
      case EtatLivraison.EN_COURS:
        return "En Cours";
      case EtatLivraison.LIVREE:
        return "Livrée";
      case EtatLivraison.ANNULEE:
        return "Annulée";
      case EtatLivraison.RETOURNEE:
        return "Retournée";
      default:
        return status;
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

  const formatAddress = (adresse: Adresse) => {
    return `${adresse.rue}, ${adresse.ville} ${adresse.codePostal}`;
  };

  const handleStartDelivery = async (delivery: LivraisonResponse) => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      await deliveryService.updateStatus(Number(delivery.idLivraison), {
        etat: EtatLivraison.EN_COURS, 
        notes: "Livraison commencée par le livreur"
      });
      const response = await deliveryService.getLivraisonsByDriver(Number(user?.userId));
      setDeliveries(response);
    } catch (error) {
      console.error('Erreur lors du démarrage de la livraison', error);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const handleCompleteDelivery = async (delivery: LivraisonResponse) => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      await deliveryService.updateStatus(delivery.idLivraison, {
        etat: EtatLivraison.LIVREE
      });
      const response = await deliveryService.getLivraisonsByDriver(Number(user?.userId));
      setDeliveries(response);
    } catch (error) {
      console.error('Erreur lors de la complétion de la livraison', error);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const handleReportReturn = async (delivery: LivraisonResponse) => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      await deliveryService.updateStatus(delivery.idLivraison, {
        etat: EtatLivraison.RETOURNEE,
        notes: "Retourné par le livreur"
      });
      const response = await deliveryService.getLivraisonsByDriver(Number(user?.userId));
      setDeliveries(response);
    } catch (error) {
      console.error('Erreur lors du signalement du retour', error);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      const response = await deliveryService.getLivraisonsByDriver(
        Number(user?.userId)
      );
      setDeliveries(response);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des livraisons du livreur",
        error
      );
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
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

  const calculatePackageWeight = (delivery: LivraisonResponse) => {
    return delivery.colis.reduce((total, colis) => total + colis.poids, 0);
  };

  const stats = [
    {
      label: "Total Assignées",
      value: loading.deliveries ? <SimpleLoader size="small" /> : deliveries.length,
      icon: Truck,
      color: roleColor,
    },
    {
      label: "En Cours",
      value: loading.deliveries ? <SimpleLoader size="small" /> : deliveries.filter(d => d.etat === EtatLivraison.EN_COURS).length,
      icon: Navigation,
      color: "#6366F1",
    },
    {
      label: "En Attente",
      value: loading.deliveries ? <SimpleLoader size="small" /> : deliveries.filter(d => 
        d.etat === EtatLivraison.EN_ATTENTE || 
        d.etat === EtatLivraison.EN_PREPARATION
      ).length,
      icon: Clock,
      color: "#F59E0B",
    },
    {
      label: "Terminées",
      value: loading.deliveries ? <SimpleLoader size="small" /> : deliveries.filter(d => d.etat === EtatLivraison.LIVREE).length,
      icon: CheckCircle,
      color: "#10B981",
    },
  ];

  // if (loading.deliveries && deliveries.length === 0) {
  //   return (
  //     <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
  //       <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF]/5 via-white to-[#818CF8]/5"></div>
  //       <div className="relative z-10 text-center">
  //         <SimpleLoader />
  //         <p className="mt-4 text-lg" style={{ color: '#6b7280' }}>Chargement des livraisons...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF]/5 via-white to-[#818CF8]/5"></div>
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
              <span>Espace Livreur</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#1f2937' }}>
              Mes Livraisons
            </h1>
            <p className="text-lg" style={{ color: '#6b7280' }}>
              Gérez et suivez vos livraisons assignées en temps réel
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(224, 231, 255, 0.5)',
                color: roleColor,
                boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
              }}
              disabled={loading.actions}
            >
              {loading.actions ? (
                <>
                  <SimpleLoader size="small" />
                  <span>Actualisation...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Actualiser</span>
                </>
              )}
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: roleColor,
                color: '#FFFFFF',
                boxShadow: `0 4px 20px ${roleColor}40`
              }}
            >
              <Download className="h-4 w-4" />
              Exporter
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map(({ icon: Icon, label, value, color }, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl group cursor-pointer"
              style={{
                border: '1px solid rgba(224, 231, 255, 0.5)',
                boxShadow: '0 10px 30px -10px rgba(129, 140, 248, 0.1)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                     style={{ backgroundColor: `${color}15` }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: '#6b7280' }}>{label}</p>
                <h2 className="text-2xl font-bold transition-all duration-500 group-hover:scale-110 min-h-[40px] flex items-center" 
                     style={{ color: '#1f2937' }}>
                  {value}
                </h2>
              </div>
            </div>
          ))}
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
                  placeholder="Rechercher par ID commande, ville, rue ou ID client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent group-hover:shadow-lg"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(224, 231, 255, 0.5)',
                    color: '#1f2937'
                  }}
                  disabled={loading.deliveries}
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
                    minWidth: '180px'
                  }}
                  disabled={loading.deliveries}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="EN_ATTENTE">En Attente</option>
                  <option value="ASSIGNEE">Assignée</option>
                  <option value="EN_COURS">En Cours</option>
                  <option value="LIVREE">Livrée</option>
                  <option value="RETOURNEE">Retournée</option>
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
                  minWidth: '160px'
                }}
                disabled={loading.deliveries}
              >
                <option value="all">Tous les types</option>
                <option value="STANDARD">Standard</option>
                <option value="EXPRESS">Express</option>
                <option value="PRIORITAIRE">Prioritaire</option>
              </select>

              <button
                onClick={() => { setTypeFilter("all"); setStatusFilter("all"); setSearchTerm(""); }}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(224, 231, 255, 0.5)',
                  color: roleColor,
                  boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                }}
                disabled={loading.deliveries}
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
            <h2 className="text-lg font-bold" style={{ color: '#1f2937' }}>
              {loading.deliveries ? (
                <div className="flex items-center gap-2">
                  <SimpleLoader size="small" />
                  <span>Chargement des livraisons...</span>
                </div>
              ) : (
                `Liste des Livraisons (${filteredDeliveries.length})`
              )}
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading.deliveries && deliveries.length === 0 ? (
              <div className="p-12 text-center">
                <SimpleLoader />
                <p className="mt-4 text-lg" style={{ color: '#6b7280' }}>Chargement des livraisons...</p>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="border-b" style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Commande
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Adresse
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Colis
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#6b7280' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.map((delivery) => (
                      <tr
                        key={delivery.idLivraison}
                        className="border-b transition-all duration-300 "
                        style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold" style={{ color: '#1f2937' }}>
                            #{delivery.orderId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium" style={{ color: '#1f2937' }}>
                            Client #{delivery.clientId}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                              <div className="font-medium transition-colors duration-300 group-hover:text-[#818CF8]"
                                   style={{ color: '#1f2937' }}>
                                {delivery.adresseDestination.ville}
                              </div>
                            </div>
                            <div className="text-sm" style={{ color: '#6b7280' }}>
                              {delivery.adresseDestination.rue}
                            </div>
                            {delivery.notes && (
                              <div className="text-xs mt-2 p-2 rounded-lg" 
                                   style={{ 
                                     backgroundColor: `${roleColor}08`,
                                     color: '#6b7280'
                                   }}>
                                {delivery.notes}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm" style={{ color: '#1f2937' }}>
                            {formatDate(delivery.dateLivraisonPrevue)}
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
                          <div className="flex items-center gap-3">
                            <Package className="h-5 w-5" style={{ color: '#9CA3AF' }} />
                            <div>
                              <div className="font-medium" style={{ color: '#1f2937' }}>
                                {delivery.colis.length} colis
                              </div>
                              <div className="text-sm" style={{ color: '#6b7280' }}>
                                {calculatePackageWeight(delivery)} kg
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Communication Actions */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => window.open(`tel:${"2127988982"}`)}
                                className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                                style={{
                                  backgroundColor: `${roleColor}15`,
                                  color: roleColor
                                }}
                                title="Appeler"
                              >
                                <Phone className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => window.open(`sms:${"2127988982"}`)}
                                className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                                style={{
                                  backgroundColor: `#10B98115`,
                                  color: '#10B981'
                                }}
                                title="Envoyer SMS"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const url = `https://www.google.com/maps/dir/?api=1&destination=${delivery.adresseOrigine.latitude},${delivery.adresseOrigine.longitude}`;
                                  window.open(url, "_blank");
                                }}
                                className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                                style={{
                                  backgroundColor: `#6366F115`,
                                  color: '#6366F1'
                                }}
                                title="Naviguer"
                              >
                                <Navigation className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Delivery Actions */}
                            <div className="flex items-center gap-2">
                              {delivery.etat === EtatLivraison.ASSIGNEE && (
                                <button
                                  onClick={() => handleStartDelivery(delivery)}
                                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                                  style={{
                                    backgroundColor: roleColor,
                                    color: '#FFFFFF',
                                    boxShadow: `0 4px 20px ${roleColor}40`
                                  }}
                                  disabled={loading.actions}
                                >
                                  {loading.actions ? (
                                    <>
                                      <SimpleLoader size="small" />
                                      <span>Démarrage...</span>
                                    </>
                                  ) : (
                                    'Démarrer'
                                  )}
                                </button>
                              )}
                              {delivery.etat === EtatLivraison.EN_COURS && (
                                <button
                                  onClick={() => handleCompleteDelivery(delivery)}
                                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                                  style={{
                                    backgroundColor: '#10B981',
                                    color: '#FFFFFF',
                                    boxShadow: `0 4px 20px #10B98140`
                                  }}
                                  disabled={loading.actions}
                                >
                                  {loading.actions ? (
                                    <>
                                      <SimpleLoader size="small" />
                                      <span>Terminaison...</span>
                                    </>
                                  ) : (
                                    'Terminer'
                                  )}
                                </button>
                              )}
                              {(delivery.etat === EtatLivraison.ECHEC ||
                                delivery.etat === EtatLivraison.EN_COURS) && (
                                <button
                                  onClick={() => handleReportReturn(delivery)}
                                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                                  style={{
                                    backgroundColor: '#EF4444',
                                    color: '#FFFFFF',
                                    boxShadow: `0 4px 20px #EF444440`
                                  }}
                                  disabled={loading.actions}
                                >
                                  {loading.actions ? (
                                    <>
                                      <SimpleLoader size="small" />
                                      <span>Signalement...</span>
                                    </>
                                  ) : (
                                    'Retour'
                                  )}
                                </button>
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
                    <Truck className="h-16 w-16 mx-auto mb-6" style={{ color: '#E0E7FF' }} />
                    <p className="text-lg mb-2" style={{ color: '#6b7280' }}>
                      Aucune livraison trouvée
                    </p>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>
                      Essayez d'ajuster vos critères de recherche
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivreurDeliveriesPage;