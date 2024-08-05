import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AxiosInstance from '../../../../../axios/axiosConfig';
import CategoryList from './CategoryList';
import ResponseList from './ResponseList';
import AddResponseModal from './AddResponseModal';
import PropTypes from 'prop-types';

export default function CannedResponsesModal({
    show,
    onHide,
    onSelectResponse
}) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categoriesCannedResponses, setCategoriesCannedResponses] = useState(
        []
    );
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [refreshResponses, setRefreshResponses] = useState(false);
    const [responseCounts, setResponseCounts] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await AxiosInstance.get(
                    '/categoriesCannedResponses'
                );
                setCategoriesCannedResponses(result.data.map(cat => cat.name));
            } catch (error) {
                console.error(
                    'Error fetching categoriesCannedResponses:',
                    error
                );
            }
        };
        fetchCategories();
    }, [refreshResponses]);

    const handleCategorySelect = categoryCannedResponse => {
        setSelectedCategory(categoryCannedResponse);
    };

    const handleResponseAdded = () => {
        setRefreshResponses(!refreshResponses);
    };

    const handleCategoryAdded = async newCategory => {
        try {
            await AxiosInstance.post('/categoriesCannedResponses', {
                name: newCategory
            });
            setCategoriesCannedResponses([
                ...categoriesCannedResponses,
                newCategory
            ]);
        } catch (error) {
            console.error('Error adding categoryCannedResponse:', error);
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const updateResponseCounts = async () => {
        try {
            const allResponses = await AxiosInstance.get('/cannedResponses');
            const counts = { all: allResponses.data.length };

            await Promise.all(
                categoriesCannedResponses.map(async categoryCannedResponse => {
                    const categoryResponses = await AxiosInstance.get(
                        `/cannedResponses/${categoryCannedResponse}`
                    );
                    counts[categoryCannedResponse] =
                        categoryResponses.data.length;
                })
            );

            setResponseCounts(counts);
        } catch (error) {
            console.error('Error fetching response counts:', error);
        }
    };

    useEffect(() => {
        updateResponseCounts();
    }, [refreshResponses, categoriesCannedResponses]);

    return (
        <Modal
            show={show}
            onHide={onHide}
            dialogClassName="custom-modal-dialog"
            className="custom-modal"
            size="lg"
            style={{
                position: 'fixed',
                right: 0,
                top: 0,
                margin: 0
            }}
            backdrop={false}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Modal heading
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            width: '200px',
                            padding: '10px',
                            borderRight: '1px solid black'
                        }}
                    >
                        <CategoryList
                            categoriesCannedResponses={
                                categoriesCannedResponses
                            }
                            selectedCategory={selectedCategory}
                            onSelectCategory={handleCategorySelect}
                            responseCounts={responseCounts}
                        />
                    </div>
                    <div style={{ flex: 1, padding: '10px' }}>
                        <button onClick={openModal}>New Response</button>
                        <AddResponseModal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            categoriesCannedResponses={
                                categoriesCannedResponses
                            }
                            onCategoryAdded={handleCategoryAdded}
                            onResponseAdded={handleResponseAdded}
                        />
                        <ResponseList
                            categoryCannedResponse={selectedCategory}
                            onSelectResponse={onSelectResponse}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
CannedResponsesModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onSelectResponse: PropTypes.func.isRequired
};
