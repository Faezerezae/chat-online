import React from 'react';
import { Card, Form } from 'react-bootstrap';
import SubtleBadge from 'components/common/SubtleBadge';
import { useFormContext } from 'react-hook-form';

const ProductShipping = () => {
    const { register } = useFormContext();
    return (
        <Card className="mb-3">
            <Card.Header as="h6" className="bg-body-tertiary">
                Shipping
            </Card.Header>
            <Card.Body>
                <Form.Check className="mb-2" id="vendorDelivery">
                    <Form.Check.Input
                        type="radio"
                        value="vendorDelivery"
                        className="p-2"
                        defaultChecked
                        {...register(`shipping`)}
                    />
                    <Form.Check.Label className="form-check-label fs-0 fw-normal text-700">
                        Delivered by vendor (you)
                    </Form.Check.Label>
                </Form.Check>
                <Form.Check className="mb-0" id="falconDelivery">
                    <Form.Check.Input
                        type="radio"
                        value="falconDelivery"
                        className="p-2"
                        {...register(`shipping`)}
                    />
                    <Form.Check.Label className="form-check-label fs-0 fw-normal text-700">
                        Delivered by FALCON
                        <SubtleBadge bg="warning" pill className="ms-2">
                            Recommended
                        </SubtleBadge>
                    </Form.Check.Label>
                </Form.Check>
            </Card.Body>
        </Card>
    );
};

export default ProductShipping;
