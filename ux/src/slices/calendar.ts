import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import type { AppThunk } from 'src/store'
import axios from 'src/utils/axios';
import type { Event } from 'src/types/calendar';

interface CalendarState {
  events: Event[],
  isModalOpen: boolean;
  selectedEventId: string | null;
  selectedRange: {
    start: number;
    end: number;
  } | null;
}

const initialState: CalendarState = {
  events: [],
  isModalOpen: false,
  selectedEventId: null,
  selectedRange: null
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    getEvents(state: CalendarState, action: PayloadAction<{ events: Event[]; }>) {
      const { events } = action.payload;

      state.events = events;
    },
    createEvent(state: CalendarState, action: PayloadAction<{ event: Event; }>) {
      const { event } = action.payload;

      state.events = [...state.events, event];
    },
    selectEvent(state: CalendarState, action: PayloadAction<{ eventId?: string; }>) {
      const { eventId = null } = action.payload;

      state.isModalOpen = true;
      state.selectedEventId = eventId;
    },
    updateEvent(state: CalendarState, action: PayloadAction<{ event: Event; }>) {
      const { event } = action.payload;

      state.events = _.map(state.events, (_event) => {
        if (_event.id === event.id) {
          return event;
        }

        return _event;
      });
    },
    deleteEvent(state: CalendarState, action: PayloadAction<{ eventId: string; }>) {
      const { eventId } = action.payload;

      state.events = _.reject(state.events, { id: eventId });
    },
    selectRange(state: CalendarState, action: PayloadAction<{ start: number; end: number; }>) {
      const { start, end } = action.payload;

      state.isModalOpen = true;
      state.selectedRange = {
        start,
        end
      };
    },
    openModal(state: CalendarState) {
      state.isModalOpen = true;
    },
    closeModal(state: CalendarState) {
      state.isModalOpen = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    }
  }
});

export const reducer = slice.reducer;

export const getEvents = (): AppThunk => async (dispatch) => {
  const response = await axios.get<{ events: Event[]; }>('/api/calendar/events');

  dispatch(slice.actions.getEvents(response.data));
};

export const createEvent = (data: any): AppThunk => async (dispatch) => {
  const response = await axios.post<{ event: Event; }>('/api/calendar/events/new', data);

  dispatch(slice.actions.createEvent(response.data));
};

export const selectEvent = (eventId?: string): AppThunk => async (dispatch) => {
  dispatch(slice.actions.selectEvent({ eventId }));
};

export const updateEvent = (eventId: string, update: any): AppThunk => async (dispatch) => {
  const response = await axios.post<{ event: Event; }>('/api/calendar/events/update', {
    eventId,
    update
  });

  dispatch(slice.actions.updateEvent(response.data));
};

export const deleteEvent = (eventId: string): AppThunk => async (dispatch) => {
  await axios.post('/api/calendar/events/remove', {
    eventId
  });

  dispatch(slice.actions.deleteEvent({ eventId }));
};

export const selectRange = (start: Date, end: Date): AppThunk => (dispatch) => {
  dispatch(slice.actions.selectRange({
    start: start.getTime(),
    end: end.getTime()
  }));
};

export const openModal = (): AppThunk => (dispatch) => {
  dispatch(slice.actions.openModal());
};

export const closeModal = (): AppThunk => (dispatch) => {
  dispatch(slice.actions.closeModal());
};

export default slice;
