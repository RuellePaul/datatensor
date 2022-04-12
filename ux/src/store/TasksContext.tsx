import React, {createContext, FC, ReactNode, useEffect, useRef, useState} from 'react';
import {Task} from 'src/types/task';
import useAuth from 'src/hooks/useAuth';
import {HEARTBEAT_DELAY} from 'src/constants';
import {WS_HOSTNAME} from 'src/utils/api';
import {setTasks} from 'src/slices/tasks';
import {useDispatch} from 'react-redux';

export interface TasksContextValue {
    tasks: Task[] | null;
    saveTasks: (update: Task[] | ((tasks: Task[]) => Task[])) => void;
    isPaused: boolean;
    savePaused: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TasksProviderProps {
    dataset_id: string;
    children?: ReactNode;
}

export const TasksContext = createContext<TasksContextValue>({
    tasks: null,
    saveTasks: () => {},
    isPaused: false,
    savePaused: () => {}
});

let tasksIntervalID;

export const TasksProvider: FC<TasksProviderProps> = ({dataset_id, children}) => {
    const dispatch = useDispatch();

    const {accessToken} = useAuth();

    const wsTask = useRef(null);
    const [isPaused, setPaused] = useState(false);

    const [currentTasks, setCurrentTasks] = useState<Task[]>(null);

    const handleSaveTasks = (update: Task[] | ((tasks: Task[]) => Task[])): void => {
        setCurrentTasks(update);
    };

    // Send
    useEffect(() => {
        wsTask.current = new WebSocket(`${WS_HOSTNAME}/datasets/${dataset_id}/tasks`);
        wsTask.current.onopen = () => {
            console.info('Task websocket opened.');
            setPaused(false);
        };
        wsTask.current.onclose = () => {
            console.info('Task websocket closed.');
        };

        return () => {
            wsTask.current.close();
            clearInterval(tasksIntervalID);
        };
    }, [dataset_id]);

    // Receive tasks
    useEffect(() => {
        if (!wsTask.current) return;

        function sendTaskMessage() {
            if (wsTask.current && wsTask.current.readyState === WebSocket.OPEN) {
                console.log('Send tasks poll...');
                wsTask.current.send(accessToken);
            }
        }

        if (isPaused) clearInterval(tasksIntervalID);
        else tasksIntervalID = setInterval(sendTaskMessage, HEARTBEAT_DELAY);

        wsTask.current.onmessage = event => {
            let tasksReceived = JSON.parse(event.data);
            handleSaveTasks(tasksReceived);
            dispatch(setTasks({tasks: tasksReceived}));
        };
    }, [isPaused, accessToken, dispatch]);

    useEffect(() => {
        if (currentTasks && accessToken) {
            let hasPendingOrActiveTasks =
                currentTasks.filter(task => ['pending', 'active'].includes(task.status)).length > 0;
            setPaused(!hasPendingOrActiveTasks);
        }
    }, [currentTasks, accessToken]);

    if (!accessToken) return null;

    return (
        <TasksContext.Provider
            value={{
                tasks: currentTasks,
                saveTasks: handleSaveTasks,
                isPaused: isPaused,
                savePaused: setPaused
            }}
        >
            {children}
        </TasksContext.Provider>
    );
};

export const TasksConsumer = TasksContext.Consumer;

export default TasksContext;
