import React from 'react';

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return <p className="text-red-500 mb-2 text-center">{message}</p>;
}
