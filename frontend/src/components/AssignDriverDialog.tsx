// components/delivery/AssignDriverDialog.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "./ui/dialog";

import { User, Truck, MapPin, Package, CheckCircle, Loader } from "lucide-react";
import { EtatLivraison, type LivraisonResponse } from "../types/deliveryTypes/deliveryTypes";
import type { LivreurResponse } from "../types/UserTypes";
import userService from "../services/UserService";
import deliveryService from "../services/DeliveryService";
import { Button } from "./ui/button";

interface AssignDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDeliveries: LivraisonResponse[];
  onAssignmentComplete: () => void;
}

const AssignDriverDialog: React.FC<AssignDriverDialogProps> = ({
  open,
  onOpenChange,
  selectedDeliveries,
  onAssignmentComplete,
}) => {
  const [availableDrivers, setAvailableDrivers] = useState<LivreurResponse[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingDrivers, setFetchingDrivers] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      resetState();
      fetchAvailableDrivers();
    }
  }, [open]);

  const resetState = () => {
    setSelectedDriverId(null);
    setLoading(false);
  };

  const fetchAvailableDrivers = async () => {
    try {
      setFetchingDrivers(true);
      const drivers = await userService.getAllLivreurs();
      
      // Filter only active and available drivers (not on delivery)
      const available = drivers.filter(driver => 
        driver.active || 
        driver.disponibilite ||
        driver.latitudeActuelle ||
        driver.longitudeActuelle
      );
      
      setAvailableDrivers(available);
      
      // Auto-select first driver if available
      if (available.length > 0 && !selectedDriverId) {
        setSelectedDriverId(available[0].idUser);
      }
    } catch (error) {
      toast.error("Failed to fetch available drivers");
      console.error("Error fetching drivers:", error);
    } finally {
      setFetchingDrivers(false);
    }
  };

  const getDeliveryStatusColor = (etat: EtatLivraison) => {
    switch (etat) {
      case EtatLivraison.EN_ATTENTE:
        return "bg-yellow-100 text-yellow-800";
      case EtatLivraison.EN_PREPARATION:
        return "bg-indigo-100 text-indigo-800";
      case EtatLivraison.EN_COURS:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDeliveryStatusText = (etat: EtatLivraison) => {
    switch (etat) {
      case EtatLivraison.EN_ATTENTE:
        return "En Attente";
      case EtatLivraison.EN_PREPARATION:
        return "En Préparation";
      case EtatLivraison.EN_COURS:
        return "En Cours";
      default:
        return etat;
    }
  };

  const calculateTotalPackages = () => {
    return selectedDeliveries.reduce((total, delivery) => 
      total + delivery.colis.length, 0
    );
  };

  const getSelectedDriver = () => {
    return availableDrivers.find(driver => driver.idUser === selectedDriverId);
  };

  const handleAssign = async () => {
    if (!selectedDriverId || selectedDeliveries.length === 0) {
      toast.error("Please select a driver and at least one delivery");
      return;
    }

    setAssigning(true);

    try {
      const assignments = selectedDeliveries.map(delivery => ({
        livraisonId: delivery.idLivraison,
        livreurId: selectedDriverId
      }));

      // Assign each delivery to the driver
      const promises = assignments.map(assignment => 
        deliveryService.assignDriver(assignment)
      );

      await Promise.all(promises);
      
      toast.success(`${selectedDeliveries.length} delivery(s) assigned successfully!`);
      onAssignmentComplete();
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to assign driver";
      toast.error(errorMessage);
      console.error("Assignment error:", error);
    } finally {
      setAssigning(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Driver to Deliveries</DialogTitle>
          <DialogDescription>
            Select a driver to assign to {selectedDeliveries.length} selected delivery(s)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Deliveries Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Selected Deliveries ({selectedDeliveries.length})</h3>
            <div className="space-y-2">
              {selectedDeliveries.slice(0, 3).map((delivery) => (
                <div key={delivery.idLivraison} className="flex items-center justify-between p-3 bg-white rounded-md border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-md">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Delivery #{delivery.idLivraison}
                      </div>
                      <div className="text-sm text-gray-600">
                        {delivery.adresseDestination.ville} • {delivery.colis.length} package(s)
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryStatusColor(delivery.etat)}`}>
                    {getDeliveryStatusText(delivery.etat)}
                  </span>
                </div>
              ))}
              
              {selectedDeliveries.length > 3 && (
                <div className="text-center text-sm text-gray-500 pt-2">
                  + {selectedDeliveries.length - 3} more delivery(s)
                </div>
              )}
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900">{calculateTotalPackages()}</div>
                <div className="text-gray-600">Total Packages</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {selectedDeliveries.filter(d => d.distanceKm).length > 0 
                    ? selectedDeliveries.reduce((sum, d) => sum + (d.distanceKm || 0), 0).toFixed(1)
                    : '0'} km
                </div>
                <div className="text-gray-600">Total Distance</div>
              </div>
            </div>
          </div>

          {/* Driver Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Driver</h3>
            
            {fetchingDrivers ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <Loader className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-gray-600">Loading available drivers...</p>
                </div>
              </div>
            ) : availableDrivers.length === 0 ? (
              <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
                <User className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">No available drivers</p>
                <p className="text-gray-600 text-sm mt-1">
                  All drivers are currently busy or offline. Please try again later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDrivers.map((driver) => (
                  <div
                    key={driver.idUser}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedDriverId === driver.idUser
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDriverId(driver.idUser)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{driver.nom}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            Vehicle #{driver.vehiculeId || 'N/A'}
                          </div>
                        </div>
                      </div>
                      {selectedDriverId === driver.idUser && (
                        <div className="p-1 bg-blue-100 rounded-full">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <span>⭐ {driver.noteMoyenne.toFixed(1)}</span>
                      </div>
                      <div className="text-gray-600">
                        {driver.nombreLivraisonsEffectuees} deliveries
                      </div>
                    </div>
                    
                    {driver.latitudeActuelle && driver.longitudeActuelle && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>Current Location</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Driver Details */}
          {selectedDriverId && getSelectedDriver() && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Selected Driver</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{getSelectedDriver()!.nom}</div>
                    <div className="text-sm text-gray-600">
                      {getSelectedDriver()!.telephone} • {getSelectedDriver()!.email}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {getSelectedDriver()!.nombreLivraisonsEffectuees} deliveries
                  </div>
                  <div className="text-sm text-gray-600">
                    ⭐ {getSelectedDriver()!.noteMoyenne.toFixed(1)} rating
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={assigning}
            className="px-6"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleAssign}
            disabled={!selectedDriverId || availableDrivers.length === 0 || assigning}
            className="px-6 bg-green-600 hover:bg-green-700"
          >
            {assigning ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Assigning...
              </>
            ) : (
              `Assign to ${selectedDeliveries.length} Delivery(s)`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDriverDialog;