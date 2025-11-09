import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { getItems, addItem } from '../services/api';
import ItemForm from '../components/ItemForm';
import ItemList from '../components/ItemList';
import ErrorMessage from '../components/ErrorMessage';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch {
      setError('Failed to load items');
    }
  };

  const handleAdd = async (item) => {
    try {
      await addItem(item);
      loadItems();
      setError('');
    } catch {
      setError('Error adding item');
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4 text-center">Inventory Manager</h1>
          <ItemForm onAdd={handleAdd} />
          <ErrorMessage message={error} />
          <ItemList items={items} />
        </CardContent>
      </Card>
    </div>
  );
}
