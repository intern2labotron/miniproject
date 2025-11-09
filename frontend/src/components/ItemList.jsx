import React from 'react';

export default function ItemList({ items }) {
  return (
    <ul className="divide-y divide-gray-200">
      {items.map((item) => (
        <li key={item.id} className="flex justify-between py-2">
          <span>{item.name}</span>
          <span className="font-semibold">{item.quantity}</span>
        </li>
      ))}
    </ul>
  );
}
