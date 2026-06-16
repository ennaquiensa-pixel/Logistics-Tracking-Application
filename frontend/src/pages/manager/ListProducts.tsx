import React, { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  ShoppingBag,
  Tag,
  Warehouse,
  Scale,
  DollarSign,
  Layers,
  Building,
} from "lucide-react";
import type { ProductResponse } from "../../types/productTYpes/productResponse";
import productService from "../../services/productService";
import AddProductDialog from "../../components/AddProductDialog";
import { toast } from "react-toastify";
import { categoryService, type Category } from "../../services/CategoryService";
import ModifyProductDialog from "../../components/ModifyProductDialog";
import SimpleLoader from "../../components/SimpleLoader"; // Import SimpleLoader
import { getFromCache, saveToCache } from "../../utils/cache";

const ListProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductResponse[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  // Loading states
  const [loading, setLoading] = useState({
    products: true,
    categories: false,
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null); // For individual delete actions

  const PRODUCTS_CACHE_KEY = "products_list";
const CATEGORIES_CACHE_KEY = "categories_list";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  const roleColor = "#8B5CF6";

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, selectedWarehouse, products]);

  // const fetchProducts = async () => {
  //   try {
  //     setLoading(prev => ({ ...prev, products: true }));
  //     const data = await productService.getAllProducts();
  //     setProducts(data);
  //     setFilteredProducts(data);
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //     toast.error("Failed to load products");
  //     setProducts([]);
  //     setFilteredProducts([]);
  //   } finally {
  //     setLoading(prev => ({ ...prev, products: false }));
  //   }
  // };

  const fetchProducts = async () => {
  try {
    setLoading(prev => ({ ...prev, products: true }));

    const cachedProducts = getFromCache<ProductResponse[]>(
      PRODUCTS_CACHE_KEY,
      CACHE_TTL
    );

    if (cachedProducts) {
      setProducts(cachedProducts);
      setFilteredProducts(cachedProducts);
      return;
    }

    const data = await productService.getAllProducts();
    setProducts(data);
    setFilteredProducts(data);

    saveToCache(PRODUCTS_CACHE_KEY, data);

  } catch (error) {
    console.error("Error fetching products:", error);
    toast.error("Failed to load products");
    setProducts([]);
    setFilteredProducts([]);
  } finally {
    setLoading(prev => ({ ...prev, products: false }));
  }
};


  // const fetchCategories = async () => {
  //   try {
  //     setLoading(prev => ({ ...prev, categories: true }));
  //     const data = await categoryService.getAllCategories();
  //     setCategories(data);
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //     setCategories([]);
  //   } finally {
  //     setLoading(prev => ({ ...prev, categories: false }));
  //   }
  // };
  const fetchCategories = async () => {
  try {
    setLoading(prev => ({ ...prev, categories: true }));

    const cachedCategories = getFromCache<Category[]>(
      CATEGORIES_CACHE_KEY,
      CACHE_TTL
    );

    if (cachedCategories) {
      setCategories(cachedCategories);
      return;
    }

    const data = await categoryService.getAllCategories();
    setCategories(data);

    saveToCache(CATEGORIES_CACHE_KEY, data);

  } catch (error) {
    console.error("Error fetching categories:", error);
    setCategories([]);
  } finally {
    setLoading(prev => ({ ...prev, categories: false }));
  }
};


  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.categoryId?.toString() === selectedCategory
      );
    }

    if (selectedWarehouse !== "all") {
      filtered = filtered.filter(
        (product) => product.warehouseId?.toString() === selectedWarehouse
      );
    }

    setFilteredProducts(filtered);
  };

  const handleEditClick = (product: ProductResponse) => {
    setSelectedProduct(product);
    setModifyDialogOpen(true);
    localStorage.removeItem(PRODUCTS_CACHE_KEY);

  };

  // Get category name by ID
  const getCategoryName = (categoryId: number | null | undefined): string => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : `Category ${categoryId}`;
  };

  // Get category description by ID
  const getCategoryDescription = (
    categoryId: number | null | undefined
  ): string => {
    if (!categoryId) return "No category assigned";
    const category = categories.find((c) => c.id === categoryId);
    return category?.description || "";
  };

  const handleDelete = async (id: number) => {
    try {
      setActionLoading(id);
      await productService.deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
      setDeleteConfirm(null);
      localStorage.removeItem(PRODUCTS_CACHE_KEY);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (active: boolean) => {
    if (active) {
      return (
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{ backgroundColor: "#D1FAE5", color: "#059669" }}
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </span>
      );
    }
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
      >
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </span>
    );
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return {
        text: "Out of Stock",
        color: "#DC2626",
        bgColor: "#FEE2E2",
        icon: "✗",
      };
    } else if (quantity <= 10) {
      return {
        text: "Low Stock",
        color: "#D97706",
        bgColor: "#FEF3C7",
        icon: "⚠",
      };
    } else {
      return {
        text: "In Stock",
        color: "#059669",
        bgColor: "#D1FAE5",
        icon: "✓",
      };
    }
  };

  // Prepare categories for dropdown
  const categoryOptions = [
    { id: "all", name: "All Categories" },
    ...categories.map((category) => ({
      id: category.id.toString(),
      name: category.name,
      description: category.description,
    })),
  ];

  const warehouses = [
    { id: "all", name: "All Warehouses" },
    ...Array.from(new Set(products.map((p) => p.warehouseId)))
      .filter((id) => id)
      .map((id) => ({
        id: id!.toString(),
        name: `Warehouse ${id}`,
      })),
  ];

  // Main loading state for entire page
  // if (loading.products && products.length === 0) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <SimpleLoader />
  //         <p className="mt-4 text-gray-600">Loading products...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EDE9FE]/5 via-white to-[#8B5CF6]/5"></div>
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.random() * 40 + 10 + "px",
              height: Math.random() * 40 + 10 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              background: `radial-gradient(circle, ${
                ["#EDE9FE", "#8B5CF6", "#A78BFA"][i % 3]
              } 0%, transparent 70%)`,
              opacity: 0.1,
              filter: "blur(15px)",
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
              style={{
                backgroundColor: `${roleColor}15`,
                color: roleColor,
              }}
            >
              <ShoppingBag className="h-3 w-3" />
              <span>Product Management</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
              style={{ color: "#1f2937" }}
            >
              Product Inventory
            </h1>
            <p className="text-lg" style={{ color: "#6b7280" }}>
              Manage and track all products in your inventory
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: roleColor,
                color: "#FFFFFF",
                boxShadow: `0 4px 20px ${roleColor}40`,
              }}
              onClick={() => {setAddDialogOpen(true) ; localStorage.removeItem(PRODUCTS_CACHE_KEY);}}
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div
          className="bg-white rounded-2xl p-6 mb-8"
          style={{
            border: "1px solid rgba(237, 233, 254, 0.5)",
            boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.1)",
          }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                style={{ color: "#9CA3AF" }}
              />
              <input
                type="text"
                placeholder="Search products by name, SKU, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid rgba(237, 233, 254, 0.5)",
                  color: "#1f2937",
                }}
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 pl-10"
                  style={{
                    backgroundColor: "#F9FAFB",
                    border: "1px solid rgba(237, 233, 254, 0.5)",
                    color: "#1f2937",
                    minWidth: "180px",
                  }}
                  disabled={loading.categories}
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Layers
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: "#9CA3AF" }}
                />
                {loading.categories && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <SimpleLoader size="small" />
                  </div>
                )}
              </div>

              <div className="relative">
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 pl-10"
                  style={{
                    backgroundColor: "#F9FAFB",
                    border: "1px solid rgba(237, 233, 254, 0.5)",
                    color: "#1f2937",
                    minWidth: "180px",
                  }}
                >
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name}
                    </option>
                  ))}
                </select>
                <Building
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: "#9CA3AF" }}
                />
              </div>

              <button
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: roleColor,
                  color: "#FFFFFF",
                  boxShadow: `0 4px 20px ${roleColor}40`,
                }}
                onClick={fetchProducts}
                disabled={loading.products}
              >
                {loading.products ? (
                  <>
                    <SimpleLoader size="small" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(237, 233, 254, 0.5)",
            boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.1)",
          }}
        >
          <div
            className="flex justify-between items-center p-6 border-b"
            style={{ borderColor: "rgba(237, 233, 254, 0.5)" }}
          >
            <div>
              <h2 className="text-lg font-bold" style={{ color: "#1f2937" }}>
                Products ({filteredProducts.length})
              </h2>
              {loading.products ? (
                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                  <SimpleLoader size="small" /> Loading products...
                </p>
              ) : categories.length > 0 ? (
                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                  Showing products across {categories.length} categories
                </p>
              ) : (
                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                  No categories loaded
                </p>
              )}
            </div>
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: "#9CA3AF" }}
            >
              <Filter className="h-4 w-4" />
              <span>Sorted by: Latest Added</span>
            </div>
          </div>

          {loading.products && products.length === 0 ? (
            <div className="p-12 text-center">
              <SimpleLoader />
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package
                className="h-16 w-16 mx-auto mb-4"
                style={{ color: "#9CA3AF" }}
              />
              <h3
                className="text-lg font-medium mb-2"
                style={{ color: "#6b7280" }}
              >
                No products found
              </h3>
              <p style={{ color: "#9CA3AF" }}>
                {searchTerm || selectedCategory !== "all" || selectedWarehouse !== "all"
                  ? "Try adjusting your search or filters"
                  : "No products available. Add your first product!"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "#F9FAFB" }}>
                    <th
                      className="text-left p-4 font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      Product
                    </th>
                    <th
                      className="text-left p-4 font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      SKU
                    </th>
                    <th
                      className="text-left p-4 font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      Price
                    </th>
                    <th
                      className="text-left p-4 font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      Stock
                    </th>
                    <th
                      className="text-left p-4 font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      Category
                    </th>
                    <th
                      className="text-left p-4 font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      Warehouse
                    </th>
                    <th
                      className="text-left p-4 font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      Status
                    </th>
                    <th
                      className="text-left p-4 font-medium"
                      style={{ color: "#6b7280" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.quantity);
                    const categoryName = getCategoryName(product.categoryId);
                    const categoryDescription = getCategoryDescription(
                      product.categoryId
                    );

                    return (
                      <tr
                        key={product.id}
                        className="border-b hover:scale-[1.005] transition-all duration-300 group"
                        style={{ borderColor: "rgba(237, 233, 254, 0.5)" }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://via.placeholder.com/48x48?text=No+Image";
                                }}
                              />
                            ) : (
                              <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${roleColor}15` }}
                              >
                                <Package
                                  className="h-6 w-6"
                                  style={{ color: roleColor }}
                                />
                              </div>
                            )}
                            <div>
                              <h3
                                className="font-medium group-hover:text-[#8B5CF6] transition-colors duration-300"
                                style={{ color: "#1f2937" }}
                              >
                                {product.name}
                              </h3>
                              <p
                                className="text-sm line-clamp-1"
                                style={{ color: "#6b7280" }}
                              >
                                {product.description || "No description"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Tag
                              className="h-4 w-4"
                              style={{ color: "#9CA3AF" }}
                            />
                            <code
                              className="text-sm font-medium px-2 py-1 rounded bg-gray-100"
                              style={{ color: "#1f2937" }}
                            >
                              {product.sku}
                            </code>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <DollarSign
                              className="h-4 w-4"
                              style={{ color: "#9CA3AF" }}
                            />
                            <span
                              className="font-bold"
                              style={{ color: "#1f2937" }}
                            >
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: stockStatus.color }}
                              />
                              <span
                                className="font-medium"
                                style={{ color: stockStatus.color }}
                              >
                                {product.quantity} units
                              </span>
                            </div>
                            <span
                              className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                              style={{
                                backgroundColor: stockStatus.bgColor,
                                color: stockStatus.color,
                              }}
                            >
                              <span>{stockStatus.icon}</span>
                              <span>{stockStatus.text}</span>
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-start gap-2">
                            <div className="mt-1">
                              <Layers
                                className="h-4 w-4"
                                style={{ color: "#9CA3AF" }}
                              />
                            </div>
                            <div>
                              <span
                                className="font-medium block"
                                style={{ color: "#1f2937" }}
                              >
                                {categoryName}
                              </span>
                              {categoryDescription && (
                                <span
                                  className="text-xs block mt-1"
                                  style={{ color: "#6b7280" }}
                                >
                                  {categoryDescription}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Warehouse
                              className="h-4 w-4"
                              style={{ color: "#9CA3AF" }}
                            />
                            <span style={{ color: "#6b7280" }}>
                              {product.warehouseId
                                ? `Warehouse ${product.warehouseId}`
                                : "No Warehouse"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(product.active)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                              style={{
                                backgroundColor: `${roleColor}15`,
                                color: roleColor,
                              }}
                              title="View Details"
                              onClick={() => {
                                // Add view details functionality
                                window.location.href = `/products/${product.id}`;
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                              style={{
                                backgroundColor: "#FEF3C7",
                                color: "#D97706",
                              }}
                              title="Edit Product"
                              onClick={() => handleEditClick(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 rounded-lg transition-all duration-300 hover:scale-110 relative"
                              style={{
                                backgroundColor: "#FEE2E2",
                                color: "#DC2626",
                              }}
                              title="Delete Product"
                              onClick={() => setDeleteConfirm(product.id!)}
                              disabled={actionLoading === product.id}
                            >
                              {actionLoading === product.id ? (
                                <SimpleLoader size="small" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            style={{
              border: "1px solid rgba(237, 233, 254, 0.5)",
              boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.1)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: "#FEE2E2" }}
              >
                <AlertCircle className="h-6 w-6" style={{ color: "#DC2626" }} />
              </div>
              <h3 className="text-lg font-bold" style={{ color: "#1f2937" }}>
                Confirm Delete
              </h3>
            </div>
            <p className="mb-6" style={{ color: "#6b7280" }}>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(237, 233, 254, 0.5)",
                  color: "#6b7280",
                }}
                disabled={actionLoading === deleteConfirm}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                style={{
                  backgroundColor: "#DC2626",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 20px rgba(220, 38, 38, 0.2)",
                }}
                disabled={actionLoading === deleteConfirm}
              >
                {actionLoading === deleteConfirm ? (
                  <>
                    <SimpleLoader size="small" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete Product"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ModifyProductDialog
        open={modifyDialogOpen}
        onOpenChange={setModifyDialogOpen}
        product={selectedProduct}
        onProductUpdated={() => {
          fetchProducts(); // Refresh the product list
        }}
      />

      <AddProductDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onProductAdded={() => {
          fetchProducts(); // Refresh the product list
        }}
      />
    </div>
  );
};

export default ListProducts;