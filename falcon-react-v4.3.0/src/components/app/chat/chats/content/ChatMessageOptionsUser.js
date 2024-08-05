import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const ChatMessageOptionsUser = ({ messageId }) => {
    const [actions] = useState([
        {
            tooltip: 'Forward',
            icon: 'share'
        },
        {
            tooltip: 'Archive',
            icon: 'archive'
        }
    ]);

    return (
        <ul className="hover-actions position-relative list-inline mb-0 text-400 mx-2">
            {actions.map(action => (
                <li
                    key={action.tooltip}
                    className="list-inline-item cursor-pointer chat-option-hover"
                    onClick={() => action.action && action.action(messageId)}
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
            ))}
        </ul>
    );
};

ChatMessageOptionsUser.propTypes = {
    messageId: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
};

export default ChatMessageOptionsUser;
