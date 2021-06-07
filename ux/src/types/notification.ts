export interface Notification {
    _id: string;
    user_id: string;
    type: 'TASK_SUCCEED' | 'TASK_FAILED' | 'EMAIL_CONFIRM_REQUIRED' | 'EMAIL_CONFIRM_DONE' | 'REGISTRATION';
    description?: string;
    created_at: string;
}