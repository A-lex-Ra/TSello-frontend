// src/components/CardModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { CardDto, updateCard, deleteCard } from '../api/cards';
import useAuth from '../hooks/useAuth';

Modal.setAppElement('#root');

interface CardModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  card: CardDto;
}

const CardModal: React.FC<CardModalProps> = ({ isOpen, onRequestClose, card }) => {
  const { userId } = useAuth();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [comments, setComments] = useState(card.comments || '');

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description);
    setComments(card.comments || '');
  }, [card]);

  const handleSave = async () => {
    if (!userId) return;
    await updateCard(userId, card.columnId, card.id, { title, description, comments });
    onRequestClose();
    window.location.reload(); // пока просто перезагружаем
  };

  const handleDelete = async () => {
    if (!userId) return;
    if (confirm('Are you sure you want to delete this card?')) {
      await deleteCard(userId, card.columnId, card.id);
      onRequestClose();
      window.location.reload();
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={{ content: { maxWidth: 500, margin: 'auto' } }}>
      <h2>Edit Card</h2>
      <input
        style={{ width: '100%', padding: 8, marginBottom: 8 }}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        style={{ width: '100%', padding: 8, height: 80, marginBottom: 8 }}
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description..."
      />
      <textarea
        style={{ width: '100%', padding: 8, height: 80, marginBottom: 8 }}
        value={comments}
        onChange={e => setComments(e.target.value)}
        placeholder="Comments..."
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={handleDelete} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '8px 16px' }}>
          🗑️ Delete
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onRequestClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </Modal>
  );
};

export default CardModal;
