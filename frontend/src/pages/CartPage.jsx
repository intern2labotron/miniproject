import React from 'react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">ตะกร้าสินค้าของคุณว่างเปล่า</h1>
        <Link to="/" className="text-secondary hover:underline">กลับไปเลือกซื้อสินค้า</Link>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">ตะกร้าสินค้า</h1>
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.price.toLocaleString()} ฿ x {item.quantity}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} ฿</p>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 font-bold text-xl">
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">ยอดรวมทั้งหมด:</span>
          <span className="text-2xl font-bold text-primary">{totalPrice.toLocaleString()} ฿</span>
        </div>
        <Link to="/checkout" className="mt-6 block w-full bg-primary text-white text-center font-semibold py-3 rounded-lg hover:bg-secondary transition-colors">
          ดำเนินการชำระเงิน
        </Link>
      </div>
    </main>
  );
}