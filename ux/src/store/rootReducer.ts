import {combineReducers} from '@reduxjs/toolkit';
import {reducer as notificationReducer} from 'src/slices/notification';
import {reducer as kanbanReducer} from 'src/slices/kanban';


const rootReducer = combineReducers({
    kanban: kanbanReducer,
    notifications: notificationReducer
});

export default rootReducer;
