import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card.jsx";

const BASE_URL = "http://localhost:8080";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = products.filter(p =>
    `${p.name} ${p.sku || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary text-white p-4 sm:p-6 flex justify-between items-center shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold">Labotron Group - ระบบสต็อกสินค้า</h1>
        <button 
          onClick={fetchProducts} 
          disabled={loading}
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors duration-300 disabled:bg-gray-400"
        >
          {loading ? 'กำลังโหลด...' : 'รีเฟรช'}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 w-full max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <input
              type="text"
              placeholder="ค้นหาสินค้าด้วยชื่อหรือ SKU..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-2 border-gray-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-secondary focus:border-transparent transition"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-4 sm:px-6 py-3 font-medium">#</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">ชื่อสินค้า</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">SKU</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-right">ราคา (บาท)</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-right">จำนวนคงเหลือ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="5" className="px-4 sm:px-6 py-4">
                        <div className="relative w-full h-5 bg-gray-200 rounded overflow-hidden">
                          <div className="absolute inset-0 bg-gray-300 animate-[shimmer_1.5s_infinite]"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filtered.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 text-gray-500">{idx + 1}</td>
                      <td className="px-4 sm:px-6 py-4 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 sm:px-6 py-4 text-gray-500">{p.sku}</td>
                      <td className="px-4 sm:px-6 py-4 text-gray-900 text-right">{p.price.toLocaleString()}</td>
                      <td className="px-4 sm:px-6 py-4 text-gray-900 text-right font-semibold">{p.qty}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {!loading && filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">ไม่พบข้อมูลสินค้า</p>
                <p>ลองเปลี่ยนคำค้นหาของคุณ</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white p-4 text-center text-sm">
        Labotron Group &copy; {new Date().getFullYear()} - เชื่อมต่อ API: {BASE_URL}
      </footer>

    </div>
  );
}

export default App;
