import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Flex from 'components/common/Flex';
import { ChatContext } from 'context/Context';

const ChatContentHeader = ({ thread, setHideSidebar }) => {
    const { isOpenThreadInfo, setIsOpenThreadInfo } = useContext(ChatContext);
    const [lastActive, setLastActive] = useState('');

    useEffect(() => {
        const getLastActive = () => {
            if (thread.status === 'status-online') {
                setLastActive('Active on chat');
            } else {
                const lastDisconnect = moment(thread.lastDisconnect);
                const now = moment();
                const duration = moment.duration(now.diff(lastDisconnect));
                const hours = Math.floor(duration.asHours());
                const minutes = Math.floor(duration.asMinutes()) % 60;
                if (hours > 0) {
                    setLastActive(`Active ${hours}h ago`);
                } else if (minutes > 0) {
                    setLastActive(`Active ${minutes}m ago`);
                } else {
                    setLastActive('Active just now');
                }
            }
        };

        getLastActive();
        const intervalId = setInterval(() => {
            getLastActive();
        }, 60000);

        return () => clearInterval(intervalId);
    }, [thread]);

    return (
        <div className="chat-content-header">
            <Row className="flex-between-center">
                <Col xs={6} md={8} as={Flex} alignItems="center">
                    <div
                        className="pe-3 text-700 d-md-none contacts-list-show cursor-pointer"
                        onClick={() => setHideSidebar(true)}
                    >
                        <FontAwesomeIcon icon="chevron-left" />
                    </div>
                    <div className="min-w-0">
                        <h5 className="mb-0 text-truncate fs-0">
                            {thread.username}
                        </h5>
                        <div className="fs--2 text-400">{lastActive}</div>
                    </div>
                </Col>
                <Col xs="auto">
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip style={{ position: 'fixed' }}>
                                Start an Audio Call
                            </Tooltip>
                        }
                    >
                        <Button
                            variant="falcon-primary"
                            className="me-2"
                            size="sm"
                        >
                            <FontAwesomeIcon icon="phone" />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip style={{ position: 'fixed' }}>
                                Start a Video Call
                            </Tooltip>
                        }
                    >
                        <Button
                            variant="falcon-primary"
                            className="me-2"
                            size="sm"
                        >
                            <FontAwesomeIcon icon="video" />
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip style={{ position: 'fixed' }}>
                                Conversation Information
                            </Tooltip>
                        }
                    >
                        <Button
                            variant="falcon-primary"
                            size="sm"
                            onClick={() =>
                                setIsOpenThreadInfo(!isOpenThreadInfo)
                            }
                        >
                            <FontAwesomeIcon icon="info" />
                        </Button>
                    </OverlayTrigger>
                </Col>
            </Row>
        </div>
    );
};

ChatContentHeader.propTypes = {
    thread: PropTypes.object.isRequired,
    setHideSidebar: PropTypes.func.isRequired
};

export default ChatContentHeader;
