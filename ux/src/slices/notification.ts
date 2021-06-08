import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from 'src/store'
import {Notification} from 'src/types/notification';
import api from 'src/utils/api';

interface NotificationsState {
    notifications: Notification[];
}

const initialState: NotificationsState = {
    notifications: []
};

const slice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications(state: NotificationsState, action: PayloadAction<{ notifications: Notification[]; }>) {
            const {notifications} = action.payload;

            state.notifications = notifications;
        },
        deleteNotifications(state: NotificationsState) {
            state.notifications = [];
        },
    }
});

export const reducer = slice.reducer;

export const setNotifications = (state: NotificationsState): AppThunk => async (dispatch) => {
    dispatch(slice.actions.setNotifications(state));
};

export const deleteNotifications = (): AppThunk => async (dispatch) => {
    await api.delete('/notifications/');

    dispatch(slice.actions.deleteNotifications());
};


export default slice;
