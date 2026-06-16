import React, { useState, useEffect } from 'react';
import { X, Package, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { categoryService, type Category } from '../services/CategoryService';
import productService from '../services/productService';

interface ModifyProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any | null;
  onProductUpdated: () => void;
}

const ModifyProductDialog: React.FC<ModifyProductDialogProps> = ({
  open,
  onOpenChange,
  product,
  onProductUpdated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    warehouseId: '',
    active: true,
    imageUrl: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const roleColor = "#8B5CF6";

  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        quantity: product.quantity?.toString() || '',
        categoryId: product.categoryId?.toString() || '',
        warehouseId: product.warehouseId?.toString() || '',
        active: product.active ?? true,
        imageUrl: product.imageUrl || ''
      });
    }
  }, [product, open]);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;

    try {
      setLoading(true);
      const updatedProduct = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        warehouseId: formData.warehouseId ? parseInt(formData.warehouseId) : null
      };

      await productService.updateProduct(product.id, updatedProduct);
      toast.success('Product updated successfully!');
      onProductUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          border: "1px solid rgba(237, 233, 254, 0.5)",
          boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.1)",
        }}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "rgba(237, 233, 254, 0.5)" }}>
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-full"
              style={{ backgroundColor: `${roleColor}15` }}
            >
              <Package className="h-6 w-6" style={{ color: roleColor }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: "#1f2937" }}>
                Modify Product
              </h2>
              <p className="text-sm" style={{ color: "#6b7280" }}>
                Update product details for {product.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: "#6b7280" }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1f2937" }}>
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid rgba(237, 233, 254, 0.5)",
                  color: "#1f2937",
                }}
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1f2937" }}>
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid rgba(237, 233, 254, 0.5)",
                  color: "#1f2937",
                }}
                placeholder="Enter SKU"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1f2937" }}>
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid rgba(237, 233, 254, 0.5)",
                  color: "#1f2937",
                }}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1f2937" }}>
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid rgba(237, 233, 254, 0.5)",
                  color: "#1f2937",
                }}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1f2937" }}>
                Category
              </label>
              <div className="relative">
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 appearance-none"
                  style={{
                    backgroundColor: "#F9FAFB",
                    border: "1px solid rgba(237, 233, 254, 0.5)",
                    color: "#1f2937",
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categoriesLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin" style={{ color: roleColor }} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1f2937" }}>
                Warehouse ID
              </label>
              <input
                type="number"
                name="warehouseId"
                value={formData.warehouseId}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid rgba(237, 233, 254, 0.5)",
                  color: "#1f2937",
                }}
                placeholder="Enter warehouse ID"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: "#1f2937" }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 resize-none"
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid rgba(237, 233, 254, 0.5)",
                  color: "#1f2937",
                }}
                placeholder="Enter product description"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: "#1f2937" }}>
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid rgba(237, 233, 254, 0.5)",
                  color: "#1f2937",
                }}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="h-5 w-5 rounded"
                style={{ borderColor: roleColor }}
              />
              <label htmlFor="active" className="text-sm font-medium" style={{ color: "#1f2937" }}>
                Active Product
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "rgba(237, 233, 254, 0.5)" }}>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(237, 233, 254, 0.5)",
                color: "#6b7280",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: roleColor,
                color: "#FFFFFF",
                boxShadow: `0 4px 20px ${roleColor}40`,
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyProductDialog;