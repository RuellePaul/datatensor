import React, {createContext, FC, ReactNode, useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {Task} from 'src/types/task';
import TaskDetails from 'src/components/core/TaskDetails';
import useAuth from 'src/hooks/useAuth';
import {HEARTBEAT_DELAY} from 'src/constants';
import {WS_HOSTNAME} from 'src/utils/api';

export interface TasksContextValue {
    tasks: Task[] | null;
    saveTasks: (update: Task[] | ((tasks: Task[]) => Task[])) => void;
    selectedTask: Task | null;
    saveSelectedTask: (update: Task | ((tasks: Task) => Task)) => void;
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
    selectedTask: null,
    saveSelectedTask: () => {},
    isPaused: false,
    savePaused: () => {}
});

let tasksIntervalID;

export const TasksProvider: FC<TasksProviderProps> = ({dataset_id, children}) => {
    const {accessToken} = useAuth();

    const location = useLocation();

    const wsTask = useRef(null);
    const [isPaused, setPaused] = useState(false);

    const [currentTasks, setCurrentTasks] = useState<Task[]>(null);
    const [selectedTask, setSelectedTask] = useState<Task>(null);

    const handleSaveTasks = (update: Task[] | ((tasks: Task[]) => Task[])): void => {
        setCurrentTasks(update);
    };

    const handleSaveSelectedTask = (update: Task | ((tasks: Task) => Task)): void => {
        setSelectedTask(update);
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
            handleSaveTasks(JSON.parse(event.data));
        };
    }, [isPaused, accessToken]);

    useEffect(() => {
        if (currentTasks && accessToken) {
            let hasPendingOrActiveTasks =
                currentTasks.filter(task => ['pending', 'active'].includes(task.status)).length > 0;
            setPaused(!hasPendingOrActiveTasks);
        }
    }, [currentTasks, accessToken]);

    useEffect(() => {
        if (selectedTask) setSelectedTask(currentTasks.find(task => task.id === selectedTask.id));

        // eslint-disable-next-line
    }, [currentTasks]);

    useEffect(() => {
        setSelectedTask(null);
    }, [location]);

    if (!accessToken) return null;

    return (
        <TasksContext.Provider
            value={{
                tasks: currentTasks,
                saveTasks: handleSaveTasks,
                selectedTask: selectedTask,
                saveSelectedTask: handleSaveSelectedTask,
                isPaused: isPaused,
                savePaused: setPaused
            }}
        >
            {children}

            <TaskDetails />
        </TasksContext.Provider>
    );
};

export const TasksConsumer = TasksContext.Consumer;

export default TasksContext;
