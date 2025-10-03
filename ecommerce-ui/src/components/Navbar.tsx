import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center shadow-md">
      <h1 className="text-white text-xl font-bold">🛍 My Shop</h1>
      <div className="space-x-4">
        <Link to="/" className="text-white hover:underline">
          Home
        </Link>
        <Link to="/create" className="text-white hover:underline">
          Add Product
        </Link>
      </div>
    </nav>
  );
}
