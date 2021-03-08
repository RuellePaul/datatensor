import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store'
import axios from 'src/utils/axios';
import type { Notification } from 'src/types/notification';

interface NotificationsState {
  notifications: Notification[];
};

const initialState: NotificationsState = {
  notifications: []
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    getNotifications(state: NotificationsState, action: PayloadAction<{ notifications: Notification[]; }>) {
      const { notifications } = action.payload;

      state.notifications = notifications;
    }
  }
});

export const reducer = slice.reducer;

export const getNotifications = (): AppThunk => async (dispatch) => {
  const response = await axios.get<{ notifications: Notification[]; }>('/api/notifications');

  dispatch(slice.actions.getNotifications(response.data));
};

export default slice;
