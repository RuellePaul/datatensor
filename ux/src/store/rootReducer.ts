import {combineReducers} from '@reduxjs/toolkit';
import {reducer as notificationReducer} from 'src/slices/notification';

const rootReducer = combineReducers({
    notifications: notificationReducer
});

export default rootReducer;
