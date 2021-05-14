import {useContext} from 'react';
import TasksContext, {TasksContextValue} from 'src/contexts/TasksContext';

const useTasks = (): TasksContextValue => useContext(TasksContext);

export default useTasks;
