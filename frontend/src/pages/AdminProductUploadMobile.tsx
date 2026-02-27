import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Upload, Image as ImageIcon, Save, AlertCircle, Gamepad2, Tag, Zap, Sparkles, Star, Award, Package, CheckSquare, X } from "lucide-react";
import { createProduct, updateProduct } from "@/lib/adminService";
import { uploadImage } from "@/lib/uploadService";
import { toast } from "sonner";
import { Product } from "@/lib/types";

export default function AdminProductUploadMobile() {
  const navigate = useNavigate();
  const location = useLocation();
  const editProduct = location.state?.product as Product | undefined;
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [useDirectUrl, setUseDirectUrl] = useState(false);
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

  // Load product data if editing
  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || "",
        nameBn: editProduct.nameBn || editProduct.name_bn || "",
        diamonds: editProduct.diamonds || 0,
        price: editProduct.price || 0,
        category: editProduct.category || "budget",
        rating: editProduct.rating || 4.5,
        image: editProduct.image || editProduct.imageUrl || editProduct.image_url || "",
        badge: editProduct.badge || "",
        isMembership: editProduct.isMembership || false,
        isFeatured: editProduct.isFeatured || editProduct.is_featured || false,
        isActive: editProduct.isActive !== undefined ? editProduct.isActive : (editProduct.is_active !== undefined ? editProduct.is_active : true),
        stockStatus: editProduct.stockStatus || editProduct.stock_status || "in_stock",
        description: editProduct.description || "",
        descriptionBn: editProduct.descriptionBn || editProduct.description_bn || "",
        gameId: editProduct.gameName || editProduct.game_name || editProduct.gameId || editProduct.game_id || "",
      });
      setImagePreview(editProduct.image || editProduct.imageUrl || editProduct.image_url || "");
    }
  }, [editProduct]);

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
      const result = await uploadImage(file, 'product');
      setFormData((prev: any) => ({ ...prev, image: result.url }));
      setImagePreview(result.url);
      toast.success("Image uploaded!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.nameBn || !formData.price) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!formData.gameId) {
      toast.error("Please select a game");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload a product image");
      return;
    }

    try {
      const productData = {
        ...formData,
        isActive: formData.isActive !== false ? true : formData.isActive
      };
      
      if (editProduct) {
        await updateProduct(editProduct.id, productData);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(productData);
        toast.success("Product added successfully!");
      }
      
      navigate("/admin-dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pb-6">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-lg">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black">{editProduct ? "Edit Product" : "Add Product"}</h1>
            <p className="text-xs text-white/80">{editProduct ? "Update details" : "Upload details"}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Image Upload Section */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm font-black text-gray-900">
              <ImageIcon size={18} className="text-blue-600" />
              Image*
            </label>
            <button
              type="button"
              onClick={() => setUseDirectUrl(!useDirectUrl)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
            >
              {useDirectUrl ? "📤 Upload" : "🔗 URL"}
            </button>
          </div>
          
          {useDirectUrl ? (
            <div className="space-y-3">
              <input
                type="url"
                value={formData.image || ""}
                onChange={(e) => {
                  const url = e.target.value;
                  setFormData({ ...formData, image: url });
                  setImagePreview(url);
                }}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-sm"
                placeholder="https://example.com/image.jpg"
              />
              
              {imagePreview && (
                <div className="relative h-48 border-2 border-green-400 rounded-xl overflow-hidden bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={() => {
                      toast.error("Failed to load image");
                      setImagePreview("");
                      setFormData({ ...formData, image: "" });
                    }}
                  />
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
          ) : (
            <div className="space-y-3">
              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all bg-white">
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 font-bold mb-1">
                    {uploading ? "Uploading..." : "Tap to upload"}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP • Max 5MB</p>
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
                <div className="relative h-40 border-2 border-green-300 rounded-xl overflow-hidden bg-white">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <CheckSquare size={12} />
                    Ready
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!imagePreview && (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800 font-medium">
                Product image is required
              </p>
            </div>
          )}
        </div>

        {/* Game Selection */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <label className="flex items-center gap-2 text-sm font-black text-gray-900 mb-3">
            <Gamepad2 size={18} className="text-indigo-600" />
            Game*
          </label>
          <input
            type="text"
            value={formData.gameId || ""}
            onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none font-bold text-sm"
            placeholder="e.g., Free Fire, PUBG Mobile"
            required
          />
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 space-y-3">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Tag size={16} className="text-purple-600" />
            Basic Info
          </h3>
          
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Name (EN)*</label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm"
              placeholder="e.g., 100 Diamonds"
              required
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Name (BN)*</label>
            <input
              type="text"
              value={formData.nameBn || ""}
              onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm"
              placeholder="যেমন: ১০০ ডায়মন্ড"
              required
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 space-y-3">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Zap size={16} className="text-orange-600" />
            Pricing
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1 block flex items-center gap-1">
                <Sparkles size={12} className="text-yellow-500" />
                Diamonds*
              </label>
              <input
                type="text"
                value={formData.diamonds || 0}
                onChange={(e) => setFormData({ ...formData, diamonds: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-sm font-bold"
                placeholder="100"
                required
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1 block flex items-center gap-1">
                <Zap size={12} className="text-green-500" />
                Price (৳)*
              </label>
              <input
                type="number"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none text-sm font-bold"
                placeholder="0"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block flex items-center gap-1">
              <Star size={12} className="text-yellow-500" />
              Rating
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating || 4.5}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:outline-none text-sm font-bold"
              placeholder="4.5"
            />
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 space-y-3">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Package size={16} className="text-blue-600" />
            Category
          </h3>
          
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Category*</label>
            <select
              value={formData.category || "budget"}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold"
            >
              <option value="budget">Budget Pack</option>
              <option value="standard">Standard Pack</option>
              <option value="premium">Premium Pack</option>
              <option value="membership">Membership</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Stock Status</label>
            <select
              value={formData.stockStatus || "in_stock"}
              onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold"
            >
              <option value="in_stock">✅ In Stock</option>
              <option value="low_stock">⚠️ Low Stock</option>
              <option value="out_of_stock">❌ Out of Stock</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block flex items-center gap-1">
              <Award size={12} className="text-red-500" />
              Badge (Optional)
            </label>
            <input
              type="text"
              value={formData.badge || ""}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none text-sm"
              placeholder="HOT, BEST VALUE"
            />
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <h3 className="text-sm font-black text-gray-900 mb-3">Options</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isMembership}
                onChange={(e) => setFormData({ ...formData, isMembership: e.target.checked })}
                className="w-5 h-5 text-purple-600 rounded-lg"
              />
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Award size={14} className="text-purple-600" />
                Membership Product
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-5 h-5 text-yellow-600 rounded-lg"
              />
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Star size={14} className="text-yellow-600" />
                Featured Product
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 text-green-600 rounded-lg"
              />
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <CheckSquare size={14} className="text-green-600" />
                Active Status
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || !imagePreview}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#FF3B30] to-red-600 text-white rounded-xl font-black text-base hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          {editProduct ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
