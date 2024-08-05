import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'components/common/Avatar';
import Flex from 'components/common/Flex';

const ChatContentBodyIntro = ({ user, isGroup }) => {
    return (
        <Flex
            alignItems="center"
            className="position-relative p-3 border-bottom mb-3"
        >
            <Avatar
                className={`${user.status} me-3`}
                size="2xl"
                src={user.avatar}
            />
            <div className="flex-1">
                <h6 className="mb-0">
                    <Link
                        to="/user/profile"
                        className="text-decoration-none stretched-link text-700"
                    >
                        {user.username}
                    </Link>
                </h6>
                <p className="mb-0">
                    {isGroup
                        ? `You are a member of ${user.username}. Say hi to start conversation to the group.`
                        : `You friends with ${user.username}. Say hi to start the conversation`}
                </p>
            </div>
        </Flex>
    );
};

ChatContentBodyIntro.propTypes = {
    isGroup: PropTypes.bool,
    user: PropTypes.any
};

export default ChatContentBodyIntro;
