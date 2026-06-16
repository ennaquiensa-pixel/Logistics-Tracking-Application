import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import type { LoginRequest } from '../types/authTypes/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Shield, Truck, Package } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const roleColor = "#818CF8";

  useEffect(() => {
    const emailFromRegister = location.state?.email || '';
    setFormData({
      email: emailFromRegister,
      password: '',
    });
  }, [location.state]);

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
      const response = await login(formData);

      toast.success('Connexion réussie ! Bienvenue !', {
        position: "top-right",
        autoClose: 1000,
      });

      const role = response.role;
      if (["ADMIN"].includes(role)) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

    } catch (err: any) {
      toast.error(err.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.', {
        position: "top-right",
        autoClose: 5000,
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
              Connexion à votre compte
            </h1>
            <p className="text-lg" style={{ color: '#6b7280' }}>
              Bienvenue de retour ! Veuillez entrer vos identifiants 123412341234
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8"
               style={{
                 border: '1px solid rgba(224, 231, 255, 0.5)',
                 boxShadow: '0 20px 60px -15px rgba(129, 140, 248, 0.1)'
               }}>
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent group-hover:shadow-lg"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(224, 231, 255, 0.5)',
                      color: '#1f2937'
                    }}
                    placeholder="Votre mot de passe"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center group cursor-pointer">
                  <div className="relative">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${rememberMe ? 'bg-[#818CF8]' : 'bg-transparent border'}`}
                         style={{ borderColor: rememberMe ? roleColor : 'rgba(224, 231, 255, 0.5)' }}>
                      {rememberMe && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <label htmlFor="remember-me" className="ml-3 text-sm cursor-pointer transition-colors duration-300 group-hover:text-[#818CF8]"
                         style={{ color: '#6b7280' }}>
                    Se souvenir de moi
                  </label>
                </div>

                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium transition-all duration-300 hover:scale-105"
                  style={{ color: roleColor }}
                >
                  Mot de passe oublié ?
                </Link>
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
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
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
                    Nouveau sur la plateforme ?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link 
                  to="/register" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 group"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(224, 231, 255, 0.5)',
                    color: roleColor,
                    boxShadow: '0 4px 20px rgba(129, 140, 248, 0.1)'
                  }}
                >
                  <User className="h-4 w-4" />
                  <span>Créer un compte</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t text-center text-xs"
                 style={{ borderColor: 'rgba(224, 231, 255, 0.5)', color: '#9CA3AF' }}>
              <p>© {new Date().getFullYear()} Plateforme Logistique. Tous droits réservés.</p>
              <p className="mt-1">
                <Link to="/privacy" className="hover:underline" style={{ color: '#6b7280' }}>
                  Confidentialité
                </Link>
                {' • '}
                <Link to="/terms" className="hover:underline" style={{ color: '#6b7280' }}>
                  Conditions
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;