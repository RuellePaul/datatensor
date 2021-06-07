import React, {createContext, FC, ReactNode, useEffect, useRef, useState} from 'react';
import {Task} from 'src/types/task';
import {POLLING_DELAY} from 'src/constants';
import {API_HOSTNAME} from 'src/utils/api';

export interface TasksContextValue {
    tasks: Task[] | null;
    saveTasks: (update: Task[] | ((tasks: Task[]) => Task[])) => void;
}

interface TasksProviderProps {
    children?: ReactNode;
}

export const TasksContext = createContext<TasksContextValue>({
    tasks: null,
    saveTasks: () => {
    }
});

let intervalID;

export const TasksProvider: FC<TasksProviderProps> = ({children}) => {

    const [currentTasks, setCurrentTasks] = useState<Task[]>(null);

    const ws = useRef(null);
    const [isPaused, setPaused] = useState(false);

    const handleSaveTasks = (update: Task[] | ((tasks: Task[]) => Task[])): void => {
        setCurrentTasks(update);
    };

    function sendMessage() {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            console.log('Fetch ws...')
            ws.current.send('');
        }
    }

    // Send
    useEffect(() => {
        ws.current = new WebSocket(`ws://${API_HOSTNAME}/ws/tasks`);
        ws.current.onopen = () => {
            console.info('Task websocket opened.');
            setPaused(false);
        };
        ws.current.onclose = () => {
            console.info('Task websocket closed.');
        };

        return () => {
            ws.current.close();
            clearInterval(intervalID);
        };

    }, [])

    // Receive
    useEffect(() => {
        if (!ws.current) return;

        if (isPaused)
            clearInterval(intervalID)
        else
            intervalID = setInterval(sendMessage, POLLING_DELAY)

        ws.current.onmessage = (event) => {
            if (isPaused) return;

            handleSaveTasks(JSON.parse(event.data));
        };
    }, [isPaused]);

    useEffect(() => {
        if (!currentTasks) return;

        let hasPendingOrActiveTasks = currentTasks.filter(task => ['pending', 'active'].includes(task.status)).length > 0;
        setPaused(!hasPendingOrActiveTasks);
    }, [currentTasks])

    return (
        <TasksContext.Provider
            value={{
                tasks: currentTasks,
                saveTasks: handleSaveTasks
            }}
        >
            {children}
        </TasksContext.Provider>
    )
};

export const TasksConsumer = TasksContext.Consumer;

export default TasksContext;
