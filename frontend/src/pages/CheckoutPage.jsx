import React from 'react';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "http://localhost:8080";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirmOrder = async () => {
    const orderData = {
      customer: { name: "John Doe", address: "123 Main St" },
      items: cartItems,
      total: totalPrice,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error("Order failed");
      
      alert("สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ");
      clearCart();
      navigate('/');
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">ยืนยันการสั่งซื้อและชำระเงิน</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">ข้อมูลการจัดส่ง</h2>
          <p className="text-gray-600">ส่วนนี้สำหรับฟอร์มกรอกที่อยู่ (จำลอง)</p>
          {/* Placeholder for shipping form */}
        </div>
        
        {/* Payment Method */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">ช่องทางการชำระเงิน</h2>
          <p className="text-gray-600 mb-4">กรุณาสแกน QR Code ด้านล่างเพื่อชำระเงิน</p>
          <div className="flex justify-center">
            <img src="https://via.placeholder.com/250x250.png?text=Mock+QR+Code" alt="QR Code" />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <button onClick={handleConfirmOrder} className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-secondary transition-colors">
          ยืนยันการสั่งซื้อ
        </button>
      </div>
    </main>
  );
}