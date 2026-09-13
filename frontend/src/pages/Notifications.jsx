import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Notifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/notifications').then((res) => setItems(res.data)).catch(() => {});
  }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setItems(items.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <div className="container py-4" style={{ maxWidth: 640 }}>
      <h2 className="h4 mb-3">Notifications</h2>
      {items.length === 0 && <p className="text-muted">You're all caught up.</p>}
      {items.map((n) => (
        <div key={n.id} className={`card card-civic p-3 mb-2 ${n.isRead ? '' : 'border-2'}`}
          style={!n.isRead ? { borderColor: 'var(--cc-teal)' } : {}}
          onClick={() => markRead(n.id)} role="button">
          <strong>{n.title}</strong>
          <p className="mb-1 small">{n.message}</p>
          <span className="text-muted small">{new Date(n.createdAt).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
