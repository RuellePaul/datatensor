export type TaskType = 'generator' | 'augmentor';

export type TaskStatus = 'pending' | 'active' | 'success' | 'failed';

export interface TaskGeneratorProperties {
    datasource_key: string;
    selected_categories: string[];
    image_count: number
}

export interface TaskAugmentorProperties {
    image_count: number
}


export type TaskProperties = TaskGeneratorProperties | TaskAugmentorProperties

export interface Task {
    id: string;
    user_id: string;
    dataset_id: string | null;
    type: TaskType;
    properties: TaskProperties,
    created_at: string;
    status: TaskStatus,
    progress: number,
    ended_at?: string;
    error?: string
};
