import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { ChatContext } from 'context/Context';
import Picker from '@emoji-mart/react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { useAppContext } from 'Main';
import {
    addMessage,
    setUserMessages,
    fetchMessages,
    updateMessage
} from '../../../../../redux/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../../../../axios/axiosConfig';
import { socket } from '../Chats';
import CannedResponsesModal from '../ConnedResponses/CannedResponsesModal';

const MessageTextArea = ({ thread }) => {
    const dispatch = useDispatch();
    const { setScrollToBottom, isOpenThreadInfo, editMessage, setEditMessage } =
        useContext(ChatContext);
    const [previewEmoji, setPreviewEmoji] = useState(false);
    const [messageInputs, setMessageInputs] = useState({});
    const [selectedResponse, setSelectedResponse] = useState('');
    const [modalShow, setModalShow] = useState(false);

    const usersMessages = useSelector(state => state.chat.usersMessages);

    const {
        config: { isDark }
    } = useAppContext();

    // Function to add emoji to message input
    const addEmoji = e => {
        let emoji = e.native;
        setMessageInputs(prevInputs => ({
            ...prevInputs,
            [thread._id]: (prevInputs[thread._id] || '') + emoji
        }));
        setPreviewEmoji(false);
    };

    // Handle new message from socket
    useEffect(() => {
        const handleNewMessage = newMessage => {
            dispatch(addMessage(newMessage));
            dispatch(
                setUserMessages({
                    userId: newMessage.userId,
                    messages: [
                        ...(usersMessages[newMessage.userId] || []),
                        newMessage
                    ]
                })
            );
        };
        socket.on('newMessage', handleNewMessage);
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [dispatch, usersMessages]);

    // Fetch messages for the thread
    useEffect(() => {
        if (thread) {
            dispatch(fetchMessages(thread));
        }
    }, [thread._id, dispatch]);

    // Handle input change
    const handleInputChange = (e, userId) => {
        setMessageInputs({
            ...messageInputs,
            [userId]: e.target.value
        });
    };

    // Function to send message
    const sendMessage = async (userId, message) => {
        const messageData = {
            userId: userId,
            username: thread.username,
            room: 'general',
            message: `${message.replace(/(?:\r\n|\r|\n)/g, '<br>')}`,
            status: 'delivered',
            sender: 'Support'
        };

        try {
            if (editMessage.messageId) {
                // Update existing message
                await axiosInstance.patch(
                    `/messages/${editMessage.messageId}`,
                    {
                        message: messageData.message
                    }
                );
                dispatch(
                    updateMessage({
                        messageId: editMessage.messageId,
                        newMessage: messageData.message
                    })
                );
                setEditMessage({ messageId: null, message: '' });
            } else {
                // Send new message
                const { data } = await axiosInstance.post(
                    '/messages',
                    messageData
                );
                socket.emit('message', data);
                dispatch(
                    setUserMessages({
                        userId: userId,
                        messages: [...(usersMessages[userId] || []), data]
                    })
                );
            }
            setMessageInputs(prevInputs => ({
                ...prevInputs,
                [userId]: ''
            }));
            setScrollToBottom(true);
        } catch (error) {
            console.error('Error sending message', error);
        }
    };

    // Handle form submission
    const handleSubmit = async (e, userId) => {
        e.preventDefault();
        await sendMessage(userId, messageInputs[userId] || '');
        handleDeleteResponse();
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditMessage({ messageId: null, message: '' });
        setMessageInputs(prevInputs => ({
            ...prevInputs,
            [thread._id]: ''
        }));
    };

    // Close emoji picker when thread info is opened
    useEffect(() => {
        if (isOpenThreadInfo) {
            setPreviewEmoji(false);
        }
    }, [isOpenThreadInfo]);

    // Handle response selection
    const handleSelectResponse = response => {
        setSelectedResponse(response);
        setMessageInputs(prevInputs => ({
            ...prevInputs,
            [thread._id]: (prevInputs[thread._id] || '') + response
        }));
        setModalShow(false);
    };

    // Handle delete response
    const handleDeleteResponse = () => {
        setMessageInputs(prevInputs => ({
            ...prevInputs,
            [thread._id]: (prevInputs[thread._id] || '').replace(
                selectedResponse,
                ''
            )
        }));
        setSelectedResponse('');
    };

    return (
        <Form
            className="chat-editor-area"
            onSubmit={e => handleSubmit(e, thread._id)}
        >
            <Button
                variant="link"
                className="emoji-icon"
                onClick={() => setModalShow(true)}
            >
                <FontAwesomeIcon icon={'bolt'} />
            </Button>
            <CannedResponsesModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                onSelectResponse={handleSelectResponse}
            />

            <TextareaAutosize
                minRows={1}
                maxRows={6}
                value={
                    messageInputs[thread._id] ||
                    selectedResponse ||
                    editMessage.message ||
                    ''
                }
                placeholder="Type your message"
                onChange={e => handleInputChange(e, thread._id)}
                className="form-control outline-none resize-none rounded-0 border-0 emojiarea-editor"
            />
            {selectedResponse && (
                <Button
                    variant="link"
                    size="sm"
                    onClick={handleDeleteResponse}
                    className="me-2 text-danger"
                >
                    Cancel
                </Button>
            )}

            <Form.Group controlId="chatFileUpload">
                <Form.Label className="chat-file-upload cursor-pointer">
                    <FontAwesomeIcon icon="paperclip" />
                </Form.Label>
                <Form.Control type="file" className="d-none" />
            </Form.Group>

            <Button
                variant="link"
                className="emoji-icon"
                onClick={() => setPreviewEmoji(!previewEmoji)}
            >
                <FontAwesomeIcon icon={['far', 'laugh-beam']} />
            </Button>

            {previewEmoji && (
                <div className="chat-emoji-picker" dir="ltr">
                    <Picker
                        set="google"
                        onEmojiSelect={addEmoji}
                        theme={isDark ? 'dark' : 'light'}
                        previewPosition="none"
                        skinTonePosition="none"
                    />
                </div>
            )}

            {editMessage.messageId && (
                <Button
                    variant="link"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="me-2 text-danger"
                >
                    Cancel Edit
                </Button>
            )}

            <Button
                variant="send"
                size="sm"
                className={classNames('shadow-none', {
                    'text-primary': (messageInputs[thread._id] || '').length > 0
                })}
                type="submit"
            >
                {editMessage.messageId ? 'Update' : 'Send'}
            </Button>
        </Form>
    );
};

MessageTextArea.propTypes = {
    thread: PropTypes.any
};

export default MessageTextArea;
