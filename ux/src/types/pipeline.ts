export interface Card {
    id: string;
    cover: string | null;
    description: string | null;
    listId: string;
    name: string;
}

export interface List {
    id: string;
    name: string;
    cardIds: string[];
}

export interface Board {
    cards: Card[];
    lists: List[];
}

import {Operation} from './operation';

export interface Pipeline {
    _id: string;
    dataset_id: string;
    operations: Operation[]
}
