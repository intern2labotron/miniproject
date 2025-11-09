import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { RefreshIcon } from "./components/ui/RefreshIcon.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";

const BASE_URL = "http://localhost:8080";

function InventoryListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState([]);
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
      // สมมติว่าสินค้าแนะนำคือ 4 รายการแรก หรือสินค้าที่มีจำนวนเหลือน้อย
      setRecommended(data.slice(0, 4)); 
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
    <>
      {/* Header */}
      <header className="bg-white text-primary p-4 sm:p-5 flex justify-between items-center shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <h1 className="text-xl sm:text-2xl font-bold">Labotron Group - ระบบสต็อกสินค้า</h1>
        <button 
          onClick={fetchProducts} 
          disabled={loading}
          className="flex items-center gap-2 text-sm font-medium text-secondary px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">
            {loading ? 'กำลังโหลด...' : 'รีเฟรช'}
          </span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 w-full max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        {/* Recommended Products Section */}
        {!loading && recommended.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">สินค้าแนะนำ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommended.map((p) => (
                <div key={p.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden group transition-shadow duration-300 hover:shadow-xl">
                  <div className="bg-gray-100 h-40 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">ไม่มีรูปภาพ</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 truncate">{p.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {p.sku}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-semibold text-secondary">{p.price.toLocaleString()} ฿</span>
                      <Link to={`/product/${p.id}`} className="text-sm font-semibold text-white bg-secondary px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        ดูรายละเอียด
                      </Link>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">คงเหลือ: {p.qty} ชิ้น</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-8">
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
              <caption className="text-xl font-bold text-gray-800 p-4 sm:p-6 text-left">รายการสินค้าทั้งหมด</caption>
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
                    <tr key={p.id} className="border-t border-gray-200 even:bg-gray-50/50 hover:bg-blue-50/50 transition-colors">
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
      <footer className="bg-gray-100 border-t border-gray-200 text-gray-600 p-4 text-center text-sm">
        Labotron Group &copy; {new Date().getFullYear()} - เชื่อมต่อ API: {BASE_URL}
      </footer>
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <Routes>
        <Route path="/" element={<InventoryListPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </div>
  );
}


export default App;
