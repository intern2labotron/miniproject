import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const BASE_URL = "http://localhost:8080";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BASE_URL}/api/products/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch product with ID ${id}`);
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // useEffect to hide the confirmation message after a delay
  useEffect(() => {
    if (showConfirmation) {
      const timer = setTimeout(() => {
        setShowConfirmation(false);
      }, 2000); // Hide after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showConfirmation]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setShowConfirmation(true);
  };

  const getStockStatusColor = (qty, maxQty) => {
    if (!maxQty || maxQty === 0) return 'text-accent';
    const percentage = (qty / maxQty) * 100;
    if (qty > maxQty) {
      return 'text-yellow-600'; // สต็อกเกิน
    }
    if (percentage < 10) {
      return 'text-red-600'; // สต็อกน้อยกว่า 10%
    }
    return 'text-accent'; // สต็อกปกติ
  };
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-secondary hover:underline mb-6 inline-block">
          &larr; กลับไปหน้ารายการสินค้า
        </Link>

        {loading && (
          <div className="text-center py-10">
            <p className="text-lg">กำลังโหลดข้อมูลสินค้า...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
            <p className="font-bold">เกิดข้อผิดพลาด</p>
            <p>{error}</p>
          </div>
        )}

        {product && (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-gray-100">
                 <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                 />
              </div>
              <div className="p-8 flex flex-col">
                <p className="text-sm font-semibold text-secondary uppercase tracking-wider">{product.category}</p>
                <h1 className="text-3xl font-bold text-primary mt-1 mb-2">{product.name}</h1>
                <p className="text-gray-500 mb-4">SKU: {product.sku}</p>
                
                <div className="my-6">
                  <span className="text-4xl font-bold text-secondary">{product.price.toLocaleString()} ฿</span>
                </div>

                <div className="h-8 mb-2">
                  {showConfirmation && (
                    <div className="text-center text-green-600 font-semibold transition-opacity duration-300">
                      ✓ เพิ่มสินค้าลงในตะกร้าแล้ว!
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  เพิ่มลงตะกร้า
                </button>

                <div className="mt-auto pt-6 border-t border-gray-200">
                  <p className="text-lg font-semibold text-gray-800">
                    จำนวนคงเหลือ: <span className={`font-bold ${getStockStatusColor(product.qty, product.maxQty)}`}>{product.qty}</span> / {product.maxQty} ชิ้น
                  </p>
                  {(product.productionDate || product.expiryDate) && (
                    <div className="mt-4 text-sm text-gray-500 space-y-1">
                      {product.productionDate && (
                        <p>
                          <span className="font-semibold text-gray-700">วันที่ผลิต:</span> {product.productionDate}
                        </p>
                      )}
                      {product.expiryDate && (
                        <p><span className="font-semibold text-gray-700">วันหมดอายุ:</span> {product.expiryDate}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}