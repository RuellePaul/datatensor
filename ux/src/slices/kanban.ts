import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';
import type {AppThunk} from 'src/store'
import api from 'src/utils/api';
import objFromArray from 'src/utils/objFromArray';
import type {Board, Card, CheckItem, Checklist, Comment, List} from 'src/types/kanban';
import moment from 'moment';

const board: Board = {
    lists: [
        {
            id: '5e849c39325dc5ef58e5a5db',
            name: 'Incoming',
            cardIds: [
                '5e849c8708bd72683b454747',
                '5e849c90fabe1f1f4b3557f6',
                '5e849c977ef6265938bfd90b',
                '5e849c9e34ee93bc7255c599'
            ]
        },
        {
            id: '5e849c2b38d238c33e516755',
            name: 'In progress',
            cardIds: [
                '5e849ca7d063dc3830d4b49c',
                '5e849cb5d0c6e8894451fdfa'
            ]
        }
    ],
    cards: [
        {
            id: '5e849c8708bd72683b454747',
            attachments: [],
            checklists: [
                {
                    id: '5e84a8175c48d3f5b1d01972',
                    name: 'Update home page',
                    checkItems: [
                        {
                            id: '5e85af37da584c5e4bd8a06c',
                            name: 'An item',
                            state: 'complete'
                        }
                    ]
                }
            ],
            comments: [
                {
                    id: '15e849c5a35d4dff4f88ebff6',
                    cardId: '5e849c8708bd72683b454747',
                    createdAt: moment()
                        .subtract(5, 'days')
                        .toDate()
                        .getTime(),
                    message: 'This is a comment'
                }
            ],
            cover: '/static/images/projects/project_3.png',
            description: 'Duis condimentum lacus finibus felis pellentesque, ac auctor nibh fermentum. Duis sed dui ante. Phasellus id eros tincidunt, dictum lorem vitae, pellentesque sem. Aenean eu enim sit amet mauris rhoncus mollis. Sed enim turpis, porta a felis et, luctus faucibus nisi. Phasellus et metus fermentum, ultrices arcu aliquam, facilisis justo. Cras nunc nunc, elementum sed euismod ut, maximus eget nibh. Phasellus condimentum lorem neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce sagittis pharetra eleifend. Suspendisse potenti.',
            due: moment()
                .add(7, 'days')
                .toDate()
                .getTime(),
            isSubscribed: false,
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Call with sales of HubSpot'
        },
        {
            id: '5e849c90fabe1f1f4b3557f6',
            attachments: [],
            checklists: [],
            comments: [],
            cover: null,
            description: 'We are looking for vue experience and of course node js strong knowledge',
            due: moment()
                .add(6, 'days')
                .toDate()
                .getTime(),
            isSubscribed: true,
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Interview for the Asis. Sales Manager'
        },
        {
            id: '5e849c977ef6265938bfd90b',
            attachments: [],
            checklists: [],
            comments: [],
            cover: null,
            description: 'We nede to make it aggresive with pricing because it’s in their interest to acquire us',
            due: null,
            isSubscribed: false,
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Change the height of the top bar because it looks too chunky',
        },
        {
            id: '5e849c9e34ee93bc7255c599',
            attachments: [],
            checklists: [],
            comments: [],
            cover: null,
            description: 'We nede to make it aggresive with pricing because it’s in their interest to acquire us',
            due: null,
            isSubscribed: false,
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Integrate Stripe API'
        },
        {
            id: '5e849ca7d063dc3830d4b49c',
            attachments: [],
            checklists: [],
            comments: [],
            cover: null,
            description: 'We need to make it aggresive with pricing because it’s in their interest to acquire us',
            due: null,
            isSubscribed: true,
            listId: '5e849c2b38d238c33e516755',
            name: 'Update the customer API for payments'
        },
        {
            id: '5e849cb5d0c6e8894451fdfa',
            attachments: [],
            checklists: [],
            comments: [],
            cover: null,
            description: 'We need to make it aggresive with pricing because it’s in their interest to acquire us',
            due: null,
            isSubscribed: true,
            listId: '5e849c2b38d238c33e516755',
            name: 'Redesign the landing page'
        }
    ]
};

interface KanbanState {
    isLoaded: boolean;
    lists: {
        byId: Record<string, List>;
        allIds: string[];
    };
    cards: {
        byId: Record<string, Card>;
        allIds: string[];
    };
};

const initialState: KanbanState = {
    isLoaded: false,
    lists: {
        byId: {},
        allIds: []
    },
    cards: {
        byId: {},
        allIds: []
    }
};

