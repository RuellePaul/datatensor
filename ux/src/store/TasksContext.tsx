import React, {createContext, FC, ReactNode, useEffect, useRef, useState} from 'react';
import {Task} from 'src/types/task';
import {POLLING_DELAY} from 'src/constants';
import {API_HOSTNAME} from 'src/utils/api';

export interface TasksContextValue {
    tasks: Task[];
    saveTasks: (update: Task[] | ((tasks: Task[]) => Task[])) => void;
}

interface TasksProviderProps {
    children?: ReactNode;
}

export const TasksContext = createContext<TasksContextValue>({
    tasks: [],
    saveTasks: () => {
    }
});

let intervalID;

export const TasksProvider: FC<TasksProviderProps> = ({children}) => {

    const [currentTasks, setCurrentTasks] = useState<Task[]>([]);

    const ws = useRef(null);
    const [isPaused, setPaused] = useState(false);

    const handleSaveTasks = (update: Task[] | ((tasks: Task[]) => Task[])): void => {
        setCurrentTasks(update);
    };

    function sendMessage() {
        console.log('Fetch ws...')
        ws.current.send('');
    }

    // Send
    useEffect(() => {
        ws.current = new WebSocket(`ws://${API_HOSTNAME}/ws/tasks`);
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");

        intervalID = setInterval(sendMessage, POLLING_DELAY * 1000)

        return () => {
            ws.current.close();
            clearInterval(intervalID);
        };
    }, []);

    // Receive
    useEffect(() => {
        if (!ws.current) return;

        ws.current.onmessage = (event) => {
            if (isPaused) return;

            handleSaveTasks(JSON.parse(event.data));
        };
    }, [isPaused]);

    let hasPendingOrActiveTasks = currentTasks.filter(task => ['pending', 'active'].includes(task.status)).length > 0;

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
