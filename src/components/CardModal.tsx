import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { CardDto, updateCard } from '../api/cards';
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

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description);
  }, [card]);

  const handleSave = async () => {
    if (!userId) return;
    await updateCard(userId, card.columnId, card.id, { title, description });
    onRequestClose();
    window.location.reload(); // обновляем данные
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
        style={{ width: '100%', padding: 8, height: 100 }}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button onClick={onRequestClose}>Cancel</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </Modal>
  );
};

export default CardModal;
