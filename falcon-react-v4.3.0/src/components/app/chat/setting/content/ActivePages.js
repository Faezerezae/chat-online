import React from 'react';
import { Card, Tab } from 'react-bootstrap';
import SettingProvider from '../SettingChatProvider';
import Flex from 'components/common/Flex';

const ActivePagesTab = () => {
    return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="0">
            <Card className="card-Setting overflow-hidden">
                <Card.Body as={Flex} className="p-3 h-100">
                    Active page
                </Card.Body>
            </Card>
        </Tab.Container>
    );
};
const ActivePages = () => {
    return (
        <SettingProvider>
            <ActivePagesTab />
        </SettingProvider>
    );
};

export default ActivePages;
