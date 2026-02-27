import { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, Upload, Save, X, Image as ImageIcon,
  Sparkles, Star, Flame, Crown, Gift, Zap, Diamond, Rocket,
  TrendingUp, CheckCircle, Package
} from "lucide-react";
import { toast } from "sonner";

interface FeaturedPackage {
  id: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  description: string;
  descriptionBn: string;
  image: string;
  category: string;
  color: string;
  icon: string;
  badge?: string;
  isActive: boolean;
  order: number;
}

const iconOptions = [
  { value: "sparkles", label: "Sparkles", icon: Sparkles },
  { value: "star", label: "Star", icon: Star },
  { value: "flame", label: "Flame", icon: Flame },
  { value: "crown", label: "Crown", icon: Crown },
  { value: "gift", label: "Gift", icon: Gift },
  { value: "zap", label: "Zap", icon: Zap },
  { value: "diamond", label: "Diamond", icon: Diamond },
  { value: "rocket", label: "Rocket", icon: Rocket }
];

const colorOptions = [
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "green", label: "Green", class: "bg-green-500" }
];

const categoryOptions = [
  { value: "budget", label: "Budget Pack" },
  { value: "standard", label: "Standard Pack" },
  { value: "premium", label: "Premium Pack" },
  { value: "membership", label: "Membership" }
];

const badgeOptions = [
  { value: "", label: "No Badge" },
  { value: "Hot", label: "Hot" },
  { value: "VIP", label: "VIP" },
  { value: "New", label: "New" }
];

export default function FeaturedPackagesTab() {
  const [packages, setPackages] = useState<FeaturedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<FeaturedPackage | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    titleBn: "",
    subtitle: "",
    subtitleBn: "",
    description: "",
    descriptionBn: "",
    image: "",
    category: "budget",
    color: "blue",
    icon: "sparkles",
    badge: "",
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/featured-packages");
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

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
    toast.info("Uploading to ImgBB...");

    try {
      // Convert image to base64
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Data = await base64Promise;
      
      // ImgBB API Key
      const IMGBB_API_KEY = "cfdf8c24a5b1249d8b721f1d8adb63a8";
      
      const formData = new FormData();
      formData.append('image', base64Data);
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ImgBB error:", errorText);
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data.url) {
        const imageUrl = data.data.url;
        setFormData(prev => ({ ...prev, image: imageUrl }));
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Invalid response from ImgBB");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      if (error.message.includes("Failed to fetch")) {
        toast.error("Network error! Check your internet connection");
      } else {
        toast.error(error.message || "Failed to upload image");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingPackage 
        ? "/api/featured-packages"
        : "/api/featured-packages";
      
      const method = editingPackage ? "PUT" : "POST";
      const body = editingPackage 
        ? { ...formData, id: editingPackage.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast.success(editingPackage ? "Package updated!" : "Package created!");
        fetchPackages();
        resetForm();
      } else {
        toast.error("Failed to save package");
      }
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("Failed to save package");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const response = await fetch(`/api/featured-packages?id=${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast.success("Package deleted!");
        fetchPackages();
      } else {
        toast.error("Failed to delete package");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
    }
  };

  const handleEdit = (pkg: FeaturedPackage) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      titleBn: pkg.titleBn,
      subtitle: pkg.subtitle,
      subtitleBn: pkg.subtitleBn,
      description: pkg.description,
      descriptionBn: pkg.descriptionBn,
      image: pkg.image,
      category: pkg.category,
      color: pkg.color,
      icon: pkg.icon,
      badge: pkg.badge || "",
      isActive: pkg.isActive,
      order: pkg.order
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      titleBn: "",
      subtitle: "",
      subtitleBn: "",
      description: "",
      descriptionBn: "",
      image: "",
      category: "budget",
      color: "blue",
      icon: "sparkles",
      badge: "",
      isActive: true,
      order: 0
    });
    setEditingPackage(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Featured Packages</h2>
          <p className="text-gray-600">Manage home page featured packages</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? "Cancel" : "Add Package"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <h3 className="text-xl font-black text-gray-900 mb-6">
            {editingPackage ? "Edit Package" : "Create New Package"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Title (English)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Title (Bengali)</label>
              <input
                type="text"
                value={formData.titleBn}
                onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle (English)</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle (Bengali)</label>
              <input
                type="text"
                value={formData.subtitleBn}
                onChange={(e) => setFormData({ ...formData, subtitleBn: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description (English)</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description (Bengali)</label>
              <input
                type="text"
                value={formData.descriptionBn}
                onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
              >
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Color Theme</label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
              >
                {colorOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
              >
                {iconOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Badge */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Badge (Optional)</label>
              <select
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
              >
                {badgeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5"
              />
              <label htmlFor="isActive" className="text-sm font-bold text-gray-700">Active</label>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Package Image</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl cursor-pointer transition-all border-2 border-gray-200">
                <Upload size={20} />
                <span className="font-bold">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {uploading && <span className="text-sm text-gray-600">Uploading...</span>}
              {formData.image && (
                <div className="flex items-center gap-2">
                  <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
            >
              <Save size={20} />
              {editingPackage ? "Update Package" : "Create Package"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Packages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-gray-200">
            <Package size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No packages found</p>
          </div>
        ) : (
          packages.map((pkg) => {
            const IconComponent = iconOptions.find(i => i.value === pkg.icon)?.icon || Sparkles;
            const colorClass = colorOptions.find(c => c.value === pkg.color)?.class || "bg-blue-500";

            return (
              <div key={pkg.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-red-300 hover:shadow-xl transition-all">
                {/* Image or Icon */}
                <div className="mb-4">
                  {pkg.image ? (
                    <img src={pkg.image} alt={pkg.titleBn} className="w-full h-40 object-cover rounded-xl" />
                  ) : (
                    <div className={`w-full h-40 ${colorClass} rounded-xl flex items-center justify-center`}>
                      <IconComponent size={64} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-black text-gray-900">{pkg.titleBn}</h3>
                    {pkg.badge && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {pkg.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-1">{pkg.subtitle}</p>
                  <p className="text-xs text-gray-500">{pkg.descriptionBn}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-bold">{pkg.category}</span>
                    <span className={`w-4 h-4 ${colorClass} rounded-full`}></span>
                    {pkg.isActive ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <X size={16} className="text-red-500" />
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
