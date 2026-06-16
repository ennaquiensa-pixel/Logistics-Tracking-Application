// components/warehouse/AddWarehouseDialog.tsx
import React, { useState } from "react";


import { toast } from "react-toastify";
import { wareHouseService } from "../services/WareHouseService";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { TypeEntrepot, type WarehouseRequest } from "../types/warehouseType/WarehouseResponse";

interface AddWarehouseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWarehouseAdded: () => void;
}

const AddWarehouseDialog: React.FC<AddWarehouseDialogProps> = ({
  open,
  onOpenChange,
  onWarehouseAdded,
}) => {
  const [formData, setFormData] = useState<WarehouseRequest >({
    code: "",
    nom: "",
    type: TypeEntrepot.PRINCIPAL || TypeEntrepot.LOCAL || TypeEntrepot.TEMPORAIRE || TypeEntrepot.TRANSIT || TypeEntrepot.REGIONAL,
    adresse: {
      rue: "",
      ville: "",
      codePostal: "",
      pays: "",
      latitude: 0,
      longitude: 0,
    },
    capaciteMax: 0,
    superficieM2: 0,
    telephone: "",
    email: "",
    responsableNom: "",
    responsableTelephone: "",
    horairesOuverture: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("adresse.")) {
      const addressField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        adresse: {
          ...prev.adresse,
          [addressField]: addressField === "latitude" || addressField === "longitude" ? parseFloat(value) || 0 : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === "capaciteMax" || name === "superficieM2" ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await wareHouseService.createWareHouse(formData);
      toast.success("Warehouse created successfully!");
      onOpenChange(false);
      setFormData({
        code: "",
        nom: "",
        type: TypeEntrepot.PRINCIPAL,
        adresse: {
          rue: "",
          ville: "",
          codePostal: "",
          pays: "",
          latitude: 0,
          longitude: 0,
        },
        capaciteMax: 0,
        superficieM2: 0,
        telephone: "",
        email: "",
        responsableNom: "",
        responsableTelephone: "",
        horairesOuverture: "",
        description: "",
      });
      onWarehouseAdded();
    } catch (error) {
      toast.error("Failed to create warehouse");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Warehouse</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new warehouse facility.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                  placeholder="WH-001"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Name *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                  placeholder="Central Warehouse"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="PRINCIPAL">Principal</option>
                  <option value="SECONDAIRE">Secondary</option>
                  <option value="TEMPORAIRE">Temporary</option>
                  <option value="LOCAL">Local</option>
                  <option value="TRANSIT">Transit</option>
                  <option value="REGIONAL">Regional</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Max Capacity</label>
                <input
                  type="number"
                  min={0}
                  name="capaciteMax"
                  value={formData.capaciteMax}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="10000"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Street</label>
                <input
                  type="text"
                  name="adresse.rue"
                  value={formData.adresse.rue}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="text-sm font-medium">City</label>
                <input
                  type="text"
                  name="adresse.ville"
                  value={formData.adresse.ville}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Casablanca"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Postal Code</label>
                <input
                  type="text"
                  name="adresse.codePostal"
                  value={formData.adresse.codePostal}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="20000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Country</label>
                <input
                  type="text"
                  name="adresse.pays"
                  value={formData.adresse.pays}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Morocco"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="+212 600-000000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="warehouse@company.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Manager Name</label>
                <input
                  type="text"
                  name="responsableNom"
                  value={formData.responsableNom}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Ahmed Benali"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Manager Phone</label>
                <input
                  type="tel"
                  name="responsableTelephone"
                  value={formData.responsableTelephone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="+212 600-000001"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Surface Area (m²)</label>
                <input
                  type="number"
                  name="superficieM2"
                  value={formData.superficieM2}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Opening Hours</label>
                <input
                  type="text"
                  name="horairesOuverture"
                  value={formData.horairesOuverture}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Mon-Fri: 8:00-18:00"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border rounded-md"
                placeholder="Additional details about the warehouse..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Warehouse"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWarehouseDialog;