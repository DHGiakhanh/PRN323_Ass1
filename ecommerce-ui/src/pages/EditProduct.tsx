import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const THEME_COLOR_CLASS = "bg-pink-500 hover:bg-pink-600";
const BORDER_FOCUS_CLASS = "focus:ring-pink-300 focus:border-pink-300";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
  
    api.get(`/Products/${id}`).then((res) => {
      const p = res.data;
      setName(p.name);
      setDescription(p.description);
      setPrice(p.price);
      setImage(p.image || "");
    });
  }, [id]);

  
  const handleUpload = async () => {
    if (!file) return image; // giữ ảnh cũ nếu không upload mới
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
    
    if (!name || !description || price <= 0) {
        toast.error("Vui lòng nhập đầy đủ thông tin và giá hợp lệ!");
        return;
    }

    try {
      const imageUrl = await handleUpload();
      await api.put(`/Products/${id}`, {
        id: Number(id),
        name,
        description,
        price,
        image: imageUrl,
      });
      toast.success("✅ Cập nhật sản phẩm thành công!");
      navigate("/");
    } catch {
      toast.error("❌ Cập nhật sản phẩm thất bại! Vui lòng thử lại.");
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
          ✏️ Chỉnh Sửa Sản Phẩm (ID: {id})
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Tên sản phẩm */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên sản phẩm..."
              required
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 transition duration-200 focus:ring-2 ${BORDER_FOCUS_CLASS}`}
            />
          </div>

          {/* Mô tả */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chi tiết sản phẩm..."
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
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              min="0.01"
              step="0.01"
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 transition duration-200 focus:ring-2 ${BORDER_FOCUS_CLASS}`}
            />
          </div>

          {/* Ảnh hiện tại */}
          {image && (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-2">Ảnh hiện tại:</p>
              <img 
                src={image} 
                alt="Ảnh hiện tại" 
                className="h-40 w-auto mx-auto rounded-xl shadow-md border border-pink-200 object-cover" 
              />
            </div>
          )}

          {/* Chọn ảnh mới */}
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Tải lên ảnh mới (Tùy chọn)</label>
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
            className={`w-full ${THEME_COLOR_CLASS} text-white py-3 rounded-xl font-bold shadow-lg transition duration-300 transform hover:scale-[1.01]`}
          >
            Cập Nhật Sản Phẩm
          </button>
        </form>
      </div>
    </motion.div>
  );
}