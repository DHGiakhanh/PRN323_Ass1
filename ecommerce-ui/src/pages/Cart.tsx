import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type CartItem = { productId: number; name: string; price: number; quantity: number };

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    if (raw) setItems(JSON.parse(raw));
  }, []);

  const update = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const remove = (id: number) => update(items.filter(i => i.productId !== id));
  const changeQty = (id: number, qty: number) => update(items.map(i => i.productId === id ? { ...i, quantity: qty } : i));

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        {items.length === 0 ? (
          <p>Your cart is empty. <Link to="/">Browse products</Link></p>
        ) : (
          <div>
            <ul className="space-y-4">
              {items.map(it => (
                <li key={it.productId} className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">{it.name}</div>
                    <div className="text-sm text-gray-500">${it.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="number" min={1} value={it.quantity} onChange={e => changeQty(it.productId, Number(e.target.value))} className="w-20 p-1 border rounded" />
                    <button onClick={() => remove(it.productId)} className="text-red-500">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between items-center">
              <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
              <button onClick={() => nav('/checkout')} className="bg-pink-600 text-white px-4 py-2 rounded">Checkout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
