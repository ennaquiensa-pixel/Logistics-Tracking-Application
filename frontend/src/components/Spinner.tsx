import React from "react";

export type SpinnerSize = "sm" | "md" | "lg" | "xl";
export type SpinnerColor = "white" | "blue" | "gray" | "indigo" | "pink" | "custom";

export interface SpinnerProps {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Color of the spinner */
  color?: SpinnerColor;
  /** Custom color (hex, rgb, etc) - only used when color="custom" */
  customColor?: string;
  /** Background color of the static ring */
  bgColor?: "gray-800" | "gray-600" | "gray-400" | "transparent";
  /** Additional CSS classes */
  className?: string;
  /** Show loading text */
  withText?: boolean;
  /** Custom loading text */
  text?: string;
  /** Full screen centering */
  fullScreen?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "white",
  customColor,
  bgColor = "gray-800",
  className = "",
  withText = false,
  text = "Loading...",
  fullScreen = false
}) => {
  // Size mappings
  const sizeMap = {
    sm: { container: "w-12 h-12", border: "border-2", text: "text-sm" },
    md: { container: "w-16 h-16", border: "border-4", text: "text-base" },
    lg: { container: "w-20 h-20", border: "border-6", text: "text-lg" },
    xl: { container: "w-24 h-24", border: "border-8", text: "text-xl" }
  };

  // Color mappings
  const colorMap = {
    white: "border-white",
    blue: "border-blue-500",
    gray: "border-gray-400",
    indigo: "border-indigo-500",
    pink: "border-pink-500",
    custom: customColor ? "" : "border-white" // fallback
  };

  const currentSize = sizeMap[size];
  const borderColorClass = color === "custom" ? "" : colorMap[color];
  const bgColorClass = `border-${bgColor}`;

  // Inline style for custom color
  const customStyle = color === "custom" && customColor ? {
    borderColor: customColor,
    borderTopColor: 'transparent'
  } : {};

  const spinnerContent = (
    <div className={`relative ${className}`}>
      {/* Static background ring */}
      <div 
        className={`${currentSize.container} ${currentSize.border} ${bgColorClass} rounded-full`}
      />
      
      {/* Spinning ring */}
      <div 
        className={`${currentSize.container} ${currentSize.border} ${borderColorClass} border-t-transparent rounded-full animate-spin absolute top-0 left-0`}
        style={customStyle}
      />
      
      {/* Optional text */}
      {withText && (
        <div className={`mt-4 ${currentSize.text} text-center text-${color === "custom" ? "white" : color}`}>
          {text}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex justify-center items-center h-screen">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default Spinner;