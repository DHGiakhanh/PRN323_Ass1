import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const THEME_COLOR_CLASS = "bg-pink-600 hover:bg-pink-700";
const BORDER_FOCUS_CLASS = "focus:ring-pink-300 focus:border-pink-300";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const handleUpload = async () => {
    if (!file) return "";
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "asm1prn232");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dblw5v3br/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const result = await res.json();
    return result.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim() || price <= 0) {
        toast.error("Vui lòng nhập tên, mô tả và giá hợp lệ!");
        return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await handleUpload();
      }
      
      await api.post("/Products", {
        name,
        description,
        price,
        image: imageUrl,
      });
      
      toast.success("✅ Sản phẩm đã được tạo!");
      navigate("/");
      
    } catch {
      toast.error("❌ Thất bại khi tạo sản phẩm! Vui lòng kiểm tra API.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 min-h-screen bg-gray-50"
    >
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-pink-100"> 
        <h2 className="text-3xl font-bold mb-6 text-pink-600 border-b pb-2">
          ➕ Thêm Sản Phẩm Mới
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Tên sản phẩm */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
            <input
              id="name"
              placeholder="Nhập tên sản phẩm..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 transition duration-200 focus:ring-2 ${BORDER_FOCUS_CLASS}`}
            />
          </div>

          {/* Mô tả */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              id="description"
              placeholder="Mô tả chi tiết sản phẩm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 transition duration-200 focus:ring-2 ${BORDER_FOCUS_CLASS}`}
            />
          </div>

          {/* Giá */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Giá ($)</label>
            <input
              id="price"
              type="number"
              placeholder="Giá sản phẩm (ví dụ: 19.99)"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              min="0.01"
              step="0.01"
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 transition duration-200 focus:ring-2 ${BORDER_FOCUS_CLASS}`}
            />
          </div>

          {/* Chọn ảnh */}
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Chọn ảnh sản phẩm (Tùy chọn)</label>
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 transition duration-200"
            />
          </div>

          {/* Nút Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${THEME_COLOR_CLASS} text-white py-3 rounded-xl font-bold shadow-lg transition duration-300 transform ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
          >
            {isSubmitting ? "Đang Lưu..." : "Lưu Sản Phẩm"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}