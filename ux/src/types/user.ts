export interface User {
    id: string;
    email: string;
    name: string;
    created_at: string;
    is_admin: boolean;
    scope: 'github' | 'google' | 'stackoverflow' | null;
    avatar: string | null;
    tier: 'standard' | 'premium' | 'business';

    [key: string]: any;
}
