import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

const THEME_COLOR_CLASS = "text-pink-600";
const BUTTON_PINK_CLASS = "bg-pink-500 hover:bg-pink-600";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    api.get(`/Products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product)
    return (
      <div className="p-10 text-center">
        <p className="text-xl text-pink-600 font-semibold">
          Đang tải chi tiết sản phẩm...
        </p>
      </div>
    );

  return (
    <div className="p-8 min-h-screen bg-gray-50 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
  className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-pink-100"
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 p-4 flex items-center justify-center bg-white">
            {product.image ? (
              <motion.img
                src={product.image}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full h-80 object-contain rounded-xl border border-gray-200"
              />
            ) : (
              <div className="w-full h-80 flex items-center justify-center bg-gray-200 rounded-xl">
                <p className="text-gray-500">No Image</p>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                {product.name}
              </h1>
              
              <div className="mb-4 pt-2 border-t border-pink-200">
                <p className="text-sm font-semibold text-gray-700">Giá bán:</p>
                <p className={`${THEME_COLOR_CLASS} font-bold text-3xl`}>
                  {product.price.toLocaleString()} $
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-1">Mô tả chi tiết:</p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link
                to={`/edit/${product.id}`}
                className={`flex-1 text-center px-6 py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition shadow-md hover:shadow-lg`}
              >
                ✏ Sửa Sản Phẩm
              </Link>
              <Link
                to="/"
                className={`flex-1 text-center px-6 py-3 ${BUTTON_PINK_CLASS} text-white rounded-xl font-bold transition shadow-md hover:shadow-lg`}
              >
                🏠 Quay Lại Danh Sách
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}