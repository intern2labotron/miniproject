import React, { useState } from 'react';

const BASE_URL = "http://localhost:8080";

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('กำลังส่ง...');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Send message failed");
      
      setStatus('ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุด');
      e.target.reset();
    } catch (error) {
      setStatus('เกิดข้อผิดพลาด: ไม่สามารถส่งข้อความได้');
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">ติดต่อเรา</h1>
      <p className="text-center text-gray-600 mb-8">มีคำถามหรือข้อเสนอแนะ? กรอกฟอร์มด้านล่างเพื่อส่งข้อความถึงเรา</p>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
          <input type="text" name="name" id="name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">อีเมล</label>
          <input type="email" name="email" id="email" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">ข้อความ</label>
          <textarea name="message" id="message" rows="4" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"></textarea>
        </div>
        <div>
          <button type="submit" className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-secondary transition-colors">
            ส่งข้อความ
          </button>
        </div>
        {status && <p className="text-center text-sm text-gray-600 mt-4">{status}</p>}
      </form>
    </main>
  );
}