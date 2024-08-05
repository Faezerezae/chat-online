import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

const initialState = {
    messages: [],
    users: [],
    status: 'idle',
    error: null,
    usersMessages: {}
};

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (userId, { getState, dispatch }) => {
        try {
            const { auth } = getState();
            const response = await axiosInstance.get(`/messages/${userId}`, {
                headers: { Authorization: auth.token }
            });
            dispatch(setUserMessages({ userId, messages: response.data }));
            return response.data;
        } catch (error) {
            throw error.response.data.message;
        }
    }
);

export const fetchUsers = createAsyncThunk(
    'chat/fetchUsers',
    async (_, { getState }) => {
        const { auth } = getState();
        const response = await axiosInstance.get('/auth/users', {
            params: {
                role: 'User',
                blocked: 'false'
            },
            headers: { Authorization: auth.token }
        });
        return response.data;
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
            if (state.usersMessages[action.payload.userId]) {
                state.usersMessages[action.payload.userId].push(action.payload);
            } else {
                state.usersMessages[action.payload.userId] = [action.payload];
            }
        },
        updateMessage: (state, action) => {
            const { messageId, newMessage } = action.payload;
            for (const userId in state.usersMessages) {
                const messages = state.usersMessages[userId];
                const messageIndex = messages.findIndex(
                    msg => msg._id === messageId
                );
                if (messageIndex !== -1) {
                    messages[messageIndex].message = newMessage;
                    state.usersMessages[userId] = messages;
                    break;
                }
            }
            state.messages = state.messages.map(msg =>
                msg._id === messageId ? { ...msg, message: newMessage } : msg
            );
        },
        deleteMessage: (state, action) => {
            const messageId = action.payload;
            for (const userId in state.usersMessages) {
                const messages = state.usersMessages[userId];
                const updatedMessages = messages.filter(
                    msg => msg._id !== messageId
                );
                state.usersMessages[userId] = updatedMessages;
            }
            state.messages = state.messages.filter(
                msg => msg._id !== messageId
            );
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setUserMessages: (state, action) => {
            const { userId, messages } = action.payload;
            state.usersMessages[userId] = messages;
        },
        addUser: (state, action) => {
            state.users.push(action.payload);
        },
        addUserInfo: (state, action) => {
            const updatedUser = action.payload;
            const existingUserIndex = state.users.findIndex(
                user => user._id === updatedUser._id
            );
            if (existingUserIndex !== -1) {
                state.users[existingUserIndex] = updatedUser;
            } else {
                state.users.push(updatedUser);
            }
        },
        removeUser: (state, action) => {
            const userIdToRemove = action.payload;
            // Remove user from the users array
            state.users = state.users.filter(
                user => user._id !== userIdToRemove
            );
            // Remove user messages
            delete state.usersMessages[userIdToRemove];
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchMessages.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
            });
    }
});

export const {
    addMessage,
    removeUser,
    setUsers,
    setUserMessages,
    addUser,
    addUserInfo,
    updateMessage,
    deleteMessage
} = chatSlice.actions;

export default chatSlice.reducer;
