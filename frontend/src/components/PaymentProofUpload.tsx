import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface PaymentProofUploadProps {
  orderId: string;
  currentImage?: string;
  onUploadComplete?: (url: string) => void;
}

export default function PaymentProofUpload({ orderId, currentImage, onUploadComplete }: PaymentProofUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
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
      
      // Upload to ImgBB
      const IMGBB_API_KEY = "cfdf8c24a5b1249d8b721f1d8adb63a8";
      
      const formData = new FormData();
      formData.append('image', base64Data);
      
      const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("ImgBB error:", errorText);
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();
      
      if (!uploadData.success || !uploadData.data.url) {
        throw new Error("Invalid response from ImgBB");
      }

      const imageUrl = uploadData.data.url;

      // Update order with the image URL
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to upload payment proof");
      }

      const response = await fetch(`/api/orders/${orderId}/upload_proof`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      setPreview(imageUrl);
      toast.success("Payment proof uploaded successfully");
      onUploadComplete?.(imageUrl);
    } catch (error: any) {
      console.error("Upload error:", error);
      if (error.message.includes("Failed to fetch")) {
        toast.error("Network error! Check your internet connection");
      } else {
        toast.error(error.message || "Failed to upload payment proof");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    toast.success("Payment proof removed");
    onUploadComplete?.("");
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Payment Proof"
            className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging ? "border-[#FF3B30] bg-red-50" : "border-gray-300 hover:border-[#FF3B30] hover:bg-gray-50"
          }`}
        >
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 font-semibold">
            {uploading ? "Uploading..." : "Click or drag payment proof image"}
          </p>
          <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG (Max 5MB)</p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
