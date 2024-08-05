import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from 'components/common/IconButton';
import React, { useState } from 'react';
import {
    Button,
    Card,
    Form,
    FormControl,
    InputGroup,
    Table
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import SimpleBarReact from 'simplebar-react';

const TicketRow = ({
    name,
    price,
    checked = false,
    id,
    handleChange,
    handleRemove
}) => {
    return (
        <tr>
            <td>
                <Form.Control
                    size="sm"
                    style={{ minWidth: '7.5rem' }}
                    type="text"
                    placeholder="Option Name"
                    value={name}
                    onChange={({ target }) =>
                        handleChange(id, 'name', target.value)
                    }
                />
            </td>
            <td>
                <InputGroup size="sm" style={{ minWidth: '7.5rem' }}>
                    <InputGroup.Text className="d-none d-sm-block">
                        $
                    </InputGroup.Text>
                    <FormControl
                        type="number"
                        placeholder="Price"
                        value={price}
                        aria-label="Dollar amount (with dot and two decimal places)"
                        step="0.01"
                        onChange={({ target }) =>
                            handleChange(id, 'price', target.value)
                        }
                    />
                </InputGroup>
            </td>
            <td className="text-center align-middle">
                <Form.Check
                    type="radio"
                    id={`ticketChecked${id + 1}`}
                    checked={checked}
                    onChange={({ target }) =>
                        handleChange(id, 'checked', target.checked)
                    }
                />
            </td>
            <td className="text-center align-middle">
                <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleRemove(id)}
                >
                    <FontAwesomeIcon
                        className="text-danger"
                        icon="times-circle"
                    />
                </Button>
            </td>
        </tr>
    );
};

const EventTicket = () => {
    const [tickets, setTickets] = useState([
        { name: 'Front desks', price: 0.0, checked: true },
        { name: 'Green gallery', price: 5.0 },
        { name: 'VIP', price: 20.0 }
    ]);

    // Change Ticket
    const changeTicket = (id, name, value) => {
        const updatedTickets =
            name === 'checked'
                ? tickets.map(ticket => ({ ...ticket, checked: false }))
                : [...tickets];
        const updatedTicket = { ...tickets[id], [name]: value };

        setTickets([
            ...updatedTickets.slice(0, id),
            updatedTicket,
            ...updatedTickets.slice(id + 1)
        ]);
    };

    // Remove Ticket
    const removeTicket = id =>
        setTickets([...tickets.slice(0, id), ...tickets.slice(id + 1)]);

    const handleAddTicket = () => {
        setTickets([...tickets, { name: '', price: 0 }]);
    };

    return (
        <Card className="mb-3">
            <Card.Header as="h5">Ticket Price</Card.Header>
            <Card.Body className="bg-body-tertiary">
                <Button variant="falcon-default" size="sm">
                    Free <span className="d-none d-sm-inline">Ticket</span>
                </Button>
                <Button variant="falcon-primary" className="ms-2" size="sm">
                    Paid <span className="d-none d-sm-inline">Ticket</span>
                </Button>
                <Button variant="falcon-default" className="ms-2" size="sm">
                    Donation
                </Button>

                <hr />
                <h6 className="fs-0">Pricing Options:</h6>
                <Form.Check
                    type="checkbox"
                    id="variablePricingCheckbox"
                    label="Enable varible pricing"
                    defaultChecked
                />

                <Form.Check
                    type="checkbox"
                    id="purchaseModeCheckbox"
                    label="Enable multi-option purchase mode."
                />
                <SimpleBarReact>
                    <Table
                        className="mb-2 border-200 mt-3 bg-body-emphasis table-responsive"
                        bordered
                    >
                        <thead>
                            <tr className="fs--1">
                                <th scope="col">Option Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Default</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="event-ticket-body">
                            {tickets.map((item, index) => (
                                <TicketRow
                                    {...item}
                                    id={index}
                                    key={index}
                                    handleChange={changeTicket}
                                    handleRemove={removeTicket}
                                />
                            ))}
                        </tbody>
                    </Table>
                </SimpleBarReact>

                <IconButton
                    onClick={handleAddTicket}
                    variant="falcon-default"
                    size="sm"
                    icon="plus"
                    transform="shrink-3"
                >
                    Add Item
                </IconButton>
            </Card.Body>
        </Card>
    );
};

TicketRow.propTypes = {
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    checked: PropTypes.bool,
    id: PropTypes.number.isRequired,
    handleRemove: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired
};

export default EventTicket;
