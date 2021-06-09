export interface Operation {
    id: string;
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
