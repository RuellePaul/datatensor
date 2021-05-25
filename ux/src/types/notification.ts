export interface Notification {
    _id: string;
    user_id: string;
    type: 'TASK_SUCCEED' | 'TASK_FAILED';
    description?: string;
    created_at: string;
}