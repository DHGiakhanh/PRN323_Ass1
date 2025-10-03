import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image?: string;
}

const THEME_COLOR = "pink";
const HOVER_COLOR_CLASS = `hover:bg-${THEME_COLOR}-600`;
const PRIMARY_COLOR_CLASS = `bg-${THEME_COLOR}-500`;

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8); // Tăng pageSize mặc định cho giao diện chuyên nghiệp hơn

    useEffect(() => {
        // API call được giữ nguyên, chỉ lấy dữ liệu
        api.get("/Products").then((res) => setProducts(res.data));
    }, []);

    // Filter + Sort (Logic giữ nguyên)
    const filteredProducts = products
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase().trim()))
        .sort((a, b) => {
            if (sort === "price_asc") return a.price - b.price;
            if (sort === "price_desc") return b.price - a.price;
            if (sort === "name_asc") return a.name.localeCompare(b.name);
            return 0;
        });

    // Pagination (Logic giữ nguyên)
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    const paginatedProducts = filteredProducts.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/Products/${id}`);
                setProducts(products.filter((p) => p.id !== id));
                toast.success("🗑 Product deleted!");
            } catch {
                toast.error("❌ Failed to delete product!");
            }
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Search & Filter */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white rounded-xl shadow-lg"
                >
                    <input
                        type="text"
                        placeholder="🔍 Tìm kiếm sản phẩm..."
                        className="flex-1 border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition"
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                    <select
                        className="border-gray-300 border rounded-lg px-4 py-2 appearance-none bg-white focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition"
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">Sắp xếp theo</option>
                        <option value="price_asc">Giá ↑ (Thấp đến Cao)</option>
                        <option value="price_desc">Giá ↓ (Cao đến Thấp)</option>
                        <option value="name_asc">Tên A-Z</option>
                    </select>
                </motion.div>

                <h2 className="text-4xl font-extrabold mb-8 text-pink-600 flex items-center gap-3">
                    ✨ Danh Sách Sản Phẩm
                </h2>

                {paginatedProducts.length === 0 ? (
                    <p className="text-gray-500 text-lg p-6 bg-white rounded-xl shadow-md">
                        Không tìm thấy sản phẩm nào phù hợp.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {paginatedProducts.map((p) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow: "0 20px 25px -5px rgba(236, 72, 153, 0.1), 0 10px 10px -5px rgba(236, 72, 153, 0.04)" // Shadow màu hồng nhẹ
                                }}
                                className="bg-white rounded-2xl shadow-xl transition-all duration-300 overflow-hidden flex flex-col" // Bo góc lớn hơn, đổ bóng sâu hơn
                            >
                                {p.image && (
                                    <div className="w-full h-48 bg-pink-50 rounded-t-2xl flex items-center justify-center p-2">
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-110"
                                        />
                                    </div>
                                )}
                                <div className="p-5 flex flex-col justify-between flex-1">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-1">
                                            {p.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-3 h-10">
                                            {p.description}
                                        </p>
                                        <p className="text-pink-600 font-extrabold text-2xl">
                                            {p.price.toLocaleString()} $
                                        </p>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Link
                                            to={`/detail/${p.id}`}
                                            className={`flex-1 text-center px-4 py-2 ${PRIMARY_COLOR_CLASS} text-white rounded-lg font-semibold ${HOVER_COLOR_CLASS} transition-colors`}
                                        >
                                            👁 Chi tiết
                                        </Link>
                                        <Link
                                            to={`/edit/${p.id}`}
                                            className="flex-1 text-center px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                                        >
                                            ✏ Sửa
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                                        >
                                            🗑 Xóa
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 p-4 bg-white rounded-xl shadow-lg">
                        {/* chọn số sản phẩm/trang */}
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPage(1);
                                setPageSize(Number(e.target.value));
                            }}
                            className="border border-gray-300 rounded-lg px-4 py-2 bg-white appearance-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                        >
                            <option value={8}>8 sản phẩm / trang</option>
                            <option value={12}>12 sản phẩm / trang</option>
                            <option value={16}>16 sản phẩm / trang</option>
                            <option value={24}>24 sản phẩm / trang</option>
                        </select>

                        {/* số trang */}
                        <div className="flex gap-2 flex-wrap justify-center">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors min-w-[40px] ${page === i + 1
                                            ? `bg-${THEME_COLOR}-500 text-white shadow-md`
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}