import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'components/common/Flex';
import classNames from 'classnames';
import Avatar from 'components/common/Avatar';
import { Nav } from 'react-bootstrap';
import LastMessage from './LastMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChatSidebarDropdownAction from './ChatSidebarDropdownAction';
// import { ChatContext } from 'context/Context';
import { useSelector } from 'react-redux';
import moment from 'moment-jalaali';
import 'moment/locale/fa'; // برای تنظیمات محلی فارسی

moment.locale('fa'); // تنظیم locale به فارسی
moment.loadPersian({ usePersianDigits: true }); // استفاده از اعداد فارسی (اختیاری)

const ChatThread = ({ thread }) => {
    const usersMessages = useSelector(state => state.chat.usersMessages);

    const getLastMessage = messages => {
        return messages.length > 0 ? messages[messages.length - 1] : '';
    };

    const lastMessage =
        thread._id && usersMessages[thread._id]
            ? getLastMessage(usersMessages[thread._id])
            : '';

    return (
        <Nav.Link
            eventKey={thread._id}
            className={classNames(`chat-contact hover-actions-trigger p-3`, {
                'unread-message': !thread.read,
                'read-message': thread.read
            })}
        >
            <div className="d-md-none d-lg-block">
                <ChatSidebarDropdownAction />
            </div>
            <Flex>
                <Avatar
                    className={thread.status}
                    src={thread.avatar}
                    size="xl"
                />
                <div className="flex-1 chat-contact-body ms-2 d-md-none d-lg-block">
                    <Flex justifyContent="between">
                        <h6 className="mb-0 chat-contact-title">
                            {thread.username}
                        </h6>
                        <span className="message-time fs--2">
                            {' '}
                            {!!lastMessage &&
                                moment(lastMessage.createdAt).format(
                                    'dddd'
                                )}{' '}
                        </span>
                    </Flex>
                    <div className="min-w-0">
                        <div className="chat-contact-content pe-3">
                            <LastMessage
                                lastMessage={lastMessage}
                                thread={thread}
                            />
                            <div className="position-absolute bottom-0 end-0 hover-hide">
                                {!!lastMessage?.status && (
                                    <FontAwesomeIcon
                                        icon={classNames({
                                            check:
                                                lastMessage.status === 'seen' ||
                                                lastMessage.status === 'sent',
                                            'check-double':
                                                lastMessage.status ===
                                                'delivered'
                                        })}
                                        transform="shrink-5 down-4"
                                        className={classNames({
                                            'text-success':
                                                lastMessage.status === 'seen',
                                            'text-400':
                                                lastMessage.status ===
                                                    'delivered' ||
                                                lastMessage.status === 'sent'
                                        })}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Flex>
        </Nav.Link>
    );
};

ChatThread.propTypes = {
    thread: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
};

export default ChatThread;
