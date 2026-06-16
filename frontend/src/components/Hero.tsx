import React from "react";
import { ArrowRight, Check, Play } from "lucide-react";
import Features from "./Features";
import Stats from "./Stats";
import CTASection from "./CTASection";
import { Link } from "react-router-dom";
import Testimonial from "./Testimonial";

const Hero: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden" >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute  "
          // poster="https://www.pexels.com/download/video/5200378/"
        >
          {/* <source
            src="https://www.pexels.com/download/video/5200378/"
            type="video/mp4"
          /> */}
          <source
            src="https://www.pexels.com/download/video/5200378/"
            // type="video/mp4"
          />
        </video>
        
        {/* Color overlay using your purple palette */}
        <div 
          className="absolute   inset-0 bg-gradient-to-b"
          style={{
            background: 'linear-gradient(to bottom, rgba(79, 70, 229, 0.8), rgba(99, 101, 241, 0.42), rgba(129, 140, 248, 0.4))'
          }}
        ></div>
        
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Blob 1 - #818CF8 */}
          <div 
            className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"
            style={{ backgroundColor: '#818CF8' }}
          ></div>
          
          {/* Blob 2 - #6366F1 */}
          <div 
            className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"
            style={{ backgroundColor: '#6366F1' }}
          ></div>
          
          {/* Blob 3 - #4F46E5 */}
          <div 
            className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"
            style={{ backgroundColor: '#4F46E5' }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="py-24 lg:py-40 text-center">
          {/* Badge */}
          <div 
            className="mb-8 inline-flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-full border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
          >
            <Play className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              Watch our story in 2 minutes
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-white drop-shadow-2xl">
              Fast. Reliable.
              <br />
            </span>
            <span 
              className="text-white drop-shadow-lg"
              // style={{
              //   background: 'linear-gradient(to right, #E0E7FF, #FFFFFF, #E0E7FF)'
              // }}
            >
              Logistics Made Simple.
            </span>
          </h1>

          {/* Description */}
          <div 
            className="mt-6 text-xl max-w-3xl mx-auto font-light backdrop-blur-sm px-6 py-4 rounded-2xl border"
            style={{
              color: '#E0E7FF',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            Manage your deliveries, warehouses, and routes efficiently with our
            all-in-one logistics platform. Track shipments, optimize routes, and
            keep your customers happy.
          </div>

          {/* Buttons */}
          <div className="mt-12 mb-10 flex flex-col sm:flex-row gap-6  justify-center items-center">
            {/* Primary Button */}
            <button 
              className="group px-10 py-5 rounded-xl font-semibold hover:bg-[#E0E7FF] transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-2xl"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#4F46E5',
                boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.3)'
              }}
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Secondary Button */}
            <Link
              to="/products"
              className="group border-2 backdrop-blur-sm px-10 py-5 rounded-xl font-semibold hover:bg-white transition-all duration-300 transform hover:scale-105"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF'
              }}
            >
              <span className="flex items-center gap-3 group-hover:text-[#ffff]">
                Order Now
                <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20  grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { label: "99.9% Uptime", desc: "Guaranteed reliability" },
              { label: "24/7 Support", desc: "Always here to help" },
              { label: "Secure & Reliable", desc: "Enterprise-grade security" },
            ].map((item, index) => (
              <div
                key={index}
                className="backdrop-blur-md rounded-2xl p-6 hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)' }}
                  >
                    <Check 
                      className="h-6 w-6"
                      style={{ color: '#E0E7FF' }}
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{item.label}</div>
                    <div 
                      className="text-sm mt-2"
                      style={{ color: 'rgba(224, 231, 255, 0.8)' }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="mt-20 animate-bounce">
            <div className="flex flex-col items-center gap-2">
              <div 
                className="text-sm font-medium"
                style={{ color: 'rgba(224, 231, 255, 0.6)' }}
              >
                Scroll to explore
              </div>
              <div 
                className="w-px h-12 bg-gradient-to-b"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.6), transparent)'
                }}
              ></div>
            </div>
          </div>
        </main>
      </div>

      {/* Sections with fade transition */}
      <div className="relative z-10">
        <div 
          className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b -translate-y-px"
          style={{
            background: 'linear-gradient(to bottom, transparent, #FFFFFF)'
          }}
        ></div>
        <div className="relative z-20  bg-white">
          <Features />
          <Stats />
          <CTASection />
          <Testimonial />
        </div>
      </div>

      {/* Custom animation styles */}
      {/* <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style> */}
    </div>
  );
};

export default Hero;