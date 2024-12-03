import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BiErrorCircle } from 'react-icons/bi';

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
  max-width: 400px;
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
  text-align: center;
  box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(motion.button)<{ $variant?: 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme, $variant }) =>
    $variant === 'danger' ? '#dc3545' : theme.colors.primary};
  color: white;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.primary};
  transition: all 0.3s ease;
  min-width: 100px;
  font-size: 0.9375rem;

  &:hover {
    background: ${({ theme, $variant }) =>
      $variant === 'danger' ? '#c82333' : `${theme.colors.primary}dd`};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const IconWrapper = styled.div`
  color: #dc3545;
  margin-bottom: 1rem;
  justify-self: center;

  svg {
    width: 48px;
    height: 48px;
  }
`;

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}) => {
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
            <IconWrapper>
              <BiErrorCircle />
            </IconWrapper>
            <Title>Delete Confirmation</Title>
            <Message>
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </Message>
            <ButtonGroup>
              <Button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </Button>
              <Button
                $variant="danger"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Delete
              </Button>
            </ButtonGroup>
          </Modal>
        </ModalWrapper>
      </Overlay>
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;