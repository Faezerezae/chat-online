import React from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'react-bootstrap';
import ChatContentHeader from './ChatContentHeader';
// import threads from 'data/chat/threads';
import ChatContentBody from './ChatContentBody';
import MessageTextArea from './MessageTextArea';

const ChatContent = ({ setHideSidebar, thread }) => {
    return (
        <Tab.Content className="card-chat-content">
            <Tab.Pane
                key={thread._id}
                eventKey={thread._id}
                className="card-chat-pane"
            >
                <ChatContentHeader
                    thread={thread}
                    setHideSidebar={setHideSidebar}
                />
                <ChatContentBody thread={thread} />
            </Tab.Pane>
            <MessageTextArea thread={thread} />
        </Tab.Content>
    );
};

ChatContent.propTypes = {
    setHideSidebar: PropTypes.func.isRequired,
    thread: PropTypes.any,
    index: PropTypes.any
};

export default ChatContent;
