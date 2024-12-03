import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit } from 'react-icons/fa';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  overflow-y: auto;
`;

const ModalWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: auto;
  display: flex;
  min-height: 100%;
  padding: 1rem;
  align-items: center;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: auto;
    padding: 2rem 1rem;
  }
`;

const Modal = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.text.primary}22;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1.5rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled(motion.button)<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme, $variant }) =>
    $variant === 'secondary' ? theme.colors.background.secondary : theme.colors.primary};
  color: ${({ theme, $variant }) =>
    $variant === 'secondary' ? theme.colors.text.primary : 'white'};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.primary};
  transition: all 0.3s ease;
  min-width: 100px;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

interface EditNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string) => void;
  initialNotes: string;
  title: string;
}

const EditNotesModal: React.FC<EditNotesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNotes,
  title,
}) => {
  const [notes, setNotes] = useState(initialNotes);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalWrapper>
          <Modal
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Title>
              <FaEdit /> Edit Notes for "{title}"
            </Title>
            <TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes here..."
              autoFocus
            />
            <ButtonGroup>
              <Button
                $variant="secondary"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </Button>
              <Button
                $variant="primary"
                onClick={() => {
                  onSave(notes);
                  onClose();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save Notes
              </Button>
            </ButtonGroup>
          </Modal>
        </ModalWrapper>
      </Overlay>
    </AnimatePresence>
  );
};

export default EditNotesModal;