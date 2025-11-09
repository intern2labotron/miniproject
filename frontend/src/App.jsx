import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { RefreshIcon } from "@/components/ui/RefreshIcon.jsx";
import ProductDetailPage from "@/pages/ProductDetailPage.jsx";
import Navbar from "@/components/Navbar.jsx";
import CartPage from "@/pages/CartPage.jsx";
import CheckoutPage from "@/pages/CheckoutPage.jsx";
import ContactPage from "@/pages/ContactPage.jsx";

const BASE_URL = "http://localhost:8080";

// ไอคอนลูกศรสำหรับสไลด์
const ArrowIcon = ({ direction = 'left', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" {...props}>
    {direction === 'left' ? (
      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
    ) : (
      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
    )}
  </svg>
);

function InventoryListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');
  const [isPaused, setIsPaused] = useState(false);

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
      setRecommended(data.slice(0, 6)); // เพิ่มจำนวนสินค้าแนะนำเป็น 6 ชิ้น
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = products.filter(p =>
    `${p.name} ${p.sku || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  const getStockStatusColor = (qty, maxQty) => {
    if (maxQty === 0) return 'text-gray-900'; // ป้องกันการหารด้วยศูนย์
    const percentage = (qty / maxQty) * 100;
    if (qty > maxQty) {
      return 'text-yellow-600'; // สต็อกเกิน
    }
    if (percentage < 10) {
      return 'text-red-600'; // สต็อกน้อยกว่า 10%
    }
    return 'text-gray-900'; // สต็อกปกติ
  };
  const handleNextAd = () => {
    setSlideDirection('right');
    setCurrentAdIndex((prevIndex) => {
      if (recommended.length === 0) return 0;
      return (prevIndex + 1) % recommended.length;
    });
  };

  const handlePrevAd = () => {
    setSlideDirection('left');
    if (recommended.length === 0) return;
    setCurrentAdIndex((prevIndex) => (prevIndex - 1 + recommended.length) % recommended.length);
  };

  // useEffect สำหรับการเลื่อนสไลด์อัตโนมัติ
  useEffect(() => {
    // ถ้าผู้ใช้กำลังชี้เมาส์อยู่ หรือไม่มีสินค้าแนะนำ ให้หยุดการทำงาน
    if (isPaused || recommended.length === 0) {
      return;
    }

    const intervalId = setInterval(() => {
      handleNextAd();
    }, 5000); // 5000 มิลลิวินาที = 5 วินาที

    return () => clearInterval(intervalId); // เคลียร์ interval เมื่อ component unmount หรือ state เปลี่ยน
  }, [isPaused, recommended.length]); // ให้ effect นี้ทำงานใหม่เมื่อค่าเหล่านี้เปลี่ยน

  return (
    <>
      {/* Header */}
      <header id="home" className="bg-white text-primary p-4 sm:p-5 flex justify-between items-center shadow-sm border-b border-gray-200 sticky top-0 z-20">
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
          <div id="recommended-products" className="mb-8 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">สินค้าแนะนำ</h2>
              <div className="flex gap-2">
                <button onClick={handlePrevAd} className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors">
                  <ArrowIcon direction="left" />
                </button>
                <button onClick={handleNextAd} className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors">
                  <ArrowIcon direction="right" />
                </button>
              </div>
            </div>
            {/* Advertisement-style Slider */}
            <div 
              className="relative bg-white rounded-lg border border-gray-200 overflow-hidden group transition-shadow duration-300 hover:shadow-xl h-[450px] sm:h-[400px]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {recommended.map((p, index) => {
                const isActive = index === currentAdIndex;
                let transformClass = '';
                if (isActive) {
                  transformClass = 'translate-x-0 opacity-100';
                } else if (index === (currentAdIndex - 1 + recommended.length) % recommended.length && slideDirection === 'right' || index === (currentAdIndex + 1) % recommended.length && slideDirection === 'left') {
                  transformClass = '-translate-x-full opacity-0';
                } else {
                  transformClass = 'translate-x-full opacity-0';
                }

                return (
                  <div key={p.id} className={`absolute inset-0 transition-all duration-500 ease-in-out ${transformClass}`}>
                    <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2">
                      <div className="bg-gray-100 h-full">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6 flex flex-col justify-center">
                        <p className="text-sm font-semibold text-secondary uppercase tracking-wider">{p.category}</p>
                        <h3 className="font-bold text-2xl lg:text-3xl text-gray-900 mt-2">{p.name}</h3>
                        <p className="text-lg text-gray-600 mt-4">{p.price.toLocaleString()} ฿</p>
                        <Link to={`/product/${p.id}`} className="mt-6 text-white bg-primary hover:bg-secondary transition-colors font-semibold py-3 px-6 rounded-lg text-center w-full sm:w-auto">
                          ดูรายละเอียดสินค้า
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div id="all-products" className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-8">
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
                  <th className="px-4 sm:px-6 py-3 font-medium">หมวดหมู่</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">SKU</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-right">ราคา (บาท)</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-right">จำนวนคงเหลือ</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">วันหมดอายุ</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-center">การกระทำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="8" className="px-4 sm:px-6 py-4">
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
                      <td className="px-4 sm:px-6 py-4 text-gray-600">{p.category}</td>
                      <td className="px-4 sm:px-6 py-4 text-gray-500">{p.sku}</td>
                      <td className="px-4 sm:px-6 py-4 text-gray-900 text-right">{p.price.toLocaleString()}</td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <span className={getStockStatusColor(p.qty, p.maxQty)}>{p.qty}</span>
                        <span className="text-xs text-gray-500"> / {p.maxQty}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600">
                        {p.expiryDate || '-'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <Link to={`/product/${p.id}`} className="text-sm font-semibold text-secondary hover:text-primary hover:underline transition-colors">
                          ดูรายละเอียด
                        </Link>
                      </td>
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

        {/* Guide and Policy Section */}
        <div id="guide-policy" className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-12 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">คู่มือการซื้อและนโยบายร้านค้า</h2>
          <div className="prose max-w-none text-gray-600">
            <h3 className="font-semibold">วิธีการสั่งซื้อสินค้า</h3>
            <ol>
              <li>เลือกสินค้าที่ท่านต้องการและตรวจสอบรายละเอียด</li>
              <li>ติดต่อฝ่ายขายของเราผ่านทางโทรศัพท์หรืออีเมลเพื่อยืนยันคำสั่งซื้อและสต็อกสินค้า</li>
              <li>ดำเนินการชำระเงินตามช่องทางที่บริษัทกำหนด</li>
              <li>รอรับสินค้าภายใน 3-5 วันทำการ</li>
            </ol>
            <h3 className="font-semibold mt-6">นโยบายการรับประกันสินค้า</h3>
            <p>สินค้าทุกชิ้นจาก Labotron Group มีการรับประกันคุณภาพเป็นระยะเวลา 1 ปีนับจากวันที่ซื้อ หากพบปัญหาจากการผลิต ท่านสามารถติดต่อเราเพื่อดำเนินการเปลี่ยนหรือซ่อมแซมได้ทันที (การรับประกันไม่ครอบคลุมความเสียหายที่เกิดจากการใช้งานผิดประเภท)</p>
          </div>
        </div>

        {/* Articles and Activities Section */}
        <div id="articles" className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-12 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">บทความและกิจกรรม</h2>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg text-secondary">เคล็ดลับการดูแลเครื่องวัดความดันให้ใช้งานได้ยาวนาน</h3>
              <p className="text-sm text-gray-600 mt-2">การดูแลรักษาเครื่องวัดความดันอย่างถูกวิธีไม่เพียงแต่จะช่วยยืดอายุการใช้งาน แต่ยังช่วยให้ค่าที่วัดได้มีความแม่นยำอยู่เสมอ ควรเก็บเครื่องในที่แห้งและไม่โดนแสงแดดโดยตรง...</p>
              <a href="/#" className="text-sm font-semibold text-primary hover:underline mt-2 inline-block">อ่านต่อ &rarr;</a>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-secondary">กิจกรรมอบรมการใช้งานเครื่องมือแพทย์สำหรับคลินิก</h3>
              <p className="text-sm text-gray-600 mt-2">Labotron Group จะจัดกิจกรรมอบรมการใช้งานเครื่องมือแพทย์เบื้องต้นสำหรับบุคลากรทางการแพทย์ในคลินิกและสถานพยาบาลขนาดเล็ก ในวันที่ 25 ธันวาคมนี้ สนใจเข้าร่วมสามารถลงทะเบียนได้ที่...</p>
              <a href="/#" className="text-sm font-semibold text-primary hover:underline mt-2 inline-block">อ่านต่อ &rarr;</a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold text-primary">Labotron Group</h3>
              <p className="mt-2 text-sm text-gray-500">
                ผู้นำเข้าและจัดจำหน่ายเครื่องมือและอุปกรณ์ทางการแพทย์ที่ทันสมัย
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800">ช่องทางติดต่อ</h3>
              <dl className="mt-4 space-y-4 text-sm text-gray-600">
                <div>
                  <dt className="font-semibold">ที่อยู่:</dt>
                  <dd className="mt-1">123 ถนนสุขุมวิท, แขวงคลองเตย, เขตคลองเตย, กรุงเทพฯ 10110</dd>
                </div>
                <div>
                  <dt className="font-semibold">โทรศัพท์:</dt>
                  <dd className="mt-1"><a href="tel:+6621234567" className="hover:text-secondary">02-123-4567</a></dd>
                </div>
                <div>
                  <dt className="font-semibold">อีเมล:</dt>
                  <dd className="mt-1"><a href="mailto:contact@labotrongroup.com" className="hover:text-secondary">contact@labotrongroup.com</a></dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Labotron Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <Navbar />
      <Routes>
        <Route path="/" element={<InventoryListPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </div>
  );
}


export default App;
