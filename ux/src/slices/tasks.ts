import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from 'src/store';
import {Task} from 'src/types/task';


interface TasksState {
    tasks: Task[];
}

const initialState: TasksState = {
    tasks: []
};

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks(state: TasksState, action: PayloadAction<{tasks: Task[]}>) {
            const {tasks} = action.payload;

            state.tasks = tasks;
        },
        addTask(state: TasksState, action: PayloadAction<Task>) {
            state.tasks.push(action.payload)
        }
    }
});

export const reducer = slice.reducer;

export const setTasks = (state: TasksState): AppThunk => async dispatch => {
    dispatch(slice.actions.setTasks(state));
};

export const addTask = (task: Task): AppThunk => async dispatch => {
    dispatch(slice.actions.addTask(task));
};

export default slice;