const slice = createSlice({
    name: 'kanban',
    initialState,
    reducers: {
        getBoard(state: KanbanState, action: PayloadAction<{ board: Board; }>) {
            const {board} = action.payload;

            state.lists.byId = objFromArray(board.lists);
            state.lists.allIds = Object.keys(state.lists.byId);
            state.cards.byId = objFromArray(board.cards);
            state.cards.allIds = Object.keys(state.cards.byId);
            state.isLoaded = true;
        },
        createList(state: KanbanState, action: PayloadAction<{ list: List; }>) {
            const {list} = action.payload;

            state.lists.byId[list.id] = list;
            state.lists.allIds.push(list.id);
        },
        updateList(state: KanbanState, action: PayloadAction<{ list: List; }>) {
            const {list} = action.payload;

            state.lists.byId[list.id] = list;
        },
        clearList(state: KanbanState, action: PayloadAction<{ listId: string; }>) {
            const {listId} = action.payload;
            const {cardIds} = state.lists.byId[listId];

            state.lists.byId[listId].cardIds = [];
            state.cards.byId = _.omit(state.cards.byId, cardIds);
            _.pull(state.cards.allIds, ...cardIds);
        },
        deleteList(state: KanbanState, action: PayloadAction<{ listId: string; }>) {
            const {listId} = action.payload;

            state.lists.byId = _.omit(state.lists.byId, listId);
            _.pull(state.lists.allIds, listId);
        },
        createCard(state: KanbanState, action: PayloadAction<{ card: Card; }>) {
            const {card} = action.payload;

            state.cards.byId[card.id] = card;
            state.cards.allIds.push(card.id);
            state.lists.byId[card.listId].cardIds.push(card.id);
        },
        updateCard(state: KanbanState, action: PayloadAction<{ card: Card; }>) {
            const {card} = action.payload;

            _.merge(state.cards.byId[card.id], card);
        },
        moveCard(state: KanbanState, action: PayloadAction<{ cardId: string; position: number; listId?: string; }>) {
            const {cardId, position, listId} = action.payload;
            const {listId: sourceListId} = state.cards.byId[cardId];

            // Remove card from source list
            _.pull(state.lists.byId[sourceListId].cardIds, cardId);

            // If listId arg exists, it means that
            // we have to add the card to the new list
            if (listId) {
                state.cards.byId[cardId].listId = listId;
                state.lists.byId[listId].cardIds.splice(position, 0, cardId);
            } else {
                state.lists.byId[sourceListId].cardIds.splice(position, 0, cardId);
            }
        },
        deleteCard(state: KanbanState, action: PayloadAction<{ cardId: string; }>) {
            const {cardId} = action.payload;
            const {listId} = state.cards.byId[cardId];

            state.cards.byId = _.omit(state.cards.byId, cardId);
            _.pull(state.cards.allIds, cardId);
            _.pull(state.lists.byId[listId].cardIds, cardId);
        },
        addComment(state: KanbanState, action: PayloadAction<{ comment: Comment; }>) {
            const {comment} = action.payload;
            const card = state.cards.byId[comment.cardId];

            card.comments.push(comment);
        },
        addChecklist(state: KanbanState, action: PayloadAction<{ cardId: string; checklist: Checklist; }>) {
            const {cardId, checklist} = action.payload;
            const card = state.cards.byId[cardId];

            card.checklists.push(checklist);
        },
        updateChecklist(state: KanbanState, action: PayloadAction<{ cardId: string; checklist: Checklist; }>) {
            const {cardId, checklist} = action.payload;
            const card = state.cards.byId[cardId];

            card.checklists = _.map(card.checklists, (_checklist) => {
                if (_checklist.id === checklist.id) {
                    return checklist;
                }

                return _checklist;
            });
        },
        deleteChecklist(state: KanbanState, action: PayloadAction<{ cardId: string; checklistId: string; }>) {
            const {cardId, checklistId} = action.payload;
            const card = state.cards.byId[cardId];

            card.checklists = _.reject(card.checklists, {id: checklistId});
        },
        addCheckItem(state: KanbanState, action: PayloadAction<{ cardId: string; checklistId: string; checkItem: CheckItem; }>) {
            const {cardId, checklistId, checkItem} = action.payload;
            const card = state.cards.byId[cardId];

            _.assign(card, {
                checklists: _.map(card.checklists, (checklist) => {
                    if (checklist.id === checklistId) {
                        _.assign(checklist, {
                            checkItems: [...checklist.checkItems, checkItem]
                        });
                    }

                    return checklist;
                })
            });
        },
        updateCheckItem(state: KanbanState, action: PayloadAction<{ cardId: string; checklistId: string; checkItem: CheckItem; }>) {
            const {
                cardId,
                checklistId,
                checkItem
            } = action.payload;
            const card = state.cards.byId[cardId];

            card.checklists = _.map(card.checklists, (checklist) => {
                if (checklist.id === checklistId) {
                    _.assign(checklist, {
                        checkItems: _.map(checklist.checkItems, (_checkItem) => {
                            if (_checkItem.id === checkItem.id) {
                                return checkItem;
                            }

                            return _checkItem;
                        })
                    });
                }

                return checklist;
            });
        },
        deleteCheckItem(state: KanbanState, action: PayloadAction<{ cardId: string; checklistId: string; checkItemId: string; }>) {
            const {cardId, checklistId, checkItemId} = action.payload;
            const card = state.cards.byId[cardId];

            card.checklists = _.map(card.checklists, (checklist) => {
                if (checklist.id === checklistId) {
                    _.assign(checklist, {
                        checkItems: _.reject(checklist.checkItems, {id: checkItemId})
                    });
                }

                return checklist;
            });
        }
    }
});

