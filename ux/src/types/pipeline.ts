export interface Operation {
    id: string;
    description: string | null;
    listId: string;
    name: string;
}

export interface List {
    id: string;
    name: string;
    operationIds: string[];
}

export interface Board {
    operations: Operation[];
    lists: List[];
}
