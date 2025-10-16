import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function Checkout() {
  const [items, setItems] = useState<any[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    if (raw) setItems(JSON.parse(raw));
  }, []);

  const place = async () => {
    try {
      const payload = { items: items.map(i => ({ productId: i.productId, quantity: i.quantity })) };
      await api.post('/Orders/place', payload);
      localStorage.removeItem('cart');
      toast.success('Order placed');
      nav('/orders');
    } catch (err) {
      toast.error('Failed to place order');
    }
  };

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="p-8 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        {items.length === 0 ? <p>No items to checkout.</p> : (
          <>
            <ul className="space-y-2 mb-4">
              {items.map(it => (
                <li key={it.productId} className="flex justify-between">
                  <div>{it.name} x {it.quantity}</div>
                  <div>${(it.price * it.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold">Total: ${total.toFixed(2)}</div>
              <button onClick={place} className="bg-pink-600 text-white px-4 py-2 rounded">Place Order</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
