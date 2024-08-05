import React from 'react';
import { Card, Tab } from 'react-bootstrap';
import SettingProvider from '../SettingChatProvider';
import Flex from 'components/common/Flex';
import io from 'socket.io-client';

export const socket = io('http://localhost:10000');

const ReadyAnswerTab = () => {
    return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="0">
            <Card className="card-Setting overflow-hidden">
                <Card.Body as={Flex} className="p-0 h-100">
                    ReadyAnswer
                </Card.Body>
            </Card>
        </Tab.Container>
    );
};

const ReadyAnswer = () => {
    return (
        <SettingProvider>
            <ReadyAnswerTab />
        </SettingProvider>
    );
};

export default ReadyAnswer;
