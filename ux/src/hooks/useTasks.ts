import {useContext} from 'react';
import TasksContext, {TasksContextValue} from 'src/store/TasksContext';

const useTasks = (): TasksContextValue => useContext(TasksContext);

export default useTasks;
