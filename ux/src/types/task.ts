export interface Task {
    _id: string;
    user_id: string;
    dataset_id: string;
    type: string;
    created_at: string;
    status: 'pending' | 'active' | 'success' | 'failed',
    progress: number,
    error?: string
}
