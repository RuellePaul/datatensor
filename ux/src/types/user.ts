export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    scope?: string;
    avatar?: string;

    [key: string]: any;
}
