import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BASE_URL = "http://localhost:8080";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <div className="p-8 bg-gray-100 flex items-center justify-center">
                 <span className="text-gray-400">ไม่มีรูปภาพ</span>
              </div>
              <div className="p-8 flex flex-col">
                <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>
                <p className="text-gray-500 mb-4">SKU: {product.sku}</p>
                
                <div className="my-6">
                  <span className="text-4xl font-bold text-secondary">{product.price.toLocaleString()} ฿</span>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200">
                  <p className="text-lg font-semibold text-gray-800">จำนวนคงเหลือ: <span className="text-accent font-bold">{product.qty}</span> ชิ้น</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}