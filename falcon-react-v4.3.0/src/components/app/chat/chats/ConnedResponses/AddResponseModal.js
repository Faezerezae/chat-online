import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import AxiosInstance from '../../../../../axios/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';

const AddResponseModal = ({
    isOpen,
    onRequestClose,
    categoriesCannedResponses,
    onCategoryAdded,
    onResponseAdded
}) => {
    const [categoryCannedResponse, setCategory] = useState('');
    const [cannedResponse, setCannedResponse] = useState('');
    const [newCategory, setNewCategory] = useState(false);

    const handleCategoryChange = e => {
        const value = e.target.value;
        if (categoriesCannedResponses.includes(value)) {
            setNewCategory(false);
            setCategory(value);
        } else {
            setNewCategory(true);
            setCategory(value);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (newCategory) {
                await AxiosInstance.post('/categoriesCannedResponses', {
                    name: categoryCannedResponse
                });
                onCategoryAdded(categoryCannedResponse);
            }
            await AxiosInstance.post('/responses', {
                categoryName: categoryCannedResponse,
                cannedResponse
            });
            alert('CannedResponse added successfully');
            setCategory('');
            setCannedResponse('');
            onRequestClose();
            onResponseAdded(); // Trigger a refresh of the cannedResponse list
        } catch (error) {
            console.error(
                'There was an error adding the cannedResponse!',
                error
            );
        }
    };

    return (
        <Modal
            show={isOpen}
            onHide={onRequestClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop={true}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Canned Response</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Category:</Form.Label>
                        <Form.Control
                            list="categoriesCannedResponses"
                            value={categoryCannedResponse}
                            onChange={handleCategoryChange}
                            placeholder="Type or select a category"
                        />
                        <datalist id="categoriesCannedResponses">
                            {categoriesCannedResponses.map(cat => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Canned Response:</Form.Label>
                        <Form.Control
                            type="text"
                            value={cannedResponse}
                            onChange={e => setCannedResponse(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add Canned Response
                    </Button>
                    <Button variant="secondary" onClick={onRequestClose}>
                        Cancel
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

// PropTypes validation
AddResponseModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    categoriesCannedResponses: PropTypes.arrayOf(PropTypes.string).isRequired,
    onCategoryAdded: PropTypes.func.isRequired,
    onResponseAdded: PropTypes.func.isRequired
};

export default AddResponseModal;
