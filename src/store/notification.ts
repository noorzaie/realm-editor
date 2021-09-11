import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from 'src/types/notificationTypes';

export interface StateType {
    notifications: Notification[];
}

const initialState: StateType = {
    notifications: []
};

const notification = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state: StateType, action: PayloadAction<Notification>) => {
            action.payload.id = Math.random();
            state.notifications = [
                ...state.notifications,
                action.payload
            ];
        },
        removeNotification: (state: StateType, action: PayloadAction<number>) => {
            state.notifications = state.notifications.filter(({ id }) => id !== action.payload);
        }
    }
});

export const { addNotification, removeNotification } = notification.actions;
export default notification.reducer;
