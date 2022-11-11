import {combineReducers} from '@reduxjs/toolkit';
import {reducer as tasksReducer} from 'src/slices/tasks';
import {reducer as notificationReducer} from 'src/slices/notification';
import {reducer as pipelineReducer} from 'src/slices/pipeline';

const rootReducer = combineReducers({
    pipeline: pipelineReducer,
    notifications: notificationReducer,
    tasks: tasksReducer
});

export default rootReducer;
