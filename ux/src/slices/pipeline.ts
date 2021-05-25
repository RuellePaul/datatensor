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
            cover: '/static/images/examples/lenna.jpg',
            description: 'This performs rotation on image.',
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Rotation'
        },
        {
            id: '5e849c90fabe1f1f4b3557f6',
            cover: null,
            description: 'This performs gaussian distortion on image.',
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Gaussian Distortion'
        },
        {
            id: '5e849c977ef6265938bfd90b',
            cover: null,
            description: 'This performs rotation on image.',
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Rotation',
        },
        {
            id: '5e849c9e34ee93bc7255c599',
            cover: null,
            description: 'This performs elastic distortion on image.',
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Elastic Distortion'
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
