import React, {createContext, FC, ReactNode, useEffect, useRef, useState} from 'react';
import {Task} from 'src/types/task';
import {POLLING_DELAY} from 'src/constants';
import {API_HOSTNAME} from 'src/utils/api';
import {setNotifications} from 'src/slices/notification';
import {useDispatch} from './index';
import useAuth from 'src/hooks/useAuth';

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

let tasksIntervalID;
let notificationsIntervalID;

export const TasksProvider: FC<TasksProviderProps> = ({children}) => {

    const {accessToken} = useAuth();
    const [currentTasks, setCurrentTasks] = useState<Task[]>(null);
    const dispatch = useDispatch();

    const wsTask = useRef(null);
    const wsNotifications = useRef(null);
    const [isPaused, setPaused] = useState(false);

    const handleSaveTasks = (update: Task[] | ((tasks: Task[]) => Task[])): void => {
        setCurrentTasks(update);
    };

    // Send
    useEffect(() => {
        wsTask.current = new WebSocket(`ws://${API_HOSTNAME}/ws/tasks`);
        wsTask.current.onopen = () => {
            console.info('Task websocket opened.');
            setPaused(false);
        };
        wsTask.current.onclose = () => {
            console.info('Task websocket closed.');
        };

        wsNotifications.current = new WebSocket(`ws://${API_HOSTNAME}/ws/notifications`);
        wsNotifications.current.onopen = () => {
            console.info('Notifications websocket opened.');
            setPaused(false);
        };
        wsNotifications.current.onclose = () => {
            console.info('Notifications websocket closed.');
        };

        return () => {
            wsTask.current.close();
            clearInterval(tasksIntervalID);
            wsNotifications.current.close();
            clearInterval(notificationsIntervalID);
        };
    }, []);

    // Receive tasks
    useEffect(() => {
        if (!wsTask.current) return;

        function sendTaskMessage() {
            console.log('Send tasks poll...')
            if (wsTask.current && wsTask.current.readyState === WebSocket.OPEN) {
                wsTask.current.send(accessToken);
            }
        }

        if (isPaused)
            clearInterval(tasksIntervalID)
        else
            tasksIntervalID = setInterval(sendTaskMessage, POLLING_DELAY)

        wsTask.current.onmessage = (event) => {
            handleSaveTasks(JSON.parse(event.data));
        };
    }, [isPaused, accessToken]);

    // Receive notifications
    useEffect(() => {
        if (!wsNotifications.current) return;

        function sendNotificationsMessage() {
            console.log('Send notifications poll...')
            if (wsNotifications.current && wsNotifications.current.readyState === WebSocket.OPEN) {
                wsNotifications.current.send(accessToken);
            }
        }

        if (isPaused)
            clearInterval(notificationsIntervalID)
        else
            notificationsIntervalID = setInterval(sendNotificationsMessage, POLLING_DELAY)

        wsNotifications.current.onmessage = (event) => {
            dispatch(setNotifications(JSON.parse(event.data)));
        };
    }, [isPaused, dispatch, accessToken]);

    useEffect(() => {
        if (currentTasks && accessToken) {
            let hasPendingOrActiveTasks = currentTasks.filter(task => ['pending', 'active'].includes(task.status)).length > 0;
            setPaused(!hasPendingOrActiveTasks);
        }
    }, [currentTasks, accessToken])

    if (!accessToken)
        return null

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
