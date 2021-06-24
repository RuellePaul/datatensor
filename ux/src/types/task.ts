export type TaskType = 'generator' | 'augmentor';

export type TaskStatus = 'pending' | 'active' | 'success' | 'failed';

export interface Task {
    id: string;
    user_id: string;
    dataset_id: string | null;
    type: TaskType;
    properties: object,
    created_at: string;
    status: TaskStatus,
    progress: number,
    ended_at?: string;
    error?: string
};
