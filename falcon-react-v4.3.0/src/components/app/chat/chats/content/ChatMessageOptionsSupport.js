import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

// Helper function to determine if the message is older than one hour
const isOlderThanOneHour = creationTime => {
    const currentTime = new Date();
    const messageTime = new Date(creationTime);
    const oneHourInMillis = 60 * 60 * 1000; // 1 hour in milliseconds
    return currentTime - messageTime > oneHourInMillis;
};

const ChatMessageOptionsSupport = ({
    messageId,
    onEdit,
    onRemove,
    creationTime
}) => {
    const [actions] = useState([
        {
            tooltip: 'Forward',
            icon: 'share'
        },
        {
            tooltip: 'Archive',
            icon: 'archive'
        },
        {
            tooltip: 'Edit',
            icon: 'edit',
            action: onEdit,
            visible: !isOlderThanOneHour(creationTime)
        },
        {
            tooltip: 'Remove',
            icon: 'trash-alt',
            action: onRemove,
            visible: !isOlderThanOneHour(creationTime)
        }
    ]);

    return (
        <ul className="hover-actions position-relative list-inline mb-0 text-400 mx-2">
            {actions.map(
                action =>
                    action.visible !== false && (
                        <li
                            key={action.tooltip}
                            className="list-inline-item cursor-pointer chat-option-hover"
                            onClick={() =>
                                action.action && action.action(messageId)
                            }
                        >
                            <OverlayTrigger
                                overlay={
                                    <Tooltip style={{ position: 'fixed' }}>
                                        {action.tooltip}
                                    </Tooltip>
                                }
                            >
                                <div>
                                    <FontAwesomeIcon
                                        icon={action.icon}
                                        className="d-inline-block"
                                    />
                                </div>
                            </OverlayTrigger>
                        </li>
                    )
            )}
        </ul>
    );
};

ChatMessageOptionsSupport.propTypes = {
    messageId: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    creationTime: PropTypes.string.isRequired // Ensure `creationTime` is a valid date string
};

export default ChatMessageOptionsSupport;
