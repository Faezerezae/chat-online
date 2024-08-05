import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Table, Modal, Tab } from 'react-bootstrap';
import SettingProvider from '../SettingChatProvider';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import StrictModeDroppable from 'components/app/kanban/StrictModeDroppable';
import axiosInstance from '../../../../../axios/axiosConfig';
import { v4 as uuidv4 } from 'uuid';

const BeforeStartingTheConversationTab = () => {
    const [newField, setNewField] = useState({
        label: '',
        type: 'text',
        required: false,
        maxLength: '',
        deleted: false
    });
    const [selectedOption, setSelectedOption] = useState('');
    const [formId, setFormId] = useState(null);
    const [title, setTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState('');
    const [completeProfileForm, setCompleteProfileForm] = useState({
        fields: []
    });

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await axiosInstance.get(
                    '/beforeStartingConversation/initialize-form'
                );
                if (response.data) {
                    const formData = response.data;
                    setFormId(formData._id);
                    setCompleteProfileForm(
                        formData.completeProfileForm || { fields: [] }
                    );
                    setTitle(formData.completeProfileForm.title || '');
                    setSelectedOption(
                        formData.completeProfileForm.checked
                            ? 'form'
                            : 'special'
                    );
                }
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };

        fetchFormData();
    }, []);

    const handleFieldChange = e => {
        const { name, value, type, checked } = e.target;
        setNewField(prevField => ({
            ...prevField,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setErrors('');
    };

    const validateField = () => {
        let errorMessages = '';
        if (!newField.label) {
            errorMessages += 'Label is required.\n';
        } else if (
            completeProfileForm.fields.some(
                field => field.label === newField.label && !field.deleted
            )
        ) {
            errorMessages += 'Label must be unique.\n';
        }
        if (errorMessages) {
            setErrors(errorMessages);
            return false;
        }
        return true;
    };

    const handleAddField = () => {
        if (!validateField()) return;
        const newOrder = completeProfileForm.fields.length
            ? Math.max(
                  ...completeProfileForm.fields.map(field => field.order)
              ) + 1
            : 1;
        setCompleteProfileForm(prevState => ({
            ...prevState,
            fields: [
                ...prevState.fields,
                { ...newField, deleted: false, order: newOrder, _id: uuidv4() }
            ]
        }));
        handleCloseModal();
        setNewField({
            label: '',
            type: 'text',
            required: false,
            maxLength: '',
            deleted: false
        });
    };

    const handleDeleteField = fieldId => {
        setCompleteProfileForm(prevState => ({
            ...prevState,
            fields: prevState.fields.map(field =>
                field._id === fieldId ? { ...field, deleted: true } : field
            )
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (formId) {
                const deletedFieldIds = completeProfileForm.fields
                    .filter(field => field.deleted)
                    .map(field => field._id);

                await axiosInstance.patch(
                    '/beforeStartingConversation/update-data',
                    {
                        formId, // Add formId here
                        anythingSpecial: selectedOption === 'special',
                        completeProfileForm: {
                            fields: completeProfileForm.fields
                                .filter(field => !field.deleted)
                                .sort((a, b) => a.order - b.order),
                            title,
                            checked: selectedOption === 'form'
                        }
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                for (const fieldId of deletedFieldIds) {
                    await axiosInstance.patch(
                        `/beforeStartingConversation/delete-field/${formId}/${fieldId}`
                    );
                }

                console.log('Form updated successfully!');
                const response = await axiosInstance.get(
                    '/beforeStartingConversation/initialize-form'
                );
                if (response.data) {
                    const formData = response.data;
                    setCompleteProfileForm(
                        formData.completeProfileForm || { fields: [] }
                    );
                    setTitle(formData.completeProfileForm.title || '');
                    setSelectedOption(
                        formData.completeProfileForm.checked
                            ? 'form'
                            : 'special'
                    );
                }
            } else {
                const response = await axiosInstance.post(
                    '/beforeStartingConversation/submit-form',
                    {
                        anythingSpecial: selectedOption === 'special',
                        completeProfileForm: {
                            fields: completeProfileForm.fields,
                            title,
                            checked: selectedOption === 'form'
                        }
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                setFormId(response.data.formId); // Ensure this line is executed
                console.log('Form submitted successfully:', response.data);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const reorder = (array, fromIndex, toIndex) => {
        const newArr = [...array];
        const [movedItem] = newArr.splice(fromIndex, 1);
        newArr.splice(toIndex, 0, movedItem);
        return newArr;
    };

    const move = (source, destination) => {
        const sourceItemsClone = [...completeProfileForm.fields];
        const destItemsClone = [...completeProfileForm.fields];

        const [removedItem] = sourceItemsClone.splice(source.index, 1);
        destItemsClone.splice(destination.index, 0, removedItem);

        return {
            updatedDestItems: destItemsClone,
            updatedSourceItems: sourceItemsClone
        };
    };

    const onDragEnd = result => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const reorderedItems = reorder(
                completeProfileForm.fields,
                source.index,
                destination.index
            );
            setCompleteProfileForm(prevState => ({
                ...prevState,
                fields: reorderedItems.map((field, index) => ({
                    ...field,
                    order: index + 1
                }))
            }));
        } else {
            const movedItems = move(source, destination);
            setCompleteProfileForm(prevState => ({
                ...prevState,
                fields: movedItems.updatedDestItems.map((field, index) => ({
                    ...field,
                    order: index + 1
                }))
            }));
        }
    };
    return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="0">
            <Card className="card-Setting overflow-hidden">
                <Card.Body className="p-3 h-100">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Check
                                type="radio"
                                label="Anything Special"
                                name="option"
                                value="special"
                                checked={selectedOption === 'special'}
                                onChange={e =>
                                    setSelectedOption(e.target.value)
                                }
                            />
                            <Form.Check
                                type="radio"
                                label="User needs to complete the form"
                                name="option"
                                value="form"
                                checked={selectedOption === 'form'}
                                onChange={e =>
                                    setSelectedOption(e.target.value)
                                }
                            />
                        </Form.Group>
                        {selectedOption === 'form' && (
                            <>
                                <Form.Group>
                                    <Form.Label>Form Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter form title"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-between align-items-center mt-3 mb-1">
                                    <strong>Field List</strong>
                                    <Button
                                        variant="primary"
                                        onClick={handleShowModal}
                                    >
                                        Add Field
                                    </Button>
                                </div>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <StrictModeDroppable
                                        droppableId={completeProfileForm._id}
                                        type="DRAG"
                                    >
                                        {provided => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>Field</th>
                                                            <th>Type</th>
                                                            <th>Required?</th>
                                                            <th>Max Length</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {completeProfileForm.fields
                                                            .filter(
                                                                field =>
                                                                    !field.deleted
                                                            )
                                                            .sort(
                                                                (a, b) =>
                                                                    a.order -
                                                                    b.order
                                                            )
                                                            .map(
                                                                (
                                                                    field,
                                                                    index
                                                                ) => (
                                                                    <Draggable
                                                                        key={
                                                                            field._id
                                                                        }
                                                                        draggableId={
                                                                            field._id
                                                                        }
                                                                        index={
                                                                            index
                                                                        }
                                                                    >
                                                                        {provided => (
                                                                            <tr
                                                                                ref={
                                                                                    provided.innerRef
                                                                                }
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                            >
                                                                                <td>
                                                                                    {
                                                                                        field.label
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        field.type
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {field.required
                                                                                        ? 'Yes'
                                                                                        : 'No'}
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        field.maxLength
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    <Button
                                                                                        variant="danger"
                                                                                        onClick={() =>
                                                                                            handleDeleteField(
                                                                                                field._id
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Delete
                                                                                    </Button>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </Draggable>
                                                                )
                                                            )}
                                                    </tbody>
                                                </Table>
                                                {/* Check if fields are empty */}
                                                {completeProfileForm.fields.filter(
                                                    field => !field.deleted
                                                ).length === 0 && (
                                                    <div className="d-flex justify-content-center">
                                                        <p className="text-muted">
                                                            You have not added a
                                                            field yet
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </StrictModeDroppable>
                                </DragDropContext>
                            </>
                        )}
                        <div className="d-flex justify-content-center m-4">
                            <Button variant="primary" type="submit">
                                {formId ? 'Update Form' : 'Submit Form'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Field</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors && <p className="text-danger">{errors}</p>}
                    <Form>
                        <Form.Group>
                            <Form.Label>Label</Form.Label>
                            <Form.Control
                                type="text"
                                name="label"
                                value={newField.label}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="type"
                                value={newField.type}
                                onChange={handleFieldChange}
                            >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                {/* Add other types as needed */}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check
                                type="checkbox"
                                label="Required"
                                name="required"
                                checked={newField.required}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Max Length</Form.Label>
                            <Form.Control
                                type="number"
                                name="maxLength"
                                value={newField.maxLength}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddField}>
                        Add Field
                    </Button>
                </Modal.Footer>
            </Modal>
        </Tab.Container>
    );
};
const BeforeStartingTheConversation = () => {
    return (
        <SettingProvider>
            <BeforeStartingTheConversationTab />
        </SettingProvider>
    );
};

export default BeforeStartingTheConversation;
