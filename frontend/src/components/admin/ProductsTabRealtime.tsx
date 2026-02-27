// Real-time Product Management with Active/Inactive Tabs
// Auto-refresh every 5 seconds, instant status toggle

import { useState, useEffect } from "react";
import { 
  Plus, Edit, Trash2, Save, X, Upload, Power, PowerOff,
  Star, Package, Eye, EyeOff, Sparkles, RefreshCw, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { 
  Product, ProductsResponse,
  getActiveProducts, getInactiveProducts,
  toggleProductStatus, createProduct, updateProduct, deleteProduct,
  ProductPoller
} from "@/lib/productService";

export default function ProductsTabRealtime() {
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);
  const [inactiveProducts, setInactiveProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0, showing: 0 });
  const [currentTab, setCurrentTab] = useState<'active' | 'inactive'>('active');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    name_bn: "",
    diamonds: 0,
    price: 0,
    category: "budget",
    rating: 4.5,
    image: "",
    badge: "",
    is_membership: false,
    is_featured: false,
    is_active: true,
    stock_status: "in_stock",
    description: "",
    description_bn: "",
  });

  // Fetch products
  const fetchProducts = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      else setRefreshing(true);

      const [activeRes, inactiveRes] = await Promise.all([
        getActiveProducts(),
        getInactiveProducts()
      ]);

      setActiveProducts(activeRes.products);
      setInactiveProducts(inactiveRes.products);
      setSummary({
        total: activeRes.summary.active + inactiveRes.summary.inactive,
        active: activeRes.summary.active,
        inactive: inactiveRes.summary.inactive,
        showing: currentTab === 'active' ? activeRes.summary.active : inactiveRes.summary.inactive
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchProducts(true);
    
    const interval = setInterval(() => {
      fetchProducts(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentTab]);

  // Toggle product status
  const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activate' : 'deactivate';

    try {
      await toggleProductStatus(productId, newStatus);
      toast.success(`Product ${action}d successfully!`);
      
      // Instant UI update
      fetchProducts(false);
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} product`);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    toast.info("Uploading image...");
    
    try {
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      const base64Data = await base64Promise;
      
      // Upload to ImgBB
      const IMGBB_API_KEY = "cfdf8c24a5b1249d8b721f1d8adb63a8";
      const formDataUpload = new FormData();
      formDataUpload.append('image', base64Data);
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();
      
      if (data.success && data.data.url) {
        setFormData(prev => ({ ...prev, image: data.data.url }));
        setImagePreview(data.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.name_bn || !formData.price) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload a product image");
      return;
    }

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
        toast.success("Product updated successfully!");
        setEditingId(null);
      } else {
        await createProduct({ ...formData, is_active: true });
        toast.success("Product added successfully!");
        setIsAdding(false);
      }
      
      resetForm();
      fetchProducts(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      name_bn: "",
      diamonds: 0,
      price: 0,
      category: "budget",
      rating: 4.5,
      image: "",
      badge: "",
      is_membership: false,
      is_featured: false,
      is_active: true,
      stock_status: "in_stock",
      description: "",
      description_bn: "",
    });
    setImagePreview("");
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setImagePreview(product.image || "");
    setIsAdding(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Deactivate this product?")) return;
    
    try {
      await deleteProduct(productId, false);
      toast.success("Product deactivated!");
      fetchProducts(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const displayedProducts = currentTab === 'active' ? activeProducts : inactiveProducts;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-bold">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
          <Package size={32} className="mb-2" />
          <p className="text-4xl font-black">{summary.total}</p>
          <p className="text-sm opacity-80">Total Products</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <Eye size={32} className="mb-2" />
          <p className="text-4xl font-black">{summary.active}</p>
          <p className="text-sm opacity-80">Active Products</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 text-white">
          <EyeOff size={32} className="mb-2" />
          <p className="text-4xl font-black">{summary.inactive}</p>
          <p className="text-sm opacity-80">Inactive Products</p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-gray-900">Product Management</h2>
            {refreshing && (
              <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
            )}
          </div>
          
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF3B30] to-red-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentTab('active')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              currentTab === 'active'
                ? 'bg-green-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Eye size={20} />
            Active Products ({summary.active})
          </button>
          <button
            onClick={() => setCurrentTab('inactive')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              currentTab === 'inactive'
                ? 'bg-red-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <EyeOff size={20} />
            Inactive Products ({summary.inactive})
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100">
            <h3 className="text-2xl font-black text-gray-900">
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>
          </div>

          {/* Image Upload */}
          <div className="grid md:grid-cols-2 gap-6">
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition-all">
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 font-bold">
                {uploading ? "Uploading..." : "Click to upload image"}
              </p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
            
            {imagePreview && (
              <div className="relative h-48 border-2 border-green-300 rounded-xl overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview("");
                    setFormData({ ...formData, image: "" });
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none"
              placeholder="Product Name (English)*"
              required
            />
            <input
              type="text"
              value={formData.name_bn}
              onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none"
              placeholder="Product Name (Bengali)*"
              required
            />
            <input
              type="number"
              value={formData.diamonds}
              onChange={(e) => setFormData({ ...formData, diamonds: Number(e.target.value) })}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none"
              placeholder="Diamonds*"
              required
            />
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none"
              placeholder="Price (৳)*"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none"
            >
              <option value="budget">Budget Pack</option>
              <option value="standard">Standard Pack</option>
              <option value="premium">Premium Pack</option>
              <option value="membership">Membership</option>
            </select>
            <input
              type="text"
              value={formData.badge || ""}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none"
              placeholder="Badge (Optional)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={uploading || !imagePreview}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF3B30] to-red-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Save size={20} />
              {editingId ? "Update" : "Add"} Product
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                resetForm();
              }}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Products Grid */}
      <div className="text-sm text-gray-600 font-bold mb-4">
        Showing {displayedProducts.length} of {summary.total} products
      </div>

      {displayedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-xl font-black text-gray-400 mb-2">
            {currentTab === 'active' ? "No active products yet" : "No inactive products"}
          </p>
          <p className="text-gray-500">
            {currentTab === 'active' && "Start by adding your first product"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {displayedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-all">
              <div className="relative h-48 bg-gray-100">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={64} className="text-gray-300" />
                  </div>
                )}
                {product.badge && (
                  <span className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="p-6">
                <h4 className="text-xl font-black text-gray-900 mb-1">{product.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{product.name_bn}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-[#FF3B30]">৳{product.price}</span>
                  <span className="flex items-center gap-1 text-sm font-bold">
                    <Sparkles size={16} className="text-yellow-500" />
                    {product.diamonds} 💎
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(product.id, product.is_active)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                      product.is_active
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {product.is_active ? <PowerOff size={16} /> : <Power size={16} />}
                    {product.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-xl font-bold hover:bg-gray-600 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
