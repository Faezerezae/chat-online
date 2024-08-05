import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const LastMessage = ({ lastMessage, thread }) => {
    useEffect(() => {
        // Store the last sender info in local storage
        if (lastMessage) {
            localStorage.setItem(
                'lastMessageSender',
                JSON.stringify({
                    userId: lastMessage.userId,
                    sender: lastMessage.sender
                })
            );
        }
    }, [lastMessage]);

    useEffect(() => {
        // Retrieve the last sender info from local storage on component mount
        const storedLastSender = localStorage.getItem('lastMessageSender');
        if (storedLastSender) {
            const { userId, sender } = JSON.parse(storedLastSender);
            console.log(`Last message sent by ${sender}, userId: ${userId}`);
            // You can use this information as needed in your application
        }
    }, []);

    const lastMassagePreview = lastMessage
        ? lastMessage.message
        : 'Say hi to your new friend';

    if (lastMessage) {
        if (
            lastMessage.userId === thread._id &&
            lastMessage.sender === 'Support'
        ) {
            return `You: ${lastMassagePreview}`;
        }

        if (thread.type === 'group') {
            return (
                <div
                    className="chat-contact-content"
                    dangerouslySetInnerHTML={{
                        __html: `${thread.username[0]}: ${lastMassagePreview}`
                    }}
                />
            );
        }

        return (
            <div
                className="chat-contact-content"
                dangerouslySetInnerHTML={{ __html: lastMassagePreview }}
            />
        );
    }

    return <div>{lastMassagePreview}</div>;
};

LastMessage.propTypes = {
    thread: PropTypes.object.isRequired,
    lastMessage: PropTypes.object
};

export default LastMessage;
