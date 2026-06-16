import React, { useEffect, useState } from "react";
import productService from "../../services/productService";
import type { productResponse } from "../../types/productTYpes/productResponse";
import ThreeDCardDemo from "../../components/CardItem";
import Spinner from "../../components/Spinner";
import { Package, Search, Filter, Truck, TrendingUp, Star, Zap } from "lucide-react";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<productResponse[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const products = await productService.getAllProducts();
        console.log(products);
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search term and filter
  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    // Add more filter logic as needed based on your product data
    return matchesSearch;
  });

  if (isLoading) {
    return <Spinner fullScreen={true} />;
  }

  const stats = [
    { icon: Package, value: products?.length || 0, label: "Total Products", color: "#818CF8" },
    { icon: Truck, value: "24/7", label: "Delivery Support", color: "#6366F1" },
    { icon: Star, value: "4.9", label: "Average Rating", color: "#FBBF24" },
    { icon: Zap, value: "Express", label: "Delivery Options", color: "#4F46E5" },
  ];

  const filters = [
    { id: "all", label: "All Products", color: "#818CF8" },
    { id: "express", label: "Express Delivery", color: "#6366F1" },
    { id: "standard", label: "Standard Delivery", color: "#4F46E5" },
    { id: "premium", label: "Premium Service", color: "#818CF8" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-[#E0E7FF]/5 via-white to-[#6366F1]/5"></div>
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
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

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                 style={{
                   backgroundColor: 'rgba(224, 231, 255, 0.1)',
                   border: '1px solid rgba(129, 140, 248, 0.3)'
                 }}>
              <Package className="h-4 w-4" style={{ color: '#818CF8' }} />
              <span className="text-sm font-medium" style={{ color: '#4F46E5' }}>
                Premium Logistics Services
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
              <span className="block" style={{ color: '#1f2937' }}>Explore Our</span>
              <span 
                className="block"
                style={{
                  background: "linear-gradient(90deg, #6366F1, #818CF8, #4F46E5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: '0 4px 30px rgba(129, 140, 248, 0.2)'
                }}
              >
                Delivery Services
              </span>
            </h1>

            <p className="text-lg sm:text-xl max-w-3xl mx-auto px-6 py-4 rounded-xl mb-12"
               style={{
                 color: '#6b7280',
                 backgroundColor: 'rgba(255, 255, 255, 0.7)',
                 backdropFilter: 'blur(10px)',
                 border: '1px solid rgba(224, 231, 255, 0.4)'
               }}>
              Choose from our wide range of premium delivery services tailored to meet your logistics needs. Fast, reliable, and efficient.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        {/* <div className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-xl group"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(224, 231, 255, 0.5)',
                    boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                      style={{
                        backgroundColor: `${stat.color}15`,
                        border: `1px solid ${stat.color}30`
                      }}
                    >
                      <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <div 
                        className="text-2xl font-bold mb-1 transition-all duration-500 group-hover:scale-110"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium" style={{ color: '#6b7280' }}>
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Search and Filter Section */}
        <div className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                    style={{ color: '#818CF8' }}
                  />
                  <input
                    type="text"
                    placeholder="Search for delivery services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderColor: 'rgba(224, 231, 255, 0.5)',
                      color: '#1f2937',
                      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
                      caretColor: '#6366F1'
                    }}
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              {/* <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      selectedFilter === filter.id 
                        ? 'scale-105 shadow-lg' 
                        : 'hover:scale-105 hover:shadow'
                    }`}
                    style={{
                      backgroundColor: selectedFilter === filter.id 
                        ? filter.color 
                        : `${filter.color}15`,
                      color: selectedFilter === filter.id 
                        ? '#FFFFFF' 
                        : filter.color,
                      border: selectedFilter === filter.id 
                        ? 'none' 
                        : `1px solid ${filter.color}30`
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div> */}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {filteredProducts && filteredProducts.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: '#1f2937' }}>
                      Available Services
                      <span className="text-sm font-normal ml-3" style={{ color: '#6b7280' }}>
                        ({filteredProducts.length} services found)
                      </span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" style={{ color: '#6366F1' }} />
                    <span className="text-sm font-medium" style={{ color: '#6b7280' }}>
                      Sorted by Popularity
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                  {filteredProducts.map((item, index) => (
                    <div 
                      key={index}
                      className="transition-all duration-500 hover:scale-[1.02]"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <ThreeDCardDemo product={item} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div 
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
                  style={{
                    backgroundColor: 'rgba(224, 231, 255, 0.2)',
                    border: '2px dashed #818CF8'
                  }}
                >
                  <Package className="h-12 w-12" style={{ color: '#818CF8' }} />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#1f2937' }}>
                  No Services Found
                </h3>
                <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: '#6b7280' }}>
                  We couldn't find any delivery services matching your search. Try different keywords or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedFilter("all");
                  }}
                  className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: '#6366F1',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="p-10 rounded-3xl relative overflow-hidden group"
                 style={{
                   background: 'linear-gradient(135deg, rgba(224, 231, 255, 0.2), rgba(129, 140, 248, 0.1))',
                   border: '1px solid rgba(129, 140, 248, 0.2)',
                   boxShadow: '0 20px 60px -20px rgba(99, 102, 241, 0.15)'
                 }}>
              {/* Animated background */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                   style={{
                     background: 'radial-gradient(circle at center, #818CF8 0%, transparent 70%)',
                     filter: 'blur(40px)'
                   }}></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#1f2937' }}>
                  Need Custom Delivery Solutions?
                </h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#6b7280' }}>
                  Our team can create tailored logistics solutions for your specific business needs. Contact us for a custom quote.
                </p>
                <button
                  className="px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                  style={{
                    backgroundColor: '#6366F1',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                       style={{
                         background: 'linear-gradient(90deg, transparent, #FFFFFF, transparent)',
                         transform: 'translateX(-100%)'
                       }}></div>
                  Contact Sales Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default ProductsPage;