import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/lib/types";
import { 
  Plus, Edit, Trash2, Save, X, Upload, Copy, CheckSquare, Square,
  Star, TrendingUp, Package, Eye, EyeOff, Sparkles, Zap,
  ShoppingBag, Award, Tag, Image as ImageIcon, AlertCircle, Gamepad2
} from "lucide-react";
import { createProduct, updateProduct, deleteProduct, duplicateProduct, bulkProductAction } from "@/lib/adminService";
import { uploadImage } from "@/lib/uploadService";
import { gamesAPI } from "@/lib/api";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ProductsTabProps {
  products: Product[];
  onProductsChange?: () => void;
}

export default function ProductsTab({ products, onProductsChange }: ProductsTabProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  console.log("=== ProductsTab Rendered ===");
  console.log("Products prop:", products);
  console.log("Products length:", products?.length || 0);
  console.log("Products is array:", Array.isArray(products));
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [useDirectUrl, setUseDirectUrl] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [games, setGames] = useState<any[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    nameBn: "",
    diamonds: 0,
    price: 0,
    category: "budget",
    rating: 4.5,
    image: "",
    badge: "",
    isMembership: false,
    isFeatured: false,
    isActive: true,
    stockStatus: "in_stock",
    description: "",
    descriptionBn: "",
    gameId: "",
  });

  // Fetch games on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await gamesAPI.getAll();
        console.log("Fetched games:", gamesData);
        setGames(gamesData || []);
        
        // Set default game if available
        if (gamesData && gamesData.length > 0 && !formData.gameId) {
          setFormData((prev: any) => ({ ...prev, gameId: gamesData[0].id }));
        }
      } catch (error) {
        console.error("Error fetching games:", error);
        toast.error("Failed to load games");
      }
    };
    
    fetchGames();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== PRODUCT SUBMIT START ===");
    console.log("Form Data:", formData);
    
    if (!formData.name || !formData.nameBn || !formData.price) {
      toast.error("Please fill all required fields");
      console.error("Missing required fields:", {
        name: formData.name,
        nameBn: formData.nameBn,
        price: formData.price
      });
      return;
    }

    if (!formData.gameId) {
      toast.error("Please select a game");
      console.error("Missing gameId");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload a product image");
      console.error("Missing image");
      return;
    }

    try {
      console.log("Submitting product...");
      
      if (editingId) {
        console.log("Updating product:", editingId);
        await updateProduct(editingId, formData);
        toast.success("Product updated successfully!");
        setEditingId(null);
      } else {
        console.log("Creating new product");
        // Ensure isActive is true for new products
        const productData = {
          ...formData,
          isActive: formData.isActive !== false ? true : formData.isActive
        };
        console.log("Product data with isActive:", productData);
        const result = await createProduct(productData);
        console.log("Product created:", result);
        toast.success("Product added successfully!");
        setIsAdding(false);
      }
      
      setFormData({
        name: "",
        nameBn: "",
        diamonds: 0,
        price: 0,
        category: "budget",
        rating: 4.5,
        image: "",
        badge: "",
        isMembership: false,
        isFeatured: false,
        isActive: true,
        stockStatus: "in_stock",
        description: "",
        descriptionBn: "",
        gameId: games.length > 0 ? games[0].id : "",
      });
      setImagePreview("");
      
      console.log("Calling onProductsChange...");
      // Call parent to refresh products
      if (onProductsChange) {
        onProductsChange();
      } else {
        // Fallback to reload if no callback provided
        window.location.reload();
      }
      
      console.log("=== PRODUCT SUBMIT SUCCESS ===");
    } catch (error: any) {
      console.error("=== PRODUCT SUBMIT ERROR ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      toast.error(error.message || "Failed to save product");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("=== IMAGE UPLOAD START ===");
    console.log("File selected:", file.name, file.type, file.size);

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only images allowed (JPG, PNG, WEBP, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large! Max 5MB");
      return;
    }

    setUploading(true);
    toast.info("Uploading image to server...");
    
    try {
      // Upload to Supabase Storage via backend
      const result = await uploadImage(file, 'product');
      
      console.log("Upload successful! URL:", result.url);
      
      // Update form data and preview
      setFormData((prev: any) => {
        const updated = { ...prev, image: result.url };
        console.log("Updated formData:", updated);
        return updated;
      });
      
      setImagePreview(result.url);
      console.log("Image preview set:", result.url);
      
      toast.success("Image uploaded successfully!");
      console.log("=== IMAGE UPLOAD COMPLETE ===");
    } catch (error: any) {
      console.error("=== IMAGE UPLOAD ERROR ===");
      console.error("Error:", error);
      
      let errorMessage = "Failed to upload image";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      console.error("Final error message:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      console.log("Upload state reset");
    }
  };

  const handleEdit = (product: Product) => {
    if (isMobile) {
      // Navigate to mobile upload page with product data
      navigate("/admin-product-upload", { state: { product } });
    } else {
      // Desktop: Show inline edit form
      setEditingId(product.id);
      setFormData({
        name: product.name || "",
        nameBn: product.nameBn || product.name_bn || "",
        diamonds: product.diamonds || 0,
        price: product.price || 0,
        category: product.category || "budget",
        rating: product.rating || 4.5,
        image: product.image || product.imageUrl || product.image_url || "",
        badge: product.badge || "",
        isMembership: product.isMembership || false,
        isFeatured: product.isFeatured || product.is_featured || false,
        isActive: product.isActive !== undefined ? product.isActive : (product.is_active !== undefined ? product.is_active : true),
        stockStatus: product.stockStatus || product.stock_status || "in_stock",
        description: product.description || "",
        descriptionBn: product.descriptionBn || product.description_bn || "",
        // Use gameName if available, otherwise fallback to gameId
        gameId: product.gameName || product.game_name || product.gameId || product.game_id || (games.length > 0 ? games[0].id : ""),
      });
      setImagePreview(product.image || product.imageUrl || product.image_url || "");
      setIsAdding(true);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Deactivate this product?")) return;
    
    try {
      await deleteProduct(productId, false);
      toast.success("Product deactivated!");
      if (onProductsChange) {
        onProductsChange();
      } else {
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const handleDuplicate = async (product: Product) => {
    try {
      await duplicateProduct(product.id);
      toast.success("Product duplicated successfully!");
      if (onProductsChange) {
        onProductsChange();
      } else {
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to duplicate product");
    }
  };

  const toggleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAll = () => {
    const displayedProducts = showInactive ? products : products.filter(p => p.isActive);
    setSelectedProducts(new Set(displayedProducts.map(p => p.id)));
  };

  const deselectAll = () => {
    setSelectedProducts(new Set());
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.size === 0) {
      toast.error("No products selected");
      return;
    }

    const actionNames: Record<string, string> = {
      activate: "activate",
      deactivate: "deactivate",
      feature: "mark as featured",
      unfeature: "remove featured status",
    };

    if (!confirm(`${actionNames[action]} ${selectedProducts.size} product(s)?`)) return;

    try {
      await bulkProductAction(action, Array.from(selectedProducts));
      toast.success(`Successfully ${actionNames[action]}d ${selectedProducts.size} product(s)!`);
      setSelectedProducts(new Set());
      if (onProductsChange) {
        onProductsChange();
      } else {
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to perform bulk action");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setImagePreview("");
    setFormData({
      name: "",
      nameBn: "",
      diamonds: 0,
      price: 0,
      category: "budget",
      rating: 4.5,
      image: "",
      badge: "",
      isMembership: false,
      isFeatured: false,
      isActive: true,
      stockStatus: "in_stock",
      description: "",
      descriptionBn: "",
      gameId: games.length > 0 ? games[0].id : "",
    });
  };

  const displayedProducts = showInactive ? products : products.filter(p => p.isActive);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      budget: "from-green-500 to-emerald-500",
      standard: "from-blue-500 to-cyan-500",
      premium: "from-purple-500 to-pink-500",
      membership: "from-orange-500 to-red-500",
    };
    return colors[category] || "from-gray-500 to-slate-500";
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Package size={24} />
            <TrendingUp size={20} className="opacity-70" />
          </div>
          <p className="text-3xl font-black">{products.length}</p>
          <p className="text-xs opacity-80">Total</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Eye size={24} />
            <Sparkles size={20} className="opacity-70" />
          </div>
          <p className="text-3xl font-black">{products.filter(p => p.isActive).length}</p>
          <p className="text-xs opacity-80">Active</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Star size={24} />
            <Award size={20} className="opacity-70" />
          </div>
          <p className="text-3xl font-black">{products.filter(p => p.isFeatured).length}</p>
          <p className="text-xs opacity-80">Featured</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <EyeOff size={24} />
            <AlertCircle size={20} className="opacity-70" />
          </div>
          <p className="text-3xl font-black">{products.filter(p => !p.isActive).length}</p>
          <p className="text-xs opacity-80">Inactive</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <ShoppingBag size={24} className="text-[#FF3B30]" />
              Products
            </h2>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            {!isAdding && (
              <button
                onClick={() => isMobile ? navigate("/admin-product-upload") : setIsAdding(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FF3B30] to-red-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
              >
                <Plus size={20} />
                Upload
              </button>
            )}
            
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl font-bold text-sm cursor-pointer hover:bg-gray-200 transition-all">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="w-4 h-4 text-[#FF3B30] rounded focus:ring-[#FF3B30]"
              />
              Show Inactive
            </label>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.size > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-lg font-black text-blue-900 flex items-center gap-2">
              <CheckSquare size={24} />
              {selectedProducts.size} product(s) selected
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-4 py-2 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition-all shadow-lg"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('feature')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700 transition-all shadow-lg"
              >
                Feature
              </button>
              <button
                onClick={() => handleBulkAction('unfeature')}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg"
              >
                Unfeature
              </button>
              <button
                onClick={deselectAll}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Deselect All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-2xl space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b-2 border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF3B30] to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                {editingId ? <Edit className="text-white" size={28} /> : <Plus className="text-white" size={28} />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">
                  {editingId ? "Edit Product" : "Add Product"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Product details</p>
              </div>
            </div>
          </div>

          {/* Image Upload Section - Most Prominent */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-base font-black text-gray-900">
                <ImageIcon size={20} className="text-blue-600" />
                Image*
              </label>
              <button
                type="button"
                onClick={() => setUseDirectUrl(!useDirectUrl)}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 underline"
              >
                {useDirectUrl ? "📤 Upload File" : "🔗 Use URL"}
              </button>
            </div>
            
            {useDirectUrl ? (
              /* Direct URL Input */
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">URL</label>
                  <input
                    type="url"
                    value={formData.image || ""}
                    onChange={(e) => {
                      const url = e.target.value;
                      setFormData({ ...formData, image: url });
                      setImagePreview(url);
                    }}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none transition-all font-medium"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500">Paste direct link to product image</p>
                </div>
                
                {imagePreview && (
                  <div className="relative h-64 border-4 border-green-400 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-2">
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="w-full h-full object-contain"
                      onError={() => {
                        console.error("❌ Image load error:", imagePreview);
                        toast.error("Failed to load image");
                        setImagePreview("");
                        setFormData({ ...formData, image: "" });
                      }}
                      onLoad={() => {
                        console.log("✅ Image loaded successfully");
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg">
                      <CheckSquare size={14} />
                      Ready
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setFormData({ ...formData, image: "" });
                        toast.info("Image removed");
                      }}
                      className="absolute bottom-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-lg transition-all shadow-lg hover:scale-110"
                      title="Remove image"
                    >
                      <X size={18} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-white text-xs font-semibold truncate">{imagePreview.substring(0, 50)}...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* File Upload */
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center h-48 border-3 border-dashed border-blue-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all bg-white group">
                  <div className="flex flex-col items-center justify-center p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-gray-700 font-black mb-2">
                      {uploading ? "Uploading..." : "Upload image"}
                    </p>
                    <p className="text-sm text-gray-500 text-center">
                      PNG, JPG, WEBP, GIF • Max 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
                
                {imagePreview && (
                  <div className="relative h-48 border-3 border-green-300 rounded-2xl overflow-hidden shadow-xl bg-white">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg">
                      <CheckSquare size={14} />
                      Ready
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setFormData({ ...formData, image: "" });
                      }}
                      className="absolute bottom-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all shadow-lg"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {!imagePreview && (
              <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800 font-medium">
                  <strong>Important:</strong> Product image is required. Upload an image or provide a URL.
                  {!useDirectUrl && <span className="block mt-1">If upload fails, try "Use URL" option.</span>}
                </p>
              </div>
            )}
          </div>
          
          {/* Basic Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-black text-gray-900 flex items-center gap-2 pb-3 border-b-2 border-gray-100">
              <Tag size={20} className="text-purple-600" />
              Basic Info
            </h4>
            
            {/* Game Selection */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
              <label className="flex items-center gap-2 text-base font-black text-gray-900 mb-4">
                <Gamepad2 size={20} className="text-indigo-600" />
                Game*
              </label>
              <input
                type="text"
                value={formData.gameId || ""}
                onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none transition-all font-bold text-lg bg-white"
                placeholder="Enter game name (e.g., Free Fire, PUBG Mobile)"
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                💡 Enter the game name for this product
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  Name (EN)*
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all font-medium"
                  placeholder="e.g., 100 Diamonds"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  Name (BN)*
                </label>
                <input
                  type="text"
                  value={formData.nameBn || ""}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all font-medium"
                  placeholder="যেমন: ১০০ ডায়মন্ড"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-6">
            <h4 className="text-lg font-black text-gray-900 flex items-center gap-2 pb-3 border-b-2 border-gray-100">
              <Zap size={20} className="text-orange-600" />
              Pricing
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Sparkles size={16} className="text-yellow-500" />
                  Diamonds/Validity*
                </label>
                <input
                  type="text"
                  value={formData.diamonds || 0}
                  onChange={(e) => setFormData({ ...formData, diamonds: e.target.value as any })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-all font-bold text-lg"
                  placeholder="100 or WEEKLY"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Zap size={16} className="text-green-500" />
                  Price (৳)*
                </label>
                <input
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all font-bold text-lg"
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Star size={16} className="text-yellow-500" />
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating || 4.5}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-all font-bold text-lg"
                  placeholder="4.5"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-6">
            <h4 className="text-lg font-black text-gray-900 flex items-center gap-2 pb-3 border-b-2 border-gray-100">
              <Package size={20} className="text-blue-600" />
              Category
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  Category*
                </label>
                <select
                  value={formData.category || "budget"}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all font-bold"
                >
                  <option value="budget">Budget Pack</option>
                  <option value="standard">Standard Pack</option>
                  <option value="premium">Premium Pack</option>
                  <option value="membership">Membership</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  Stock Status
                </label>
                <select
                  value={formData.stockStatus || "in_stock"}
                  onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all font-bold"
                >
                  <option value="in_stock">✅ In Stock</option>
                  <option value="low_stock">⚠️ Low Stock</option>
                  <option value="out_of_stock">❌ Out of Stock</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Award size={16} className="text-red-500" />
                  Badge (Optional)
                </label>
                <input
                  type="text"
                  value={formData.badge || ""}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all font-medium"
                  placeholder="HOT, BEST VALUE"
                />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-6">
            <h4 className="text-xl font-black text-gray-900 flex items-center gap-2 pb-3 border-b-2 border-gray-100">
              <ImageIcon size={22} className="text-indigo-600" />
              Product Descriptions
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Description (English)</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all font-medium resize-none"
                  rows={4}
                  placeholder="Detailed product description..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Description (Bengali)</label>
                <textarea
                  value={formData.descriptionBn || ""}
                  onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all font-medium resize-none"
                  rows={4}
                  placeholder="পণ্যের বিস্তারিত বিবরণ..."
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <h4 className="text-lg font-black text-gray-900 mb-4">Product Options</h4>
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.isMembership}
                    onChange={(e) => setFormData({ ...formData, isMembership: e.target.checked })}
                    className="w-6 h-6 text-purple-600 rounded-lg focus:ring-purple-500 cursor-pointer"
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-purple-600 transition-colors flex items-center gap-2">
                  <Award size={16} className="text-purple-600" />
                  Membership Product
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-6 h-6 text-yellow-600 rounded-lg focus:ring-yellow-500 cursor-pointer"
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-yellow-600 transition-colors flex items-center gap-2">
                  <Star size={16} className="text-yellow-600" />
                  Featured Product
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-6 h-6 text-green-600 rounded-lg focus:ring-green-500 cursor-pointer"
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-green-600 transition-colors flex items-center gap-2">
                  <CheckSquare size={16} className="text-green-600" />
                  Active Status
                </span>
              </label>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
            <button
              type="submit"
              disabled={uploading || !imagePreview}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF3B30] to-red-600 text-white rounded-xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              title={!imagePreview ? "Please upload an image first" : ""}
            >
              <Save size={24} />
              {editingId ? "Update Product" : "Add Product"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center gap-3 px-8 py-4 border-3 border-gray-300 text-gray-700 rounded-xl font-black text-lg hover:bg-gray-50 transition-all"
            >
              <X size={24} />
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Products List - Store Style (2 per row) */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600 font-bold">
          Showing {displayedProducts.length} of {products.length} products
        </p>
        {displayedProducts.length > 0 && (
          <button
            onClick={selectedProducts.size === displayedProducts.length ? deselectAll : selectAll}
            className="text-sm text-blue-600 font-bold hover:underline"
          >
            {selectedProducts.size === displayedProducts.length ? "Deselect All" : "Select All"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayedProducts.map((product) => {
          console.log("Rendering product:", product.id, "Image:", product.image);
          return (
          <div 
            key={product.id} 
            className={`group relative bg-white rounded-2xl lg:rounded-3xl overflow-hidden transition-all duration-300 ${
              selectedProducts.has(product.id) 
                ? 'ring-4 ring-blue-500 shadow-2xl scale-[1.02]' 
                : product.isActive 
                  ? 'shadow-lg hover:shadow-2xl border-2 border-gray-100 hover:border-red-300' 
                  : 'opacity-60 border-2 border-red-200'
            }`}
          >
            {/* Mobile Layout - Vertical */}
            <div className="lg:hidden">
              {/* Product Image - Top */}
              <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {(product.image || product.imageUrl || product.image_url) ? (
                  <img
                    src={product.image || product.imageUrl || product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      console.error("Image load error for product:", product.id, product.image);
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                    onLoad={() => {
                      console.log("✅ Image loaded successfully for product:", product.id);
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${(product.image || product.imageUrl || product.image_url) ? 'hidden' : ''}`}>
                  <ImageIcon size={32} className="text-gray-400" />
                </div>
                
                {/* Selection Checkbox */}
                <button
                  onClick={() => toggleSelectProduct(product.id)}
                  className="absolute top-2 left-2 w-6 h-6 bg-white/95 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg border border-gray-200 z-10"
                >
                  {selectedProducts.has(product.id) ? (
                    <CheckSquare size={14} className="text-blue-600" />
                  ) : (
                    <Square size={14} className="text-gray-400" />
                  )}
                </button>

                {/* Badges */}
                {product.isFeatured && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 p-1.5 rounded-lg shadow-md border border-white">
                    <Star size={12} fill="currentColor" />
                  </div>
                )}
                {product.badge && (
                  <div className="absolute bottom-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-black shadow-md border border-white">
                    {product.badge}
                  </div>
                )}
                {!product.isActive && (
                  <div className="absolute bottom-2 right-2 bg-gray-900 text-white px-2 py-0.5 rounded-lg text-[10px] font-black shadow-md border border-white">
                    OFF
                  </div>
                )}
              </div>

              {/* Product Info - Bottom */}
              <div className="p-3 space-y-2">
                {/* Title */}
                <div>
                  <h3 className="text-xs font-black text-gray-900 line-clamp-1 group-hover:text-red-500 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-gray-600 font-semibold line-clamp-1">{product.nameBn}</p>
                </div>

                {/* Game Info */}
                {product.gameName && (
                  <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                    <Gamepad2 size={10} className="text-purple-600 flex-shrink-0" />
                    <span className="text-[10px] text-purple-700 font-bold truncate">{product.gameName}</span>
                  </div>
                )}

                {/* Price & Category */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-[#FF3B30]">৳{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[10px] text-gray-500 line-through">৳{product.originalPrice}</span>
                    )}
                  </div>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    (product.stock || 0) > 100 ? 'bg-green-500 text-white' : 
                    (product.stock || 0) > 0 ? 'bg-yellow-500 text-white' : 
                    'bg-red-500 text-white'
                  }`}>
                    {product.stock || 0}
                  </span>
                </div>

                {/* Category Badge */}
                <div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r ${getCategoryColor(product.category)} text-white text-[10px] font-black rounded-lg`}>
                    <Package size={8} />
                    {product.category.toUpperCase()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(product);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-[10px] font-black hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                    title="Edit"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(product);
                    }}
                    className="flex items-center justify-center px-2 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-[10px] font-black hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                    title="Duplicate"
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                    className="flex items-center justify-center px-2 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-[10px] font-black hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="hidden lg:flex">
              {/* Product Image - Left Side */}
              <div className="relative w-36 h-36 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {(product.image || product.imageUrl || product.image_url) ? (
                  <img
                    src={product.image || product.imageUrl || product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      console.error("Image load error for product:", product.id, product.image);
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                    onLoad={() => {
                      console.log("✅ Image loaded successfully for product:", product.id);
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${(product.image || product.imageUrl || product.image_url) ? 'hidden' : ''}`}>
                  <ImageIcon size={40} className="text-gray-400" />
                </div>
                
                {/* Selection Checkbox */}
                <button
                  onClick={() => toggleSelectProduct(product.id)}
                  className="absolute top-2 left-2 w-6 h-6 bg-white/95 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg border border-gray-200 z-10"
                >
                  {selectedProducts.has(product.id) ? (
                    <CheckSquare size={16} className="text-blue-600" />
                  ) : (
                    <Square size={16} className="text-gray-400" />
                  )}
                </button>

                {/* Badges */}
                {product.isFeatured && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2 py-1 rounded-lg text-xs font-black flex items-center gap-1 shadow-md border border-white">
                    <Star size={12} fill="currentColor" />
                  </div>
                )}
                {product.badge && (
                  <div className="absolute bottom-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-black shadow-md border border-white">
                    {product.badge}
                  </div>
                )}
                {!product.isActive && (
                  <div className="absolute bottom-2 right-2 bg-gray-900 text-white px-2 py-1 rounded-lg text-xs font-black shadow-md border border-white">
                    OFF
                  </div>
                )}
              </div>

              {/* Product Info - Right Side */}
              <div className="flex-1 p-4 flex flex-col bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-gray-900 mb-0.5 line-clamp-1 group-hover:text-red-500 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-600 font-semibold line-clamp-1">{product.nameBn}</p>
                  </div>
                </div>

                {/* Game Info */}
                {product.gameName && (
                  <div className="flex items-center gap-2 mb-2 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                    <Gamepad2 size={12} className="text-purple-600" />
                    <span className="text-xs text-purple-700 font-bold truncate">{product.gameName}</span>
                  </div>
                )}

                {/* Price & Stock */}
                <div className="flex items-center justify-between mb-2 bg-gradient-to-r from-red-50 to-pink-50 px-2 py-1.5 rounded-lg border border-red-200">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-[#FF3B30]">৳{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-gray-500 line-through font-semibold">৳{product.originalPrice}</span>
                    )}
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full shadow-sm ${
                    (product.stock || 0) > 100 ? 'bg-green-500 text-white' : 
                    (product.stock || 0) > 0 ? 'bg-yellow-500 text-white' : 
                    'bg-red-500 text-white'
                  }`}>
                    {product.stock || 0}
                  </span>
                </div>

                {/* Category Badge */}
                <div className="mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r ${getCategoryColor(product.category)} text-white text-xs font-black rounded-lg shadow-sm`}>
                    <Package size={10} />
                    {product.category.toUpperCase()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1.5 mt-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(product);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs font-black hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg hover:scale-105"
                    title="Edit Product"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(product);
                    }}
                    className="flex items-center justify-center px-2 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-xs font-black hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg hover:scale-105"
                    title="Duplicate Product"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                    className="flex items-center justify-center px-2 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs font-black hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg hover:scale-105"
                    title="Delete Product"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        })}
      </div>

      {displayedProducts.length === 0 && !isAdding && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={48} className="text-gray-300" />
          </div>
          <p className="text-xl font-black text-gray-400 mb-2">
            {showInactive ? "No products found" : "No active products yet"}
          </p>
          <p className="text-gray-500 mb-6">Start by adding your first product</p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-8 py-4 bg-gradient-to-r from-[#FF3B30] to-red-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
          >
            Add Your First Product
          </button>
        </div>
      )}
    </div>
  );
}
