// "use client";
// import React from "react";
// import { CardBody, CardContainer, CardItem } from "./ui/shadcn-io/3d-card";
// import { Link } from "react-router-dom";
// import type { productResponse } from "../types/productTYpes/productResponse";

// interface ThreeDCardDemoProps {
//   product: productResponse;
// }

// export default function ThreeDCardDemo({ product }: ThreeDCardDemoProps) {
//   return (
//     <Link to={`/products/${product.id}`} className="block">
//       <CardContainer className="inter-var" containerClassName="py-4">
//         <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[24rem] h-auto rounded-xl p-4 border">
//           {/* Product Name */}
//           <CardItem
//             translateZ="50"
//             className="text-xl font-bold text-neutral-600 dark:text-white truncate"
//           >
//             {product.name || product.sku}
//           </CardItem>

//           {/* Product Description */}
//           <CardItem
//             as="p"
//             translateZ="60"
//             className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300 line-clamp-2"
//           >
//             {product.description}
//           </CardItem>

//           {/* Product Image */}
//           <CardItem translateZ="100" className="w-full mt-4">
//             <img
//               loading="lazy"
//               src={product.imageUrl}
//               height="1000"
//               width="1000"
//               className="h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
//               alt={product.name}
//               onError={(e) => {
//                 // Fallback image on error
//                 e.currentTarget.src =
//                   "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
//               }}
//             />
//           </CardItem>

//           {/* Product Details */}
//           <div className="mt-6 space-y-3">
//             {/* SKU */}
//             <CardItem
//               translateZ="40"
//               className="text-neutral-500 text-sm dark:text-neutral-400"
//             >
//               <span className="font-medium">SKU:</span> {product.sku}
//             </CardItem>

//             {/* Price */}
//             <CardItem
//               translateZ="40"
//               className="text-neutral-700 dark:text-neutral-300 text-lg font-bold"
//             >
//               ${product.price}
//             </CardItem>

//             {/* Weight (if available) */}
//             {product.weightKg !== undefined && (
//               <CardItem
//                 translateZ="40"
//                 className="text-neutral-500 text-sm dark:text-neutral-400"
//               >
//                 <span className="font-medium">Weight:</span> {product.weightKg}{" "}
//                 kg
//               </CardItem>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-between items-center mt-8">
//             <CardItem
//               translateZ={20}
//               as="button"
//               className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//               onClick={(e: { preventDefault: () => void }) => {
//                 e.preventDefault();
//                 // Handle view details or other action
//                 console.log("View details for:", product.id);
//               }}
//             >
//               <Link to={`/products/${product.id}`}>View Details →</Link>
//             </CardItem>

//             <CardItem
//               translateZ={20}
//               as="button"
//               className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
//               onClick={(e: { preventDefault: () => void }) => {
//                 e.preventDefault();
//                 // Handle buy/order action
//                 console.log("Buy product:", product.id);
//               }}
//             >
//               <Link to={`/products/${product.id}`}>Buy Now</Link>
//             </CardItem>
//           </div>
//         </CardBody>
//       </CardContainer>
//     </Link>
//   );
// }


"use client";
import { CardBody, CardContainer, CardItem } from "./ui/shadcn-io/3d-card";
import { Link } from "react-router-dom";
import { Package, Truck, Weight } from "lucide-react";
import type { ProductResponse } from "../types/productTYpes/productResponse";

interface ThreeDCardDemoProps {
  product: ProductResponse;
}

