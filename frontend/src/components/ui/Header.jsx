import React from "react";

export default function Header() {
  return (
    <header className="bg-primary text-white p-6 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">Labotron Group – ระบบสต็อกสินค้า</h1>
      <button className="px-4 py-2 bg-secondary hover:bg-secondary/90 rounded">
        รีเฟรชข้อมูล
      </button>
    </header>
  );
}
