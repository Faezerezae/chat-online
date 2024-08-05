// import Divider from 'components/common/Divider';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
// import SocialAuthButtons from './SocialAuthButtons';
import { login } from '../../redux/authSlice';

const LoginForm = ({ hasLabel }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // State
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // Handler
    const handleSubmit = async e => {
        e.preventDefault();
        const resultAction = await dispatch(
            login({
                username: formData.username,
                password: formData.password
            })
        );
        if (login.fulfilled.match(resultAction)) {
            toast.success(`Logged in as ${formData.username}`, {
                theme: 'colored'
            });
            navigate('/app/chat');
        }
    };

    const handleFieldChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                {hasLabel && <Form.Label>username</Form.Label>}
                <Form.Control
                    placeholder={!hasLabel ? 'Username' : ''}
                    value={formData.username}
                    name="username"
                    onChange={handleFieldChange}
                    type="text"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                {hasLabel && <Form.Label>Password</Form.Label>}
                <Form.Control
                    placeholder={!hasLabel ? 'Password' : ''}
                    value={formData.password}
                    name="password"
                    onChange={handleFieldChange}
                    type="password"
                />
            </Form.Group>

            {/* <Row className="justify-content-between align-items-center">
        <Col xs="auto">
          <Form.Check type="checkbox" id="rememberMe" className="mb-0">
            <Form.Check.Input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={e =>
                setFormData({
                  ...formData,
                  remember: e.target.checked
                })
              }
            />
            <Form.Check.Label className="mb-0 text-700">
              Remember me
            </Form.Check.Label>
          </Form.Check>
        </Col>
      </Row> */}

            <Form.Group>
                <Button
                    type="submit"
                    color="primary"
                    className="mt-3 w-100"
                    disabled={!formData.username || !formData.password}
                >
                    Log in
                </Button>
            </Form.Group>

            {/* <Divider className="mt-4">or log in with</Divider>

      <SocialAuthButtons /> */}
        </Form>
    );
};

LoginForm.propTypes = {
    layout: PropTypes.string,
    hasLabel: PropTypes.bool
};

LoginForm.defaultProps = {
    layout: 'simple',
    hasLabel: false
};

export default LoginForm;
