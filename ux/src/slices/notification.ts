import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from 'src/store'
import {Notification} from 'src/types/notification';

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
        getNotifications(state: NotificationsState, action: PayloadAction<{ notifications: Notification[]; }>) {
            const {notifications} = action.payload;

            state.notifications = notifications;
        },
        deleteNotifications(state: NotificationsState) {
            state.notifications = [];
        },
    }
});

export const reducer = slice.reducer;

export const getNotifications = (): AppThunk => async (dispatch) => {
    // const response = await api.get<{ notifications: Notification[]; }>('/notifications/');

    // dispatch(slice.actions.getNotifications(response.data));
};

export const deleteNotifications = (): AppThunk => async (dispatch) => {
    await api.delete('/notifications/');

    dispatch(slice.actions.deleteNotifications());
};


export default slice;
