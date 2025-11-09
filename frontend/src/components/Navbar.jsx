import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default function Navbar() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'หน้าแรก', href: '#home' },
    { name: 'สินค้าทั้งหมด', href: '#all-products' },
    { name: 'คู่มือและนโยบาย', href: '#guide-policy' },
    { name: 'บทความและกิจกรรม', href: '#articles' },
  ];

  return (
    <nav className="bg-gray-100 border-b border-gray-200 w-full z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Left side links */}
          <div className="flex space-x-6">
            {navLinks.map((link) => (link.href.startsWith('/') ? 
              <Link key={link.name} to={link.href} className="text-gray-600 hover:text-primary text-sm font-medium transition-colors">{link.name}</Link> :
              <a key={link.name} href={link.href} className="text-gray-600 hover:text-primary text-sm font-medium transition-colors">{link.name}</a>
            ))}
            <Link to="/contact" className="text-gray-600 hover:text-primary text-sm font-medium transition-colors">ติดต่อเรา</Link>
          </div>
          {/* Right side member menu */}
          <div className="flex items-center gap-4">
            <Link to="/#" className="text-gray-600 hover:text-primary text-sm font-medium transition-colors">
              เมนูสมาชิก
            </Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-primary">
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}