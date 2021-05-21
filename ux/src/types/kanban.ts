export interface Attachment {
    id: string;
}

export interface CheckItem {
    id: string;
    name: string;
    checklistId?: string;
    state: 'incomplete' | 'complete';
}

export interface Checklist {
    id: string;
    name: string;
    checkItems: CheckItem[];
}

export interface Card {
    id: string;
    attachments: Attachment[];
    checklists: Checklist[];
    cover: string | null;
    description: string | null;
    due: number | null;
    isSubscribed: boolean;
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
