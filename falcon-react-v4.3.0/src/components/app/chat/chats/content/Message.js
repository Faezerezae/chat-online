import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from 'components/common/Avatar';
import Flex from 'components/common/Flex';
import classNames from 'classnames';
import ChatMessageOptionsSupport from './ChatMessageOptionsSupport';
import ChatMessageOptionsUser from './ChatMessageOptionsUser';
import { useDispatch } from 'react-redux';
import { deleteMessage } from '../../../../../redux/chatSlice';
import axiosInstance from '../../../../../axios/axiosConfig';
import { ChatContext } from 'context/Context';
import { Modal, Button } from 'react-bootstrap';

const Message = ({
    message,
    sender,
    username,
    time,
    status,
    thread,
    messageId,
    creationTime
}) => {
    const dispatch = useDispatch();
    const { setEditMessage } = useContext(ChatContext);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [messageToDelete, setMessageToDelete] = useState('');

    const isLeft = sender === 'User';

    const handleShowDeleteModal = message => {
        setMessageToDelete(message);
        setShowDeleteModal(true);
    };

    const handleDeleteMessage = async () => {
        try {
            // Close the modal
            setShowDeleteModal(false);
            // Dispatch action to delete message from Redux store
            dispatch(deleteMessage(messageId));
            // Delete message from server
            await axiosInstance.delete(`/messages/${messageId}`);
        } catch (error) {
            console.error('Error deleting message', error);
        }
    };

    const handleEditMessage = () => {
        setEditMessage({ messageId, message });
    };

    return (
        <Flex className={classNames('p-3', { 'd-block': !isLeft })}>
            {isLeft && <Avatar size="l" className="me-2" src={thread.avatar} />}
            <div
                className={classNames('flex-1', {
                    'd-flex justify-content-end': !isLeft
                })}
            >
                <div
                    className={classNames('w-xxl-75', {
                        'w-100': !isLeft
                    })}
                >
                    <Flex
                        alignItems="center"
                        className={classNames('hover-actions-trigger', {
                            'flex-end-center': !isLeft,
                            'align-items-center': isLeft
                        })}
                    >
                        {!isLeft && (
                            <ChatMessageOptionsSupport
                                messageId={messageId}
                                onRemove={() => handleShowDeleteModal(message)}
                                onEdit={handleEditMessage}
                                creationTime={creationTime}
                            />
                        )}
                        {message.attachments ? (
                            <div className="chat-message chat-gallery">
                                {message && (
                                    <p
                                        className="mb-0"
                                        dangerouslySetInnerHTML={{
                                            __html: message
                                        }}
                                    />
                                )}
                            </div>
                        ) : (
                            <>
                                <div
                                    className={classNames(
                                        'p-2 rounded-2 chat-message',
                                        {
                                            'bg-200': isLeft,
                                            'bg-primary text-white': !isLeft
                                        }
                                    )}
                                >
                                    {message && (
                                        <p
                                            className="mb-0"
                                            dangerouslySetInnerHTML={{
                                                __html: message
                                            }}
                                        />
                                    )}
                                </div>
                            </>
                        )}
                        {isLeft && <ChatMessageOptionsUser />}
                    </Flex>
                    <div
                        className={classNames('text-400 fs--2', {
                            'text-end': !isLeft
                        })}
                    >
                        {isLeft && sender && (
                            <span className="font-weight-semi-bold me-2">
                                {username}
                            </span>
                        )}
                        {time}
                        {!isLeft && !!message && !!status && (
                            <FontAwesomeIcon
                                icon={classNames({
                                    check:
                                        status === 'seen' || status === 'sent',
                                    'check-double': status === 'delivered'
                                })}
                                className={classNames('ms-2', {
                                    'text-success': status === 'seen'
                                })}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Delete confirmation modal */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this message:
                    <div
                        className="mt-2 p-2 rounded-2"
                        dangerouslySetInnerHTML={{ __html: messageToDelete }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleDeleteMessage}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Flex>
    );
};

Message.propTypes = {
    message: PropTypes.string,
    sender: PropTypes.string,
    username: PropTypes.string,
    time: PropTypes.string.isRequired,
    status: PropTypes.string,
    thread: PropTypes.shape({
        avatar: PropTypes.string
    }),
    messageId: PropTypes.string.isRequired,
    creationTime: PropTypes.string.isRequired
};

export default Message;
