// components/products/AddProductDialog.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Package,
  Image as ImageIcon,
  Tag,
  Scale,
  DollarSign,
  Hash,
  FileText,
  Box,
  X,
  Upload,
  Warehouse as WarehouseIcon,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import type { CreateProductRequest } from "../types/productTYpes/productResponse";
import productService from "../services/productService";
import type { WareHouseResponse } from "../types/warehouseType/WarehouseResponse";
import { Button } from "./ui/button";
import { wareHouseService } from "../services/WareHouseService";
import { categoryService, type Category } from "../services/CategoryService";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({
  open,
  onOpenChange,
  onProductAdded,
}) => {
  const [formData, setFormData] = useState<CreateProductRequest>({
    sku: "",
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    weightKg: undefined,
    imageUrl: "",
    categoryId: undefined, // This is now required
    warehouseId: undefined,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<WareHouseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Reset form and fetch data when dialog opens
  useEffect(() => {
    if (open) {
      resetForm();
      fetchCategories();
      fetchWarehouses();
    }
  }, [open]);

  // Update image preview when imageUrl changes
  useEffect(() => {
    if (formData.imageUrl) {
      setImagePreview(formData.imageUrl);
    } else {
      setImagePreview("");
    }
  }, [formData.imageUrl]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      
      if (data.length === 0) {
        toast.warning(
          "No categories found. Please create categories before adding products.",
          { autoClose: 5000 }
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories. Please try again.");
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      setLoadingWarehouses(true);
      const data = await wareHouseService.getAllWareHouses();
      setWarehouses(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      toast.error("Failed to load warehouses");
      setWarehouses([]);
    } finally {
      setLoadingWarehouses(false);
    }
  };

  const resetForm = () => {
    setFormData({
      sku: "",
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      weightKg: undefined,
      imageUrl: "",
      categoryId: undefined,
      warehouseId: undefined,
    });
    setImagePreview("");
  };

  const generateSKU = () => {
    const prefix = "PROD";
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const timestamp = Date.now().toString().slice(-6);
    const sku = `${prefix}-${random}-${timestamp}`;
    
    setFormData((prev) => ({ ...prev, sku }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "price" || name === "quantity") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    } else if (name === "weightKg") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : parseFloat(value),
      }));
    } else if (name === "categoryId" || name === "warehouseId") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : parseInt(value),
      }));
    } else if (name === "name") {
      // Auto-generate SKU prefix based on product name
      const cleanName = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
      const prefix = cleanName.length > 0 ? cleanName : "PROD";
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
      const timestamp = Date.now().toString().slice(-4);
      const newSku = `${prefix}-${random}-${timestamp}`;
      
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value,
        sku: newSku 
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.sku.trim()) {
      toast.error("SKU is required");
      return false;
    }

    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (!formData.price || formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return false;
    }

    if (formData.quantity < 0) {
      toast.error("Quantity cannot be negative");
      return false;
    }

    // Category is now required
    if (!formData.categoryId || formData.categoryId <= 0) {
      toast.error("Please select a category");
      return false;
    }

    // Weight validation (optional)
    if (
      formData.weightKg !== undefined &&
      formData.weightKg !== null &&
      formData.weightKg < 0
    ) {
      toast.error("Weight cannot be negative");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const productData: CreateProductRequest = {
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        price: formData.price,
        quantity: formData.quantity,
        weightKg: formData.weightKg || undefined,
        imageUrl: formData.imageUrl?.trim() || "",
        categoryId: formData.categoryId, // Required
        warehouseId: formData.warehouseId || undefined,
      };

      await productService.createProduct(productData);
      toast.success("Product created successfully!");

      resetForm();
      onOpenChange(false);
      onProductAdded();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create product";
      toast.error(errorMessage);
      console.error("Product creation error:", error);
      
      // If error mentions category, refresh categories
      if (errorMessage.includes("Category") || errorMessage.includes("category")) {
        toast.info("Refreshing category list...");
        fetchCategories();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleImageUrlTest = () => {
    if (formData.imageUrl) {
      setImagePreview(formData.imageUrl);
      toast.info("Image preview updated");
    }
  };

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setImagePreview("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Create New Product
          </DialogTitle>
          <DialogDescription>
            Fill in the product details below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name and SKU Display */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Wireless Bluetooth Headphones"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    SKU will be auto-generated based on product name
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2 flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    Auto-generated SKU
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-2 border border-gray-300 bg-gray-50 rounded-md font-mono text-sm">
                      {formData.sku || "Generating SKU..."}
                    </div>
                    <Button
                      type="button"
                      onClick={generateSKU}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Format: PREFIX-RANDOM-TIMESTAMP
                  </p>
                </div>
              </div>

              {/* Image URL and Preview */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2 flex items-center gap-2">
                    <ImageIcon className="h-3 w-3" />
                    Product Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl ?? ""}
                      onChange={handleInputChange}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      type="button"
                      onClick={handleImageUrlTest}
                      variant="outline"
                      disabled={!formData.imageUrl}
                      size="sm"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    {formData.imageUrl && (
                      <Button
                        type="button"
                        onClick={clearImage}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {imagePreview && (
                  <div className="border rounded-md p-2">
                    <label className="text-xs font-medium block mb-2">
                      Image Preview:
                    </label>
                    <div className="flex items-center justify-center h-32 bg-gray-50 rounded-md overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "";
                          toast.error("Failed to load image from URL");
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Price (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  name="quantity"
                  value={formData.quantity || ""}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2 flex items-center gap-2">
                  <Scale className="h-3 w-3" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="weightKg"
                  value={formData.weightKg || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 0.5"
                />
              </div>
            </div>
          </div>

          {/* Category & Warehouse */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Box className="h-4 w-4" />
              Category & Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium block mb-2 flex items-center gap-2">
                  Category *
                  {loadingCategories && (
                    <span className="text-xs text-gray-500 ml-2">Loading...</span>
                  )}
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId || ""}
                  onChange={handleInputChange}
                  required
                  disabled={loadingCategories || categories.length === 0}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {!loadingCategories && categories.length === 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded-md">
                    <div className="flex items-center gap-2 text-sm text-yellow-700">
                      <AlertCircle className="h-4 w-4" />
                      <span>No categories available. Please create categories first.</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium block mb-2 flex items-center gap-2">
                  <WarehouseIcon className="h-4 w-4" />
                  Warehouse
                  {loadingWarehouses && (
                    <span className="text-xs text-gray-500 ml-2">
                      Loading...
                    </span>
                  )}
                </label>
                <select
                  name="warehouseId"
                  value={formData.warehouseId || ""}
                  onChange={handleInputChange}
                  disabled={loadingWarehouses}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">-- Select Warehouse --</option>
                  {warehouses.map((warehouse) => (
                    <option
                      key={warehouse.idEntrepot}
                      value={warehouse.idEntrepot}
                    >
                      {warehouse.nom} ({warehouse.code}) -{" "}
                      {warehouse.adresse.ville}
                    </option>
                  ))}
                </select>

                {!loadingWarehouses && warehouses.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No warehouses available. Warehouse selection is optional.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </h3>

            <div>
              <label className="text-sm font-medium block mb-2">
                Product Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe the product features, specifications, and benefits..."
              />
              <p className="text-xs text-gray-500 mt-1">
                You can use HTML or Markdown formatting for rich text.
              </p>
            </div>
          </div>

          {/* Product Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">Product Summary</h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-md border">
                <div className="text-sm text-gray-600">SKU</div>
                <div className="font-mono font-medium truncate">
                  {formData.sku || "Generating..."}
                </div>
              </div>

              <div className="text-center p-3 bg-white rounded-md border">
                <div className="text-sm text-gray-600">Price</div>
                <div className="font-medium">
                  ${formData.price ? formData.price.toFixed(2) : "0.00"}
                </div>
              </div>

              <div className="text-center p-3 bg-white rounded-md border">
                <div className="text-sm text-gray-600">Category</div>
                <div className="font-medium">
                  {formData.categoryId 
                    ? categories.find(c => c.id === formData.categoryId)?.name || "Selected"
                    : "Not selected"}
                </div>
              </div>

              <div className="text-center p-3 bg-white rounded-md border">
                <div className="text-sm text-gray-600">Status</div>
                <div className="font-medium text-green-600">
                  {formData.quantity > 0 ? "Active" : "Out of Stock"}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading || loadingCategories || loadingWarehouses}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || loadingCategories || categories.length === 0}
              className="px-6"
              style={{
                backgroundColor: categories.length === 0 ? "#9CA3AF" : "#8B5CF6",
                color: "#FFFFFF",
                boxShadow: categories.length === 0 ? "none" : "0 4px 20px rgba(139, 92, 246, 0.2)",
                cursor: categories.length === 0 ? "not-allowed" : "pointer"
              }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Product...
                </>
              ) : categories.length === 0 ? (
                "No Categories Available"
              ) : (
                "Create Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;