import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, duration: 0.5 }}
    className="bg-pink-600 p-5 flex justify-between items-center shadow-2xl sticky top-0 z-10" 
    >
      {/* Tên cửa hàng */}
      <Link to="/" className="text-white text-3xl font-extrabold tracking-tight cursor-pointer">
        {/* Sử dụng một biểu tượng hoặc tên nổi bật hơn */}
        <span className="text-pink-100 hover:text-white transition-colors">
            🌸 ECommerce
        </span>
      </Link>
      
      {/* Các nút điều hướng */}
      <div className="flex space-x-6 items-center">
        <Link 
          to="/" 
          className="text-white text-lg font-semibold border-b-2 border-transparent hover:border-pink-200 transition duration-300 px-1"
        >
          Trang Chủ
        </Link>
        <Link 
          to="/create" 
          className="bg-pink-50 text-pink-600 py-2 px-4 rounded-full font-bold shadow-md hover:bg-white hover:text-pink-700 transition duration-300 transform hover:scale-105"
        >
          ✨ Thêm Sản Phẩm
        </Link>
      </div>
    </motion.nav>
  );
}