import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Table, Modal, Tab } from 'react-bootstrap';
import SettingProvider from '../SettingChatProvider';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import StrictModeDroppable from 'components/app/kanban/StrictModeDroppable';
import axiosInstance from '../../../../../axios/axiosConfig';
import { v4 as uuidv4 } from 'uuid';

const DelayInResponseTab = () => {
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
    const [displayAfterSeconds, setDisplayAfterSeconds] = useState(0); // For CompleteProfileForm
    const [sendMessageDisplayAfterSeconds, setSendMessageDisplayAfterSeconds] =
        useState(0); // For SendMessageToUser
    const [sendMessageTitle, setSendMessageTitle] = useState(''); // New title state for SendMessageToUser
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState('');
    const [completeProfileForm, setCompleteProfileForm] = useState({
        fields: [],
        title: '',
        displayAfterSeconds: 0,
        checked: false
    });

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await axiosInstance.get(
                    '/delayInResponse/initialize-form'
                );
                if (response.data) {
                    const formData = response.data;
                    setFormId(formData._id);
                    setCompleteProfileForm(
                        formData.completeProfileForm || { fields: [] }
                    );
                    setTitle(formData.completeProfileForm.title || '');
                    setDisplayAfterSeconds(
                        formData.completeProfileForm.displayAfterSeconds || 0
                    );

                    // Set selected option based on form data
                    if (formData.completeProfileForm.checked) {
                        setSelectedOption('form');
                    } else if (formData.sendMessageToUser?.checked) {
                        setSelectedOption('sendMessage');
                    } else {
                        setSelectedOption('special');
                    }

                    setSendMessageDisplayAfterSeconds(
                        formData.sendMessageToUser?.displayAfterSeconds || 0
                    );
                    setSendMessageTitle(
                        formData.sendMessageToUser?.title || ''
                    ); // Set title for SendMessageToUser
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
                    '/delayInResponse/update-data',
                    {
                        formId,
                        anythingSpecial: selectedOption === 'special',
                        completeProfileForm: {
                            fields: completeProfileForm.fields
                                .filter(field => !field.deleted)
                                .sort((a, b) => a.order - b.order),
                            title,
                            displayAfterSeconds,
                            checked: selectedOption === 'form'
                        },
                        sendMessageToUser: {
                            title: sendMessageTitle, // Include the new title
                            displayAfterSeconds: sendMessageDisplayAfterSeconds,
                            checked: selectedOption === 'sendMessage'
                        }
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                for (const fieldId of deletedFieldIds) {
                    await axiosInstance.patch(
                        `/delayInResponse/delete-field/${formId}/${fieldId}`
                    );
                }

                console.log('Form updated successfully!');
                const response = await axiosInstance.get(
                    '/delayInResponse/initialize-form'
                );
                if (response.data) {
                    const formData = response.data;
                    setCompleteProfileForm(
                        formData.completeProfileForm || { fields: [] }
                    );
                    setTitle(formData.completeProfileForm.title || '');
                    setDisplayAfterSeconds(
                        formData.completeProfileForm.displayAfterSeconds || 0
                    );

                    if (formData.completeProfileForm.checked) {
                        setSelectedOption('form');
                    } else if (formData.sendMessageToUser?.checked) {
                        setSelectedOption('sendMessage');
                    } else {
                        setSelectedOption('special');
                    }

                    setSendMessageDisplayAfterSeconds(
                        formData.sendMessageToUser?.displayAfterSeconds || 0
                    );
                    setSendMessageTitle(
                        formData.sendMessageToUser?.title || ''
                    ); // Update title for SendMessageToUser
                }
            } else {
                const response = await axiosInstance.post(
                    '/delayInResponse/submit-form',
                    {
                        anythingSpecial: selectedOption === 'special',
                        completeProfileForm: {
                            fields: completeProfileForm.fields,
                            title,
                            displayAfterSeconds,
                            checked: selectedOption === 'form'
                        },
                        sendMessageToUser: {
                            title: sendMessageTitle, // Include the new title
                            displayAfterSeconds: sendMessageDisplayAfterSeconds,
                            checked: selectedOption === 'sendMessage'
                        }
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                setFormId(response.data.formId);
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
                                label="Anything special"
                                name="formOption"
                                checked={selectedOption === 'special'}
                                onChange={() => setSelectedOption('special')}
                            />
                            <Form.Check
                                type="radio"
                                label="Send a message to the user"
                                name="formOption"
                                checked={selectedOption === 'sendMessage'}
                                onChange={() =>
                                    setSelectedOption('sendMessage')
                                }
                            />
                            <Form.Check
                                type="radio"
                                label="User needs to complete the form"
                                name="formOption"
                                checked={selectedOption === 'form'}
                                onChange={() => setSelectedOption('form')}
                            />
                        </Form.Group>
                        {selectedOption === 'form' && (
                            <>
                                <Form.Group>
                                    <Form.Label>Form Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>
                                        Display After Seconds
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={displayAfterSeconds}
                                        onChange={e =>
                                            setDisplayAfterSeconds(
                                                Number(e.target.value)
                                            )
                                        }
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
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Label</th>
                                            <th>Type</th>
                                            <th>Required</th>
                                            <th>Max Length</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <StrictModeDroppable
                                            droppableId="fields"
                                            type="FIELD"
                                        >
                                            {provided => (
                                                <tbody
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                >
                                                    {completeProfileForm.fields.map(
                                                        (field, index) =>
                                                            !field.deleted && (
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
                                                                                {field.maxLength ||
                                                                                    'N/A'}
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
                                                    {provided.placeholder}
                                                </tbody>
                                            )}
                                        </StrictModeDroppable>
                                    </DragDropContext>
                                </Table>
                                {completeProfileForm.fields.filter(
                                    field => !field.deleted
                                ).length === 0 && (
                                    <div className="d-flex justify-content-center">
                                        <p className="text-muted">
                                            You have not added a field yet
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                        {selectedOption === 'sendMessage' && (
                            <>
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={sendMessageTitle}
                                        onChange={e =>
                                            setSendMessageTitle(e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>
                                        Display After Seconds
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={sendMessageDisplayAfterSeconds}
                                        onChange={e =>
                                            setSendMessageDisplayAfterSeconds(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </Form.Group>
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
                    <Modal.Title>Add Field</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {errors && (
                            <div className="alert alert-danger">{errors}</div>
                        )}
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
                                {/* Add more types as needed */}
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
                        <Button variant="primary" onClick={handleAddField}>
                            Add
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Tab.Container>
    );
};

const DelayInResponse = () => {
    return (
        <SettingProvider>
            <DelayInResponseTab />
        </SettingProvider>
    );
};

export default DelayInResponse;
