import React, { useState } from 'react';
import { Package, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { productResponse } from '../types/productTYpes/productResponse';
import orderService from '../services/OrderService';
import { useAuth } from '../context/AuthContext';
import type { CreateOrderRequest } from '../types/orderTypes/orderTypes';

interface ProductItemProps {
  product: productResponse;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const {user} = useAuth()
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };




  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02] relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Shine effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 transition-all duration-1000 ${
          isHovered ? 'translate-x-full' : '-translate-x-full'
        }`}
      />
      
      {/* Glow border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10" />

      {/* Image Container */}
      <div className="relative mb-5 overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 group-hover:border-gray-600 transition-all duration-500">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gradient-to-r from-gray-700 to-gray-800 w-full h-40" />
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-40 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-500">
            <Package className="h-12 w-12 mb-2 opacity-50" />
            <span className="text-sm">Image not available</span>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-60 object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Header */}
      <div className="relative flex items-start justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30 group-hover:border-blue-400/50 transition-all duration-300 group-hover:scale-105">
            <Package className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg truncate max-w-[200px] bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {product.sku}
            </h3>
            <p className="text-gray-400 text-sm font-medium">SKU</p>
          </div>
        </div>
        
        {/* Rating badge */}
        {/**{product.rating && (
          <div className="flex items-center gap-1 bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-700 group-hover:border-gray-600 transition-colors duration-300">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-bold">{product.rating}</span>
          </div>
        )} */}
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-5 line-clamp-2 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
        {product.description}
      </p>

      {/* Details */}
      <div className="space-y-3 mb-6">
        {/* <div className="flex justify-between items-center py-2 px-3 bg-gray-800/50 rounded-lg border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-300"> */}
          {/* <span className="text-gray-400 text-sm font-medium">Quantity</span> */}
         {/** {product.quantity !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-12 bg-gray-700 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                  style={{ 
                    width: `${Math.min((5/ 100) * 100, 100)}%` 
                  }}
                />
              </div>
              <span className="text-white font-bold text-sm min-w-[2rem] text-right">
                {product.quantity}
              </span>
            </div>
          )} */}
        {/* </div> */}

        <div className="flex justify-between items-center py-2 px-3 bg-gray-800/50 rounded-lg border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-300 group-hover:bg-gray-800/70">
          <span className="text-gray-400 text-sm font-medium">Unit Price</span>
          <span className="text-white font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            ${product.price}
          </span>
        </div>

        {product.weightKg !== undefined && (
          <div className="flex justify-between items-center py-2 px-3 bg-gray-800/50 rounded-lg border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-300">
            <span className="text-gray-400 text-sm font-medium">Weight</span>
            <span className="text-white font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {product.weightKg} kg
            </span>
          </div>
        )}
      </div>
    


      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  );
};

export default ProductItem;
