import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ChatContentBodyIntro from './ChatContentBodyIntro';
import Message from './Message';
import SimpleBarReact from 'simplebar-react';
import ThreadInfo from './ThreadInfo';
import { ChatContext } from 'context/Context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../../../../redux/chatSlice';
import moment from 'moment-jalaali';

const ChatContentBody = ({ thread }) => {
    const [uniqueDates, setUniqueDates] = useState([]);
    const messagesEndRef = useRef();
    const dispatch = useDispatch();
    const { scrollToBottom, setScrollToBottom } = useContext(ChatContext);

    const usersMessages = useSelector(state => state.chat.usersMessages);
    useEffect(() => {
        if (thread._id) {
            dispatch(fetchMessages(thread._id));
        }
    }, [thread._id, dispatch]);

    useEffect(() => {
        if (scrollToBottom) {
            setTimeout(() => {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }, 500);
            setScrollToBottom(false);
        }
    }, [scrollToBottom]);

    useEffect(() => {
        // بررسی و تعیین تاریخ‌های یکتا برای نمایش
        if (usersMessages[thread._id]) {
            const uniqueDatesSet = new Set();
            usersMessages[thread._id].forEach(message => {
                const date = moment(message.createdAt).format('jYYYY/jM/jD');
                uniqueDatesSet.add(date);
            });
            const uniqueDatesArray = Array.from(uniqueDatesSet);
            setUniqueDates(uniqueDatesArray);
        }
    }, [usersMessages, thread._id]);

    return (
        <div className="chat-content-body" style={{ display: 'inherit' }}>
            <ThreadInfo thread={thread} isOpenThreadInfo={true} />
            <SimpleBarReact style={{ height: '100%' }}>
                <div className="chat-content-scroll-area">
                    <ChatContentBodyIntro user={thread} />
                    {uniqueDates?.map((date, index) => (
                        <React.Fragment key={index}>
                            <div className="text-center fs--2 text-500">
                                {date}
                            </div>
                            {usersMessages[thread._id]?.map(message => {
                                const messageDate = moment(
                                    message.createdAt
                                ).format('jYYYY/jM/jD');
                                if (messageDate === date) {
                                    return (
                                        <Message
                                            key={message._id}
                                            message={message.message}
                                            userId={message.userId}
                                            sender={message.sender}
                                            time={moment(
                                                message.createdAt
                                            ).format('hh:mm A')}
                                            username={message.username}
                                            thread={thread}
                                            status={message.status}
                                            messageId={message._id}
                                            creationTime={message.createdAt}
                                        />
                                    );
                                }
                                return null;
                            })}
                        </React.Fragment>
                    ))}
                </div>
                <div ref={messagesEndRef} />
            </SimpleBarReact>
        </div>
    );
};

ChatContentBody.propTypes = {
    thread: PropTypes.object.isRequired
};

export default ChatContentBody;