export const reducer = slice.reducer;

export const getBoard = (): AppThunk => async (dispatch) => {
    const response = {data: {board}};

    dispatch(slice.actions.getBoard(response.data));
};

export const createList = (name: string): AppThunk => async (dispatch) => {
    const response = await api.post<{ list: List; }>('/api/kanban/lists/new', {
        name
    });

    dispatch(slice.actions.createList(response.data));
};

export const updateList = (listId: string, update: any): AppThunk => async (dispatch) => {
    const response = await api.post<{ list: List; }>('/api/kanban/list/update', {
        listId,
        update
    });

    dispatch(slice.actions.updateList(response.data));
};

export const clearList = (listId: string): AppThunk => async (dispatch) => {
    await api.post('/api/kanban/lists/clear', {
        listId
    });

    dispatch(slice.actions.clearList({listId}));
};

export const deleteList = (listId: string): AppThunk => async (dispatch) => {
    await api.post('/api/kanban/lists/remove', {
        listId
    });

    dispatch(slice.actions.deleteList({listId}));
};

export const createCard = (listId: string, name: string): AppThunk => async (dispatch) => {
    const response = await api.post<{ card: Card; }>('/api/kanban/cards/new', {
        listId,
        name
    });

    dispatch(slice.actions.createCard(response.data));
};

export const updateCard = (cardId: string, update: any): AppThunk => async (dispatch) => {
    const response = await api.post<{ card: Card; }>('/api/kanban/cards/update', {
        cardId,
        update
    });

    dispatch(slice.actions.updateCard(response.data));
};

export const moveCard = (cardId: string, position: number, listId?: string): AppThunk => async (dispatch) => {
    await api.post('/api/kanban/cards/move', {
        cardId,
        position,
        listId
    });

    dispatch(slice.actions.moveCard({
        cardId,
        position,
        listId
    }));
};

export const deleteCard = (cardId: string): AppThunk => async (dispatch) => {
    await api.post('/api/kanban/cards/remove', {
        cardId
    });

    dispatch(slice.actions.deleteCard({cardId}));
};

export const addComment = (cardId: string, message: string): AppThunk => async (dispatch) => {
    const response = await api.post<{ comment: Comment; }>('/api/kanban/comments/new', {
        cardId,
        message
    });

    dispatch(slice.actions.addComment(response.data));
};

export const addChecklist = (cardId: string, name: string): AppThunk => async (dispatch) => {
    const response = await api.post<{ checklist: Checklist; }>('/api/kanban/checklists/new', {
        cardId,
        name
    });
    const {checklist} = response.data;

    dispatch(slice.actions.addChecklist({
        cardId,
        checklist
    }));
};

export const updateChecklist = (cardId: string, checklistId: string, update: any): AppThunk => async (dispatch) => {
    const response = await api.post<{ checklist: Checklist; }>('/api/kanban/checklists/update', {
        cardId,
        checklistId,
        update
    });
    const {checklist} = response.data;

    dispatch(slice.actions.updateChecklist({
        cardId,
        checklist
    }));
};

export const deleteChecklist = (cardId: string, checklistId: string): AppThunk => async (dispatch) => {
    await api.post('/api/kanban/checklists/remove', {
        cardId,
        checklistId
    });

    dispatch(slice.actions.deleteChecklist({
        cardId,
        checklistId
    }));
};

export const addCheckItem = (cardId: string, checklistId: string, name: string): AppThunk => async (dispatch) => {
    const response = await api.post<{ checkItem: CheckItem; }>('/api/kanban/checkitems/new', {
        cardId,
        checklistId,
        name
    });
    const {checkItem} = response.data;

    dispatch(slice.actions.addCheckItem({
        cardId,
        checklistId,
        checkItem
    }));
};

export const updateCheckItem = (cardId: string, checklistId: string, checkItemId: string, update: any): AppThunk => async (dispatch) => {
    const response = await api.post<{ checkItem: CheckItem; }>('/api/kanban/checkitems/update', {
        cardId,
        checklistId,
        checkItemId,
        update
    });
    const {checkItem} = response.data;

    dispatch(slice.actions.updateCheckItem({
        cardId,
        checklistId,
        checkItem
    }));
};

export const deleteCheckItem = (cardId: string, checklistId: string, checkItemId: string): AppThunk => async (dispatch) => {
    await api.post('/api/kanban/checkitems/remove', {
        cardId,
        checklistId,
        checkItemId
    });

    dispatch(slice.actions.deleteCheckItem({
        cardId,
        checklistId,
        checkItemId
    }));
};

export default slice;
