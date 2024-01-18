// CustomModal.tsx
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CustomModal = ({ showModal, closeModal, sliderValue, handleSliderChange }) => {
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
              min={1000}
              max={50000}
              step={500}
            />
            <Form.Control value={sliderValue}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="primary" onClick={() => {/* Handle save logic */}}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
