import React, { useState } from 'react';
import { 
  UserPlus, X, Save, User, Mail, Phone, Lock, Shield, 
   Truck, Building, AlertCircle, CheckCircle 
} from 'lucide-react';
import type { AddUserRequest } from '../types/UserTypes';
import userService from '../services/UserService';
import { useAuth } from '../context/AuthContext';

  

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: any) => void;
  defaultRole?: 'CLIENT' | 'LIVREUR' | 'MANAGER' | 'ADMIN';
  title?: string;
  description?: string;
  showRoleSelector?: boolean;
  allowedRoles?: ('CLIENT' | 'LIVREUR' | 'MANAGER' | 'ADMIN')[];
  additionalFields?: React.ReactNode;
}

const AddUser: React.FC<AddUserProps> = ({
  isOpen,
  onClose,
  onUserAdded,
  defaultRole = 'CLIENT',
  title = 'Add New User',
  description = 'Create a new user account in the system',
  showRoleSelector = true,
  allowedRoles = ['CLIENT', 'LIVREUR', 'MANAGER', 'ADMIN'],
  additionalFields
}) => {
  const [formData, setFormData] = useState<AddUserRequest>({
    email: '',
    password: '',
    nom: '',
    telephone: '',
    role: defaultRole
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
 const { user } = useAuth();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let response;
      
      // Determine which service method to use based on current user role and target role
      if (user?.role === 'MANAGER') {
        response = await userService.addUserByManager(formData);
      } else {
        response = await userService.addUserByAdmin(formData);
      }

      setSuccess('User created successfully!');
      setFormData({
        email: '',
        password: '',
        nom: '',
        telephone: '',
        role: defaultRole
      });
      
      // Notify parent component
      onUserAdded(response);
      
      // Auto-close after success (optional)
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="h-5 w-5" />;
      case 'MANAGER':
        return <Building className="h-5 w-5" />;
      case 'LIVREUR':
        return <Truck className="h-5 w-5" />;
      case 'CLIENT':
        return <User className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Full system access and management capabilities';
      case 'MANAGER':
        return 'Regional management and team oversight';
      case 'LIVREUR':
        return 'Delivery driver with route assignments';
      case 'CLIENT':
        return 'Customer with ordering and tracking capabilities';
      default:
        return '';
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      nom: '',
      telephone: '',
      role: defaultRole
    });
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-700">{success}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1234567890"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password (min. 6 characters)"
              />
            </div>
          </div>

          {/* Role Selector */}
          {showRoleSelector && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                User Role *
              </label>
              <div className="space-y-2">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {allowedRoles.map(role => (
                    <option key={role} value={role}>
                      {role.charAt(0) + role.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                
                {/* Role Description */}
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  {getRoleIcon(formData.role)}
                  <span className="text-sm text-gray-600">
                    {getRoleDescription(formData.role)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Fields */}
          {additionalFields}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;