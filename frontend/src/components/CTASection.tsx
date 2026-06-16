import React from "react";
import { ArrowRight, Star, CheckCircle, Zap, Shield, Clock, Users, Rocket } from "lucide-react";

const CTASection: React.FC = () => (
  <section className="py-28 text-center relative overflow-hidden">
    {/* Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF]/5 via-white to-[#6366F1]/5"></div>
    
    {/* Animated Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      {/* Large floating blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-10 animate-blob"
           style={{ backgroundColor: '#818CF8', filter: 'blur(60px)' }}></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-10 animate-blob animation-delay-2000"
           style={{ backgroundColor: '#6366F1', filter: 'blur(60px)' }}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-10 animate-blob animation-delay-4000"
           style={{ backgroundColor: '#4F46E5', filter: 'blur(60px)' }}></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5"
           style={{
             backgroundImage: `linear-gradient(${['#818CF8', '#6366F1', '#4F46E5'][0]} 1px, transparent 1px),
                               linear-gradient(90deg, ${['#818CF8', '#6366F1', '#4F46E5'][0]} 1px, transparent 1px)`,
             backgroundSize: '50px 50px'
           }}
      ></div>
    </div>

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Premium Badge */}
      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-10 relative group"
           style={{
             backgroundColor: 'rgba(224, 231, 255, 0.1)',
             border: '1px solid rgba(129, 140, 248, 0.3)',
             backdropFilter: 'blur(10px)'
           }}>
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
             style={{
               background: 'linear-gradient(90deg, #818CF8, #6366F1, #4F46E5)',
               filter: 'blur(20px)'
             }}></div>
        <Star className="h-5 w-5 relative z-10" style={{ color: '#818CF8' }} fill="#818CF8" />
        <span className="text-sm font-semibold relative z-10" style={{ color: '#4F46E5' }}>
          Trusted by 800+ Leading Companies
        </span>
        <div className="w-2 h-2 rounded-full animate-pulse relative z-10" style={{ backgroundColor: '#6366F1' }}></div>
      </div>

      {/* Main Headline */}
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
        <span className="block" style={{ color: '#1f2937' }}>Ready to Transform</span>
        <span 
          className="block"
          style={{
            background: "linear-gradient(90deg, #6366F1, #818CF8, #4F46E5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: '0 4px 30px rgba(129, 140, 248, 0.2)'
          }}
        >
          Your Logistics?
        </span>
      </h2>
      
      {/* Subtitle */}
      <p className="mb-12 text-lg sm:text-xl max-w-3xl mx-auto px-6 py-5 rounded-2xl"
         style={{
           color: '#6b7280',
           backgroundColor: 'rgba(255, 255, 255, 0.7)',
           backdropFilter: 'blur(10px)',
           border: '1px solid rgba(224, 231, 255, 0.4)',
           boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.1)'
         }}>
        Join thousands of businesses that trust our platform for seamless delivery management, 
        real-time tracking, and optimized operations.
      </p>

      {/* Feature Highlights */}
      <div className="flex flex-wrap justify-center gap-8 mb-16">
        {[
          { icon: Zap, text: "No credit card required", color: "#818CF8" },
          { icon: Clock, text: "14-day free trial", color: "#6366F1" },
          { icon: Rocket, text: "Setup in 5 minutes", color: "#4F46E5" },
          { icon: Shield, text: "Enterprise security", color: "#818CF8" }
        ].map((feature, index) => (
          <div key={index} className="flex items-center gap-3 group cursor-default">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                 style={{
                   backgroundColor: `${feature.color}15`,
                   border: `1px solid ${feature.color}30`
                 }}>
              <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
            </div>
            <span className="text-base font-medium" style={{ color: '#4b5563' }}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Buttons with advanced effects */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
        {/* Primary Button */}
        <button 
          className="group relative px-12 py-5 rounded-xl font-semibold transition-all duration-500 transform hover:scale-105 flex items-center gap-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
            color: '#FFFFFF',
            boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)'
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
               style={{
                 background: 'linear-gradient(90deg, transparent, #FFFFFF, transparent)',
                 transform: 'translateX(-100%)'
               }}></div>
          
          <span className="relative z-10">Start Free Trial</span>
          <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-50 animate-ping"
               style={{ backgroundColor: '#818CF8' }}></div>
        </button>
        
        {/* Secondary Button */}
        <button 
          className="group relative px-12 py-5 rounded-xl font-semibold transition-all duration-500 transform hover:scale-105 flex items-center gap-4 overflow-hidden"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #6366F1',
            color: '#6366F1',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Hover gradient */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
               style={{
                 background: 'linear-gradient(135deg, #6366F1, #818CF8)'
               }}></div>
          
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
            Schedule Demo
          </span>
          <Users className="h-5 w-5 relative z-10 transition-colors duration-300 group-hover:text-white" />
        </button>
      </div>

      {/* Trust Indicators Grid */}
      <div className="mt-16 pt-12 border-t"
           style={{ borderColor: 'rgba(224, 231, 255, 0.5)' }}>
        <p className="text-sm font-semibold uppercase tracking-wider mb-10"
           style={{ color: '#818CF8', letterSpacing: '0.2em' }}>
          Enterprise-Grade Features Included
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { 
              label: "Enterprise Grade", 
              description: "Scalable for any business size",
              icon: Shield,
              color: "#818CF8"
            },
            { 
              label: "Bank-level Security", 
              description: "End-to-end encryption",
              icon: Shield,
              color: "#6366F1"
            },
            { 
              label: "24/7 Support", 
              description: "Always available",
              icon: Clock,
              color: "#4F46E5"
            },
            { 
              label: "99.9% Uptime", 
              description: "Guaranteed reliability",
              icon: CheckCircle,
              color: "#818CF8"
            }
          ].map((feature, index) => (
            <div key={index} className="text-center group">
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 mx-auto transition-all duration-500 group-hover:scale-110"
                style={{
                  backgroundColor: `${feature.color}15`,
                  border: `1px solid ${feature.color}30`
                }}
              >
                <feature.icon className="h-7 w-7" style={{ color: feature.color }} />
              </div>
              
              <h4 className="font-bold text-lg mb-2" style={{ color: '#1f2937' }}>
                {feature.label}
              </h4>
              
              <p className="text-sm" style={{ color: '#6b7280' }}>
                {feature.description}
              </p>
              
              {/* Connecting dots */}
              {index < 3 && (
                <div className="hidden md:block absolute top-10 right-0 w-6 h-6">
                  <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full opacity-30"
                       style={{ backgroundColor: feature.color }}></div>
                  <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-px opacity-20"
                       style={{ backgroundColor: feature.color }}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 p-8 rounded-3xl relative overflow-hidden group"
           style={{
             background: 'linear-gradient(135deg, rgba(224, 231, 255, 0.2), rgba(129, 140, 248, 0.1))',
             border: '1px solid rgba(129, 140, 248, 0.2)'
           }}>
        {/* Animated background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
             style={{
               background: 'radial-gradient(circle at center, #818CF8 0%, transparent 70%)',
               filter: 'blur(40px)'
             }}></div>
        
        <div className="relative z-10">
          <p className="text-xl font-medium mb-6" style={{ color: '#4F46E5' }}>
            Still have questions?
          </p>
          <button 
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#6366F1',
              boxShadow: '0 10px 30px -5px rgba(99, 102, 241, 0.3)'
            }}
          >
            Talk to an Expert
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>

    {/* Custom animations */}
   
  </section>
);

export default CTASection;