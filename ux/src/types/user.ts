export interface User {
    id: string;
    email: string;
    name: string;
    created_at: string;
    is_admin: boolean;
    scope?: string;
    avatar?: string;

    [key: string]: any;
}
