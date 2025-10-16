import { useEffect, useState } from "react";
import api from "../api";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get('/Orders/my').then(res => setOrders(res.data)).catch(()=>{});
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        {orders.length === 0 ? <p>No orders yet.</p> : (
          <ul className="space-y-4">
            {orders.map(o => (
              <li key={o.id} className="border rounded p-4">
                <div className="flex justify-between mb-2">
                  <div>Order #{o.id}</div>
                  <div className="font-bold">{o.status}</div>
                </div>
                <div className="text-sm text-gray-600">Total: ${Number(o.totalAmount).toFixed(2)}</div>
                <ul className="mt-2">
                  {o.items?.map((it: any) => (
                    <li key={it.id} className="text-sm">Product {it.productId} x {it.quantity} @ ${Number(it.unitPrice).toFixed(2)}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
