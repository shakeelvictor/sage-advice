import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, GhostButton, Eyebrow } from '../ui';
import { spring, fade } from '../../styles/motion';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  padding: 1rem;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.scrim};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const Modal = styled(motion.div)`
  width: min(100%, 560px);
  display: grid;
  gap: 1rem;
  padding: 1.75rem;
  border-radius: var(--radius-l);
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.line};
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.6);

  h2 {
    font-size: 1.5rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 180px;
  padding: 1rem;
  border-radius: var(--radius-m);
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.ground};
  color: ${({ theme }) => theme.colors.ink};
  line-height: 1.6;
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.ink3};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.amber};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

interface EditNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string) => void;
  initialNotes: string;
  title: string;
}

const EditNotesModal: React.FC<EditNotesModalProps> = ({ isOpen, onClose, onSave, initialNotes, title }) => {
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay variants={fade} initial="initial" animate="animate" exit="exit" onClick={onClose}>
          <Modal
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-notes-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={spring}
            onClick={(e) => e.stopPropagation()}
          >
            <Eyebrow>Your note</Eyebrow>
            <h2 id="edit-notes-title">{title}</h2>
            <TextArea
              id="edit-notes-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did this stir? Where does it apply in your life right now?"
              autoFocus
            />
            <Actions>
              <GhostButton onClick={onClose} whileTap={{ scale: 0.97 }}>Cancel</GhostButton>
              <Button
                onClick={() => {
                  onSave(notes);
                  onClose();
                }}
                whileTap={{ scale: 0.97 }}
              >
                Save note
              </Button>
            </Actions>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default EditNotesModal;
