export interface User {
    id: string;
    email: string;
    name: string;
    created_at: string;
    is_admin: boolean;
    scope: 'github' | 'google' | 'stackoverflow' | null;
    avatar?: string;

    [key: string]: any;
}
