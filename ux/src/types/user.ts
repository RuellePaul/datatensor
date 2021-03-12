export interface User {
    id: string;
    email: string;
    name: string;
    created_at: string;
    scope?: string;
    avatar?: string;

    [key: string]: any;
}
