import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';
import type {AppThunk} from 'src/store'
import api from 'src/utils/api';
import objFromArray from 'src/utils/objFromArray';
import type {Board, Card, List} from 'src/types/pipeline';

const board: Board = {
    lists: [
        {
            id: '5e849c39325dc5ef58e5a5db',
            name: 'Pipeline',
            cardIds: [
                '5e849c8708bd72683b454747',
                '5e849c90fabe1f1f4b3557f6',
                '5e849c977ef6265938bfd90b',
                '5e849c9e34ee93bc7255c599'
            ]
        }
    ],
    cards: [
        {
            id: '5e849c8708bd72683b454747',
            cover: '/static/images/projects/project_3.png',
            description: 'Duis condimentum lacus finibus felis pellentesque, ac auctor nibh fermentum. Duis sed dui ante. Phasellus id eros tincidunt, dictum lorem vitae, pellentesque sem. Aenean eu enim sit amet mauris rhoncus mollis. Sed enim turpis, porta a felis et, luctus faucibus nisi. Phasellus et metus fermentum, ultrices arcu aliquam, facilisis justo. Cras nunc nunc, elementum sed euismod ut, maximus eget nibh. Phasellus condimentum lorem neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce sagittis pharetra eleifend. Suspendisse potenti.',
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Call with sales of HubSpot'
        },
        {
            id: '5e849c90fabe1f1f4b3557f6',
            cover: null,
            description: 'We are looking for vue experience and of course node js strong knowledge',
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Interview for the Asis. Sales Manager'
        },
        {
            id: '5e849c977ef6265938bfd90b',
            cover: null,
            description: 'We nede to make it aggresive with pricing because it’s in their interest to acquire us',
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Change the height of the top bar because it looks too chunky',
        },
        {
            id: '5e849c9e34ee93bc7255c599',
            cover: null,
            description: 'We nede to make it aggresive with pricing because it’s in their interest to acquire us',
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Integrate Stripe API'
        }
    ]
};

interface PipelineState {
    isLoaded: boolean;
    lists: {
        byId: Record<string, List>;
        allIds: string[];
    };
    cards: {
        byId: Record<string, Card>;
        allIds: string[];
    };
}

const initialState: PipelineState = {
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
    name: 'pipeline',
    initialState,
    reducers: {
        getBoard(state: PipelineState, action: PayloadAction<{ board: Board; }>) {
            const {board} = action.payload;

            state.lists.byId = objFromArray(board.lists);
            state.lists.allIds = Object.keys(state.lists.byId);
            state.cards.byId = objFromArray(board.cards);
            state.cards.allIds = Object.keys(state.cards.byId);
            state.isLoaded = true;
        },
        createCard(state: PipelineState, action: PayloadAction<{ card: Card; }>) {
            const {card} = action.payload;

            state.cards.byId[card.id] = card;
            state.cards.allIds.push(card.id);
            state.lists.byId[card.listId].cardIds.push(card.id);
        },
        updateCard(state: PipelineState, action: PayloadAction<{ card: Card; }>) {
            const {card} = action.payload;

            _.merge(state.cards.byId[card.id], card);
        },
        moveCard(state: PipelineState, action: PayloadAction<{ cardId: string; position: number; listId?: string; }>) {
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
        deleteCard(state: PipelineState, action: PayloadAction<{ cardId: string; }>) {
            const {cardId} = action.payload;
            const {listId} = state.cards.byId[cardId];

            state.cards.byId = _.omit(state.cards.byId, cardId);
            _.pull(state.cards.allIds, cardId);
            _.pull(state.lists.byId[listId].cardIds, cardId);
        },
    }
});

export const reducer = slice.reducer;

export const getBoard = (): AppThunk => async (dispatch) => {
    const response = {data: {board}};

    dispatch(slice.actions.getBoard(response.data));
};

export const createCard = (listId: string, name: string): AppThunk => async (dispatch) => {
    const response = await api.post<{ card: Card; }>('/api/pipeline/cards/new', {
        listId,
        name
    });

    dispatch(slice.actions.createCard(response.data));
};

export const updateCard = (cardId: string, update: any): AppThunk => async (dispatch) => {
    const response = await api.post<{ card: Card; }>('/api/pipeline/cards/update', {
        cardId,
        update
    });

    dispatch(slice.actions.updateCard(response.data));
};

export const moveCard = (cardId: string, position: number, listId?: string): AppThunk => async (dispatch) => {
    await api.post('/api/pipeline/cards/move', {
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
    await api.post('/api/pipeline/cards/remove', {
        cardId
    });

    dispatch(slice.actions.deleteCard({cardId}));
};

export default slice;
