export type TaskType = 'generator' | 'augmentor';

export interface Task {
    id: string;
    user_id: string;
    dataset_id: string | null;
    type: TaskType;
    properties: object,
    created_at: string;
    status: 'pending' | 'active' | 'success' | 'failed',
    progress: number,
    ended_at?: string;
    error?: string
};
