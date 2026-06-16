import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import type { RegisterRequest } from '../types/authTypes/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Shield, Package } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    nom: '',
    telephone: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const roleColor = "#818CF8";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast.success('Inscription réussie ! Bienvenue parmi nous !', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate("/login", { state: { email: formData.email } });
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || 'Échec de l\'inscription. Veuillez réessayer.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements - MÊME STYLE QUE LES AUTRES DASHBOARDS */}
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

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
           
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1f2937' }}>
              Rejoignez-nous aujourd'hui
            </h1>
            <p className="text-lg" style={{ color: '#6b7280' }}>
              Commencez votre expérience avec notre plateforme
            </p>
          </div>

          {/* Registration Form Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8"
               style={{
                 border: '1px solid rgba(224, 231, 255, 0.5)',
                 boxShadow: '0 20px 60px -15px rgba(129, 140, 248, 0.1)'
               }}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <div className="group">
                <label htmlFor="nom" className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nom Complet
                  </div>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 transition-colors duration-300 group-hover:text-[#818CF8]" 
                          style={{ color: '#9CA3AF' }} />
                  </div>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent group-hover:shadow-lg"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(224, 231, 255, 0.5)',
                      color: '#1f2937'
                    }}
                    placeholder="Entrez votre nom complet"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Adresse Email
                  </div>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 transition-colors duration-300 group-hover:text-[#818CF8]" 
                          style={{ color: '#9CA3AF' }} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent group-hover:shadow-lg"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(224, 231, 255, 0.5)',
                      color: '#1f2937'
                    }}
                    placeholder="exemple@email.com"
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="group">
                <label htmlFor="telephone" className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Numéro de Téléphone
                  </div>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 transition-colors duration-300 group-hover:text-[#818CF8]" 
                          style={{ color: '#9CA3AF' }} />
                  </div>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent group-hover:shadow-lg"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(224, 231, 255, 0.5)',
                      color: '#1f2937'
                    }}
                    placeholder="+212612345678"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Mot de Passe
                  </div>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 transition-colors duration-300 group-hover:text-[#818CF8]" 
                          style={{ color: '#9CA3AF' }} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent group-hover:shadow-lg"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(224, 231, 255, 0.5)',
                      color: '#1f2937'
                    }}
                    placeholder="Entrez votre mot de passe (min. 6 caractères)"
                  />
                </div>
                <p className="mt-2 text-xs" style={{ color: '#9CA3AF' }}>
                  Minimum 6 caractères
                </p>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    backgroundColor: roleColor,
                    color: '#FFFFFF',
                    boxShadow: `0 10px 30px -10px ${roleColor}40`
                  }}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Création du compte...</span>
                    </>
                  ) : (
                    <>
                      <span>Créer un Compte</span>
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full" style={{ borderTop: '1px solid rgba(224, 231, 255, 0.5)' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white" style={{ color: '#6b7280' }}>
                    Vous avez déjà un compte ?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 group"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(224, 231, 255, 0.5)',
                    color: roleColor,
                    boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                  }}
                >
                  <User className="h-4 w-4" />
                  <span>Se connecter</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </form>

            {/* Terms and Conditions */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
              <p className="text-xs text-center" style={{ color: '#9CA3AF' }}>
                En créant un compte, vous acceptez nos{' '}
                <Link to="/terms" className="hover:underline" style={{ color: roleColor }}>
                  Conditions d'utilisation
                </Link>
                {' '}et notre{' '}
                <Link to="/privacy" className="hover:underline" style={{ color: roleColor }}>
                  Politique de confidentialité
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t text-center text-xs"
                 style={{ borderColor: 'rgba(224, 231, 255, 0.5)', color: '#9CA3AF' }}>
          <p>© {new Date().getFullYear()} Plateforme Logistique. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;