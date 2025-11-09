const API_BASE_URL =
  typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL
    ? process.env.REACT_APP_API_BASE_URL
    : 'http://localhost:8080';

export async function getItems() {
  const res = await fetch(`${API_BASE_URL}/items`);
  return await res.json();
}

export async function addItem(item) {
  const res = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  return await res.json();
}
