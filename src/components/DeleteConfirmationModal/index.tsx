import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { GhostButton } from '../ui';
import { spring, fade } from '../../styles/motion';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.scrim};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const Modal = styled(motion.div)`
  width: min(100%, 400px);
  display: grid;
  gap: 0.75rem;
  padding: 1.75rem;
  text-align: center;
  border-radius: var(--radius-l);
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.line};
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.6);

  h2 {
    font-size: 1.5rem;
  }

  p {
    color: ${({ theme }) => theme.colors.ink2};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 0.5rem;
`;

const DangerButton = styled(GhostButton)`
  color: ${({ theme }) => theme.colors.danger};
  border-color: color-mix(in srgb, ${({ theme }) => theme.colors.danger} 50%, transparent);

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.danger};
    border-color: ${({ theme }) => theme.colors.danger};
    background: color-mix(in srgb, ${({ theme }) => theme.colors.danger} 10%, transparent);
  }
`;

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title }) => {
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
          aria-labelledby="delete-title"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={spring}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id="delete-title">Let this one go?</h2>
          <p>“{title}” and any note you wrote will be pulled from the Garden.</p>
          <Actions>
            <GhostButton onClick={onClose} whileTap={{ scale: 0.97 }}>Keep it</GhostButton>
            <DangerButton
              onClick={() => {
                onConfirm();
                onClose();
              }}
              whileTap={{ scale: 0.97 }}
            >
              Remove
            </DangerButton>
          </Actions>
        </Modal>
      </Overlay>
    )}
  </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
