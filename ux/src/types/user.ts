export interface User {
    id: string;
    email: string;
    name: string;
    created_at: string;
    is_verified: boolean;
    is_admin: boolean;
    scope: 'github' | 'google' | 'stackoverflow' | null;
    avatar: string | null;
    phone?: string;
    country?: string;
    city?: string;
    is_public?: boolean;

    [key: string]: any;
}
