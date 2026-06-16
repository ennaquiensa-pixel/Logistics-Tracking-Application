import React, { useEffect, useState } from "react";
import { X, User, Mail, Phone, Save } from "lucide-react";
import { toast } from "react-toastify";
import userService from "../services/UserService";
import type { UpdateUserRequest } from "../types/UserTypes";
import { useAuth } from "../context/AuthContext";

interface UpdateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (updatedUser: any) => void;
  user: {
    id: number;
    nom: string;
    email: string;
    telephone: string;
  } | null;
}

const UpdateUserDialog: React.FC<UpdateUserDialogProps> = ({
  isOpen,
  onClose,
  onUserUpdated,
  user,
}) => {
  const [formData, setFormData] = useState({
    nom: user?.nom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phone , setPhone] = useState<string>("")
  const roleColor = "#818CF8";

  // Reset form when user changes
useEffect(() => {
    
 
     const userPhone = async()=>{
        const res = await userService.getUserById(Number(user?.id));
        setPhone(String(res.telephone))
        
    }
    userPhone();


    if (user) {
      setFormData({
        nom: user.nom || "",
        email: user.email || "",
        telephone: phone || "",
      });
      setErrors({});
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    } else if (formData.nom.length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.telephone)) {
      newErrors.telephone = "Format de téléphone invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Utilisateur non trouvé");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const updateRequest: UpdateUserRequest = {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
      };

      const updatedUser = await userService.updateUser(user.id, updateRequest);
      
      onUserUpdated(updatedUser);
      toast.success("Profil mis à jour avec succès!");
      onClose();
    } catch (error: any) {
      console.error("Error updating user:", error);
      const errorMessage = error.response?.data?.message || "Erreur lors de la mise à jour du profil";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };


  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{
          border: "1px solid rgba(224, 231, 255, 0.5)",
          boxShadow: "0 10px 30px -10px rgba(129, 140, 248, 0.1)",
        }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ backgroundColor: `${roleColor}15` }}
              >
                <User className="h-5 w-5" style={{ color: roleColor }} />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: "#1f2937" }}>
                  Mettre à jour votre profil
                </h3>
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  Modifiez vos informations personnelles
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-gray-50"
              style={{ color: "#9CA3AF" }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "#6b7280" }}>
                <User className="h-4 w-4" />
                Nom complet
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent ${
                  errors.nom ? "border-red-300" : "border-gray-200"
                }`}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(224, 231, 255, 0.5)",
                  color: "#1f2937",
                }}
                placeholder="Votre nom complet"
              />
              {errors.nom && (
                <p className="text-sm mt-1" style={{ color: "#EF4444" }}>
                  {errors.nom}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "#6b7280" }}>
                <Mail className="h-4 w-4" />
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent ${
                  errors.email ? "border-red-300" : "border-gray-200"
                }`}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(224, 231, 255, 0.5)",
                  color: "#1f2937",
                }}
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="text-sm mt-1" style={{ color: "#EF4444" }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "#6b7280" }}>
                <Phone className="h-4 w-4" />
                Numéro de téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent ${
                  errors.telephone ? "border-red-300" : "border-gray-200"
                }`}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(224, 231, 255, 0.5)",
                  color: "#1f2937",
                }}
                placeholder="+212 6XX XXX XXX"
              />
              {errors.telephone && (
                <p className="text-sm mt-1" style={{ color: "#EF4444" }}>
                  {errors.telephone}
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 mt-6 border-t" style={{ borderColor: "rgba(224, 231, 255, 0.5)" }}>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(224, 231, 255, 0.5)",
                  color: "#6b7280",
                }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: roleColor,
                  color: "#FFFFFF",
                  boxShadow: `0 4px 20px ${roleColor}40`,
                }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Mise à jour...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Sauvegarder</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserDialog;