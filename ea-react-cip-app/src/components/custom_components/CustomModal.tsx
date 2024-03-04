// CustomModal.tsx
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { CustomModalProps } from '../../types/public-types';

const CustomModal: React.FC<CustomModalProps> = ({ 
  showModal, 
  closeModal, 
  sliderValue, 
  handleSliderChange, 
  handleSave 
  }) => {
  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Total Cost</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Adjust Cost:</Form.Label>
            <Form.Control 
              type="range" 
              value={sliderValue} 
              onChange={handleSliderChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
