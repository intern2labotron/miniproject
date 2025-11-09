import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

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
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white p-6 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">Labotron Group - ระบบสต็อกสินค้า</h1>
        <Button onClick={fetchProducts} className="bg-green-500 hover:bg-green-600">รีเฟรช</Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 w-full">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}
        <Card className="w-full">
          <CardContent>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="ค้นหาชื่อหรือ SKU"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
              <table className="w-full table-auto border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">ชื่อ</th>
                    <th className="px-3 py-2">SKU</th>
                    <th className="px-3 py-2">ราคา</th>
                    <th className="px-3 py-2">จำนวน</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, idx) => (
                    <tr key={p.id} className="border-b">
                      <td className="px-3 py-2">{idx + 1}</td>
                      <td className="px-3 py-2">{p.name}</td>
                      <td className="px-3 py-2">{p.sku}</td>
                      <td className="px-3 py-2">{p.price}</td>
                      <td className="px-3 py-2">{p.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-blue-700 text-white p-4 text-center">
        Labotron Group &copy; {new Date().getFullYear()} - เชื่อมต่อ API: {BASE_URL}
      </footer>

      {loading && (
        <div className="fixed bottom-4 right-4 bg-white shadow rounded px-3 py-2">Loading...</div>
      )}
    </div>
  );
}

export default App;
