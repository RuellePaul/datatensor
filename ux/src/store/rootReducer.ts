import {combineReducers} from '@reduxjs/toolkit';
import {reducer as notificationReducer} from 'src/slices/notification';
import {reducer as pipelineReducer} from 'src/slices/pipeline';


const rootReducer = combineReducers({
    pipeline: pipelineReducer,
    notifications: notificationReducer
});

export default rootReducer;
