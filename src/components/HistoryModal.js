import React, { useState } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

function HistoryModal({ history, setWeatherData }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const selectHistoryItem = (location) => {
    setWeatherData(location);
    handleClose();
  };

  return (
    <>
      <div className="history-button-row">
        <Button className="history-btn" variant="info" onClick={handleShow}>
          View History
        </Button>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Search History</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ListGroup>
            {history.map((location, index) => (
              <ListGroup.Item
                key={index}
                action
                onClick={() => selectHistoryItem(location)}
              >
                {location}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default HistoryModal;