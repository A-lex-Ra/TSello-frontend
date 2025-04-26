import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { getColumns } from '../api/columns';

interface Card {
  id: number;
  title: string;
  description: string;
  order: number;
  checked: boolean;
}

interface Column {
  id: number;
  title: string;
  cards: Card[];
}

const BoardPage: React.FC = () => {
  const { userId } = useAuth();
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    if (!userId) return;
    getColumns(userId).then(setColumns).catch(console.error);
  }, [userId]);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 16 }}>Your Board</h2>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto' }}>
        {columns.map(col => (
          <div key={col.id} style={{
            minWidth: 300,
            backgroundColor: '#f0f0f0',
            borderRadius: 6,
            padding: 12,
            flexShrink: 0,
          }}>
            <h3 style={{ marginTop: 0 }}>{col.title}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {col.cards.map(card => (
                <div key={card.id} style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  padding: 8,
                }}>
                  <strong>{card.title}</strong>
                  <p style={{ margin: '4px 0' }}>{card.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button style={{ fontSize: 12 }}>✏️</button>
                    <button style={{ fontSize: 12 }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            <button style={{
              marginTop: 12,
              padding: '6px 10px',
              backgroundColor: '#ddd',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}>
              ➕ Add card
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardPage;
