import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Package, MapPin, Calendar, Clock, User,
  Truck, Phone, Mail, Edit, Trash2, RefreshCw,
  CheckCircle, XCircle, AlertCircle, Clock4, Calendar as CalendarIcon,
  Navigation, DollarSign, Weight, Ruler, FileText
} from 'lucide-react';
import deliveryService from '../../services/DeliveryService';
import { EtatLivraison, TypeLivraison, type LivraisonResponse, type ColisResponse } from '../../types/deliveryTypes/deliveryTypes';

const DeliveryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<LivraisonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDeliveryDetails();
    }
  }, [id]);

  const fetchDeliveryDetails = async () => {
    try {
      setLoading(true);
      const deliveryData = await deliveryService.getLivraisonById(Number(id));
      setDelivery(deliveryData);
    } catch (error) {
      console.error('Error fetching delivery details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: EtatLivraison) => {
    if (!delivery) return;

    try {
      setUpdating(true);
      await deliveryService.updateStatus(delivery.idLivraison, { 
        nouvelEtat: newStatus,
        notes: `Statut changé à ${newStatus}`
      });
      await fetchDeliveryDetails(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelDelivery = async () => {
    if (!delivery) return;

    if (window.confirm('Êtes-vous sûr de vouloir annuler cette livraison ?')) {
      try {
        await deliveryService.cancelLivraison(delivery.idLivraison, 'Annulé par l\'administrateur');
        navigate('/admin/deliveries');
      } catch (error) {
        console.error('Error cancelling delivery:', error);
      }
    }
  };

  const getStatusIcon = (status: EtatLivraison) => {
    switch (status) {
      case EtatLivraison.LIVREE:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case EtatLivraison.EN_COURS:
        return <Truck className="h-5 w-5 text-blue-500" />;
      case EtatLivraison.EN_ATTENTE:
        return <Clock4 className="h-5 w-5 text-yellow-500" />;
      case EtatLivraison.PLANIFIEE:
        return <CalendarIcon className="h-5 w-5 text-purple-500" />;
      case EtatLivraison.ANNULEE:
        return <XCircle className="h-5 w-5 text-red-500" />;
      case EtatLivraison.RETOURNEE:
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: EtatLivraison) => {
    switch (status) {
      case EtatLivraison.LIVREE: return 'bg-green-100 text-green-800 border-green-200';
      case EtatLivraison.EN_COURS: return 'bg-blue-100 text-blue-800 border-blue-200';
      case EtatLivraison.EN_ATTENTE: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case EtatLivraison.PLANIFIEE: return 'bg-purple-100 text-purple-800 border-purple-200';
      case EtatLivraison.ANNULEE: return 'bg-red-100 text-red-800 border-red-200';
      case EtatLivraison.RETOURNEE: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: TypeLivraison) => {
    switch (type) {
      case TypeLivraison.EXPRESS: return 'bg-red-100 text-red-800';
      case TypeLivraison.PRIORITAIRE: return 'bg-orange-100 text-orange-800';
      case TypeLivraison.STANDARD: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseDimensions = (dimensions: string) => {
    // Handle dimensions string format (e.g., "10x20x30")
    const dims = dimensions.split('x').map(d => parseInt(d));
    return {
      length: dims[0] || 0,
      width: dims[1] || 0,
      height: dims[2] || 0
    };
  };

  const calculateTotalWeight = () => {
    if (!delivery?.colis) return 0;
    return delivery.colis.reduce((total, colis) => total + (colis.poids || 0), 0);
  };

  const calculateTotalVolume = () => {
    if (!delivery?.colis) return 0;
    return delivery.colis.reduce((total, colis) => {
      const dims = parseDimensions(colis.dimensions);
      return total + (dims.length * dims.width * dims.height / 1000000); // Convert to m³
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Livraison non trouvée</h2>
          <p className="text-gray-600 mt-2">La livraison demandée n'existe pas ou a été supprimée.</p>
          <button
            onClick={() => navigate('/admin/deliveries')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux livraisons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/deliveries')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Retour</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Livraison #{delivery.idLivraison}
                </h1>
                <p className="text-gray-600 mt-1">
                  Commande #{delivery.orderId} • Client #{delivery.clientId}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchDeliveryDetails}
                className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Actualiser</span>
              </button>
              <button
                onClick={() => navigate(`/admin/deliveries/${delivery.idLivraison}/edit`)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Modifier</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Statut de la Livraison</h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(delivery.etat)}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(delivery.etat)}`}>
                    {delivery.etat}
                  </span>
                </div>
              </div>
              
              {delivery.etat !== EtatLivraison.LIVREE && delivery.etat !== EtatLivraison.ANNULEE && (
                <div className="flex space-x-3">
                  {delivery.etat === EtatLivraison.EN_ATTENTE && (
                    <button
                      onClick={() => handleStatusUpdate(EtatLivraison.EN_COURS)}
                      disabled={updating}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                      {updating ? 'Mise à jour...' : 'Démarrer la Livraison'}
                    </button>
                  )}
                  {delivery.etat === EtatLivraison.EN_COURS && (
                    <button
                      onClick={() => handleStatusUpdate(EtatLivraison.LIVREE)}
                      disabled={updating}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                    >
                      {updating ? 'Mise à jour...' : 'Marquer comme Livrée'}
                    </button>
                  )}
                  <button
                    onClick={handleCancelDelivery}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Annuler la Livraison
                  </button>
                </div>
              )}
            </div>

            {/* Package Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails des Colis</h2>
              <div className="space-y-4">
                {delivery.colis && delivery.colis.length > 0 ? (
                  delivery.colis.map((colis, index) => {
                    const dimensions = parseDimensions(colis.dimensions);
                    return (
                      <div key={colis.packageId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-900">Colis #{colis.packageId}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(delivery.type)}`}>
                            {delivery.type}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Weight className="h-4 w-4 text-gray-400" />
                            <span>Poids: {colis.poids} kg</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Ruler className="h-4 w-4 text-gray-400" />
                            <span>Dimensions: {dimensions.length}x{dimensions.width}x{dimensions.height} cm</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span>Volume: {(dimensions.length * dimensions.width * dimensions.height / 1000000).toFixed(3)} m³</span>
                          </div>
                        </div>
                        {colis.description && (
                          <p className="text-sm text-gray-600 mt-2">{colis.description}</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucun détail de colis disponible</p>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Livraison créée</p>
                    <p className="text-sm text-gray-500">{formatDate(delivery.dateCreation)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Livraison planifiée</p>
                    <p className="text-sm text-gray-500">Pour le {formatDate(delivery.dateLivraisonPrevue)}</p>
                  </div>
                </div>
                {delivery.dateLivraisonEffective && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Livraison effectuée</p>
                      <p className="text-sm text-gray-500">{formatDate(delivery.dateLivraisonEffective)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations Livraison</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(delivery.type)}`}>
                    {delivery.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Distance</span>
                  <span className="text-sm font-medium text-gray-900">{delivery.distanceKm || 'N/A'} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Prix</span>
                  <span className="text-sm font-medium text-gray-900">{delivery.prixLivraison || '0'} €</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Poids total</span>
                  <span className="text-sm font-medium text-gray-900">{calculateTotalWeight()} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Volume total</span>
                  <span className="text-sm font-medium text-gray-900">{calculateTotalVolume().toFixed(3)} m³</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nombre de colis</span>
                  <span className="text-sm font-medium text-gray-900">{delivery.colis?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Adresses</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    Origine
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>{delivery.adresseOrigine.rue}</p>
                    <p>{delivery.adresseOrigine.ville}, {delivery.adresseOrigine.codePostal}</p>
                    <p>{delivery.adresseOrigine.pays}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Coordonnées: {delivery.adresseOrigine.latitude.toFixed(6)}, {delivery.adresseOrigine.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Navigation className="h-4 w-4 mr-2 text-green-500" />
                    Destination
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>{delivery.adresseDestination.rue}</p>
                    <p>{delivery.adresseDestination.ville}, {delivery.adresseDestination.codePostal}</p>
                    <p>{delivery.adresseDestination.pays}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Coordonnées: {delivery.adresseDestination.latitude.toFixed(6)}, {delivery.adresseDestination.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chauffeur</h2>
              {delivery.livreurNom ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{delivery.livreurNom}</p>
                      <p className="text-sm text-gray-500">Chauffeur #{delivery.livreurId}</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Contacter le Chauffeur
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Truck className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Aucun chauffeur assigné</p>
                  <button className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Assigner un Chauffeur
                  </button>
                </div>
              )}
            </div>

            {/* Notes */}
            {delivery.notes && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
                <p className="text-sm text-gray-600">{delivery.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;