import {combineReducers} from '@reduxjs/toolkit';
import {reducer as notificationReducer} from 'src/slices/notification';
import {reducer as kanbanReducer} from 'src/slices/pipeline';


const rootReducer = combineReducers({
    pipeline: kanbanReducer,
    notifications: notificationReducer
});

export default rootReducer;
