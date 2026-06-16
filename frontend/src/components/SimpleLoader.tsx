import { Loader2 } from "lucide-react";
import React from "react";

type SimpleLoaderProps = {
  size?: string;
};

const SimpleLoader: React.FC<SimpleLoaderProps> = ({ size }) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        className={`${size === "small" ? "h-2 w-2" : "h-7 w-7"} animate-spin`}
        style={{ color: "#6366F1" }}
      />
    </div>
  );
};

export default SimpleLoader;
