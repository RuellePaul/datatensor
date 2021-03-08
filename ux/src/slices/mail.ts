import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store'
import axios from 'src/utils/axios';
import objFromArray from 'src/utils/objFromArray';
import type { Mail, Label } from 'src/types/mail';

interface MailState {
  mails: {
    byId: Record<string, Mail>;
    allIds: string[];
  };
  labels: Label[];
  isSidebarOpen: boolean;
  isComposeOpen: boolean;
}

const initialState: MailState = {
  mails: {
    byId: {},
    allIds: []
  },
  labels: [],
  isSidebarOpen: false,
  isComposeOpen: false
};

const slice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    getLabels(state: MailState, action: PayloadAction<{ labels: Label[]; }>) {
      const { labels } = action.payload;

      state.labels = labels;
    },
    getMails(state: MailState, action: PayloadAction<{ mails: Mail[]; }>) {
      const { mails } = action.payload;

      state.mails.byId = objFromArray(mails);
      state.mails.allIds = Object.keys(state.mails.byId);
    },
    getMail(state: MailState, action: PayloadAction<{ mail: Mail; }>) {
      const { mail } = action.payload;

      state.mails.byId[mail.id] = mail;

      if (!state.mails.allIds.includes(mail.id)) {
        state.mails.allIds.push(mail.id);
      }
    },
    openSidebar(state: MailState) {
      state.isSidebarOpen = true;
    },
    closeSidebar(state: MailState) {
      state.isSidebarOpen = false;
    },
    openCompose(state: MailState) {
      state.isComposeOpen = true;
    },
    closeCompose(state: MailState) {
      state.isComposeOpen = false;
    }
  }
});

export const reducer = slice.reducer;

export const getLabels = (): AppThunk => async (dispatch) => {
  const response = await axios.get<{ labels: Label[]; }>('/api/mail/labels');

  dispatch(slice.actions.getLabels(response.data));
};

export const getMails = (params: {}): AppThunk => async (dispatch) => {
  const response = await axios.get<{ mails: Mail[]; }>('/api/mail/mails', {
    params
  });

  dispatch(slice.actions.getMails(response.data));
};

export const getMail = (mailId: string): AppThunk => async (dispatch) => {
  const response = await axios.get<{ mail: Mail; }>('/api/mail/mail', {
    params: {
      mailId
    }
  });

  dispatch(slice.actions.getMail(response.data));
};

export const openSidebar = (): AppThunk => async (dispatch) => {
  dispatch(slice.actions.openSidebar());
};

export const closeSidebar = (): AppThunk => async (dispatch) => {
  dispatch(slice.actions.closeSidebar());
};

export const openCompose = (): AppThunk => async (dispatch) => {
  dispatch(slice.actions.openCompose());
};

export const closeCompose = (): AppThunk => async (dispatch) => {
  dispatch(slice.actions.closeCompose());
};

export default slice;
