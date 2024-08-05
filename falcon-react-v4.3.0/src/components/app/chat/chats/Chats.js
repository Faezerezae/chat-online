import React, { useState, useEffect } from 'react';
import { Card, Tab } from 'react-bootstrap';
import ChatProvider from './ChatProvider';
import ChatSidebar from './sidebar/ChatSidebar';
import ChatContent from './content/ChatContent';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'components/common/Flex';
import { fetchUsers, addUser, addUserInfo } from '../../../../redux/chatSlice';
import io from 'socket.io-client';

export const socket = io('http://localhost:10000');

const ChatTab = () => {
    const dispatch = useDispatch();
    const users = useSelector(state => state.chat.users);
    const [hideSidebar, setHideSidebar] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleSelect = e => {
        setSelectedUserId(e);
        setHideSidebar(false);
    };

    useEffect(() => {
        dispatch(fetchUsers());

        const handleNewUser = newUser => {
            dispatch(addUser(newUser));
        };

        const handleUserInfo = updatedUserInfo => {
            dispatch(addUserInfo(updatedUserInfo));
        };

        socket.on('userInfo', handleUserInfo);
        socket.on('newUser', handleNewUser);

        return () => {
            socket.off('newUser', handleNewUser);
            socket.off('userInfo', handleUserInfo);
        };
    }, [dispatch]);

    useEffect(() => {
        // Check if the selected user is blocked and handle accordingly
        if (selectedUserId) {
            const updatedUser = users.find(u => u._id === selectedUserId);
            if (updatedUser && updatedUser.blocked === 'true') {
                setSelectedUserId(null); // Clear selection if the user is blocked
                console.warn('User is blocked.');
            }
        }
    }, [users, selectedUserId]);

    const selectedUser = users.find(user => user._id === selectedUserId);

    return (
        <Tab.Container
            id="left-tabs-example"
            defaultActiveKey="0"
            onSelect={handleSelect}
        >
            <Card className="card-chat overflow-hidden">
                <Card.Body as={Flex} className="p-0 h-100">
                    <ChatSidebar hideSidebar={hideSidebar} threads={users} />
                    {selectedUser && selectedUser.blocked === 'false' ? (
                        <ChatContent
                            setHideSidebar={setHideSidebar}
                            thread={selectedUser}
                        />
                    ) : (
                        <div>WelcomBack</div> // Customize this message or component
                    )}
                </Card.Body>
            </Card>
        </Tab.Container>
    );
};

const Chats = () => {
    return (
        <ChatProvider>
            <ChatTab />
        </ChatProvider>
    );
};

export default Chats;
