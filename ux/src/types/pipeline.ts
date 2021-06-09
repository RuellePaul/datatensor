export interface Operation {
    id: string;
    name: string;
}

export interface Pipeline {
    operations: Operation[];
}
