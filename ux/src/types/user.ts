export interface User {
    id: string;
    email: string;
    name: string;
    created_at: string;
    is_verified: boolean;
    is_admin: boolean;
    scope: 'github' | 'google' | 'stackoverflow' | null;
    avatar: string | null;
    tier: 'standard' | 'premium' | 'business';
    phone?: string;
    country?: string;
    city?: string;
    isPublic?: boolean;

    [key: string]: any;
}
