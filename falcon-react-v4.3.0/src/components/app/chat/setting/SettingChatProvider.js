import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SettingContext } from 'context/Context'; // Ensure this path is correct
// import users from 'data/people';
// import rawThreads from 'data/Setting/threads';
// import rawMessages from 'data/Setting/messages';

// Updated SettingProvider
const SettingProvider = ({ children }) => {
    const [ok, setOk] = useState(32);

    const value = {
        ok,
        setOk
    };

    return (
        <SettingContext.Provider value={value}>
            {children}
        </SettingContext.Provider>
    );
};

SettingProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default SettingProvider;
