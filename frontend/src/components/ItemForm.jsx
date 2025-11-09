import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';

export default function ItemForm({ onAdd }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !quantity) return;
    onAdd({ name, quantity: parseInt(quantity) });
    setName('');
    setQuantity('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <input
        className="border rounded p-2 w-full mb-2"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border rounded p-2 w-full mb-2"
        placeholder="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <Button className="w-full" type="submit">Add Item</Button>
    </form>
  );
}