export default function ThreeDCardDemo({ product }: ThreeDCardDemoProps) {
  return (
    <Link onClick={()=>window.scrollTo(0,0)} to={`/products/${product.id}`} className="block w-full h-full">
      <CardContainer className="inter-var w-full h-full">
        <CardBody
          className="
    relative group/card 
    w-full h-full 
    min-h-[420px] md:min-h-[460px] 
    rounded-xl 
    p-4 md:p-6 
    border 
    bg-white/95 
    border-indigo-100/50 
    shadow-[0_4px_20px_rgba(99,102,241,0.1)] 
    transition-all duration-300 
    hover:shadow-xl
  "
        >
          {/* Product Name */}
          <CardItem
            translateZ="50"
            className="text-lg md:text-xl font-bold  line-clamp-1 mb-2 md:mb-3 transition-colors group-hover/card:text-[#4F46E5]"
            style={{ color: "#1f2937" }}
          >
            {product.name || product.sku}
          </CardItem>

          {/* Product Description */}
          {/* <CardItem
            as="p"
            translateZ="60"
            className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-2 line-clamp-2 md:line-clamp-3 mb-4 md:mb-6"
          >
            {product.description}
          </CardItem> */}

          {/* Product Image */}
          <CardItem translateZ="100" className="w-full">
            <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-lg md:rounded-xl">
              <img
                loading="lazy"
                src={product.imageUrl ?? "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
            </div>
          </CardItem>

          {/* Product Details - Responsive Grid */}
          <div className="mt-4 md:mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {/* SKU */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="p-1.5 rounded-md"
                  style={{ backgroundColor: "rgba(129, 140, 248, 0.1)" }}
                >
                  <Package
                    className="w-3 h-3 md:w-4 md:h-4"
                    style={{ color: "#818CF8" }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500">SKU</span>
              </div>
              <span
                className="text-sm font-semibold truncate"
                style={{ color: "#374151" }}
              >
                {product.sku}
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="p-1.5 rounded-md"
                  style={{ backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                >
                  <span
                    className="text-xs md:text-sm font-bold"
                    style={{ color: "#6366F1" }}
                  >
                    $
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-500">Price</span>
              </div>
              <span
                className="text-lg md:text-xl font-bold transition-transform duration-300 group-hover/card:scale-105"
                style={{ color: "#6366F1" }}
              >
                ${product.price}
              </span>
            </div>

            {/* Weight or Delivery */}
            <div className="flex flex-col col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="p-1.5 rounded-md"
                  style={{ backgroundColor: "rgba(79, 70, 229, 0.1)" }}
                >
                  {product.weightKg !== undefined ? (
                    <Weight
                      className="w-3 h-3 md:w-4 md:h-4"
                      style={{ color: "#4F46E5" }}
                    />
                  ) : (
                    <Truck
                      className="w-3 h-3 md:w-4 md:h-4"
                      style={{ color: "#4F46E5" }}
                    />
                  )}
                </div>
                <span className="text-xs font-medium text-gray-500">
                  {product.weightKg !== undefined ? "Weight" : "Delivery"}
                </span>
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: "#374151" }}
              >
                {product.weightKg !== undefined
                  ? `${product.weightKg} kg`
                  : "24h"}
              </span>
            </div>
          </div>

          {/* Additional Info for Mobile */}
          <div className="mt-4 md:hidden">
            {product.weightKg !== undefined && product.weightKg !== null && product.weightKg > 10 && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Truck className="w-3 h-3" style={{ color: "#6366F1" }} />
                <span>Standard Delivery: 2-3 days</span>
              </div>
            )}
          </div>

          {/* Action Buttons - Responsive Layout */}
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            {/* View Details Button */}
            <CardItem
              translateZ={20}
              as="button"
              className="flex-1 px-4 py-3 rounded-lg md:rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 group/btn flex items-center justify-center gap-2"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(224, 231, 255, 0.8)",
                color: "#6366F1",
              }}
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                console.log("View details for:", product.id);
              }}
            >
              <span>View Details</span>
              <span className="group-hover/btn:translate-x-1 transition-transform">
                →
              </span>
            </CardItem>

            {/* Buy Now Button */}
            <CardItem
              translateZ={20}
              as="button"
              className="flex-1 px-4 py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-300 hover:scale-105 group/btn flex items-center justify-center gap-2 relative overflow-hidden"
              style={{
                backgroundColor: "#6366F1",
                color: "#FFFFFF",
              }}
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                console.log("Buy product:", product.id);
              }}
            >
              {/* Shimmer effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover/btn:opacity-30 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #FFFFFF, transparent)",
                  transform: "translateX(-100%)",
                }}
              ></div>

              <Link to={`/products/${product.id}`} onClick={()=>window.scrollTo(0,0)}  className="relative z-10">Buy Now →</Link>
              <span className="relative z-10 group-hover/btn:scale-110 transition-transform">
                ✓
              </span>
            </CardItem>
          </div>

          {/* Hover Indicator for Desktop */}
          <div
            className="hidden md:block absolute -right-2 -top-2 w-4 h-4 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
            style={{
              backgroundColor: "#818CF8",
              filter: "blur(8px)",
            }}
          ></div>

          {/* Mobile Touch Indicator */}
          <div className="md:hidden absolute inset-0 rounded-xl border-2 border-transparent group-active/card:border-[#818CF8] transition-all duration-200"></div>
        </CardBody>
      </CardContainer>
    </Link>
  );
}

