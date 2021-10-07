export interface Notification {
    id: string;
    user_id: string;
    type: 'TASK_SUCCEED' | 'TASK_FAILED' | 'EMAIL_CONFIRM_REQUIRED' | 'EMAIL_CONFIRM_DONE' | 'REGISTRATION';
    created_at: string;
    opened: boolean;
    task_id?: string;
}
