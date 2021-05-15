import React, {createContext, FC, ReactNode, useCallback, useEffect, useState} from 'react';
import {Task} from 'src/types/task';
import api from 'src/utils/api';
import {POLLING_DELAY} from 'src/constants';

export interface TasksContextValue {
    tasks: Task[];
    saveTasks: (update: Task[] | ((tasks: Task[]) => Task[])) => void;
    loading: boolean;
}

interface TasksProviderProps {
    children?: ReactNode;
}

export const TasksContext = createContext<TasksContextValue>({
    tasks: [],
    saveTasks: () => {
    },
    loading: true
});

export const TasksProvider: FC<TasksProviderProps> = ({children}) => {

    const [loading, setLoading] = useState(true);
    const [delayed, setDelayed] = useState(false);
    const [currentTasks, setCurrentTasks] = useState<Task[]>([]);

    const handleSaveTasks = (update: Task[] | ((tasks: Task[]) => Task[])): void => {
        setCurrentTasks(update);
    };

    const fetchTasks = useCallback(async () => {
        try {
            const response = await api.get<{ tasks: Task[] }>(`/tasks/`);
            handleSaveTasks(response.data.tasks);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setDelayed(false);
        }

    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        let hasPendingOrActiveTasks = currentTasks.filter(task => ['pending', 'active'].includes(task.status)).length > 0;

        if (hasPendingOrActiveTasks && !delayed) {
            setDelayed(true);
            setTimeout(fetchTasks, POLLING_DELAY * 1000);
        }
    }, [fetchTasks, currentTasks, delayed])

    return (
        <TasksContext.Provider
            value={{
                tasks: currentTasks,
                saveTasks: handleSaveTasks,
                loading: loading
            }}
        >
            {children}
        </TasksContext.Provider>
    )
};

export const TasksConsumer = TasksContext.Consumer;

export default TasksContext;
