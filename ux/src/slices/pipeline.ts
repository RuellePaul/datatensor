import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';
import {v4 as uuid} from 'uuid';
import type {AppThunk} from 'src/store'
import objFromArray from 'src/utils/objFromArray';
import type {Board, List, Operation} from 'src/types/pipeline';

const board: Board = {
    lists: [
        {
            id: '5e849c39325dc5ef58e5a5db',
            name: 'Pipeline',
            operationIds: [
                '5e849c8708bd72683b454747',
                '5e849c90fabe1f1f4b3557f6',
                '5e849c977ef6265938bfd90b',
                '5e849c9e34ee93bc7255c599'
            ]
        }
    ],
    operations: [
        {
            id: '5e849c8708bd72683b454747',
            description: 'This performs rotation on image.',
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Rotation'
        },
        {
            id: '5e849c90fabe1f1f4b3557f6',
            description: 'This performs gaussian distortion on image.',
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Gaussian Distortion'
        },
        {
            id: '5e849c977ef6265938bfd90b',
            description: 'This performs rotation on image.',
            listId: '5e849c39325dc5ef58e5a5db',
            name: 'Rotation',
        },
        {
            id: '5e849c9e34ee93bc7255c599',
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
    operations: {
        byId: Record<string, Operation>;
        allIds: string[];
    };
}

const initialState: PipelineState = {
    isLoaded: false,
    lists: {
        byId: {},
        allIds: []
    },
    operations: {
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
            state.operations.byId = objFromArray(board.operations);
            state.operations.allIds = Object.keys(state.operations.byId);
            state.isLoaded = true;
        },
        createOperation(state: PipelineState, action: PayloadAction<{ operation: Operation; }>) {
            const {operation} = action.payload;

            state.operations.byId[operation.id] = operation;
            state.operations.allIds.push(operation.id);
            state.lists.byId[operation.listId].operationIds.push(operation.id);
        },
        moveOperation(state: PipelineState, action: PayloadAction<{ operationId: string; position: number; listId?: string; }>) {
            const {operationId, position, listId} = action.payload;
            const {listId: sourceListId} = state.operations.byId[operationId];

            // Remove operation from source list
            _.pull(state.lists.byId[sourceListId].operationIds, operationId);

            // If listId arg exists, it means that
            // we have to add the operation to the new list
            if (listId) {
                state.operations.byId[operationId].listId = listId;
                state.lists.byId[listId].operationIds.splice(position, 0, operationId);
            } else {
                state.lists.byId[sourceListId].operationIds.splice(position, 0, operationId);
            }
        },
        deleteOperation(state: PipelineState, action: PayloadAction<{ operationId: string; }>) {
            const {operationId} = action.payload;
            const {listId} = state.operations.byId[operationId];

            state.operations.byId = _.omit(state.operations.byId, operationId);
            _.pull(state.operations.allIds, operationId);
            _.pull(state.lists.byId[listId].operationIds, operationId);
        },
    }
});

export const reducer = slice.reducer;

export const getBoard = (): AppThunk => async (dispatch) => {
    const response = {data: {board}};

    dispatch(slice.actions.getBoard(response.data));
};

export const createOperation = (listId: string, name: string): AppThunk => async (dispatch) => {
    const operation: Operation = {
        id: uuid(),
        listId: '5e849c39325dc5ef58e5a5db',
        name: name,
        description: null
    }

    dispatch(slice.actions.createOperation({operation}));
};

export const moveOperation = (operationId: string, position: number, listId?: string): AppThunk => async (dispatch) => {
    dispatch(slice.actions.moveOperation({
        operationId,
        position,
        listId
    }));
};

export const deleteOperation = (operationId: string): AppThunk => async (dispatch) => {
    dispatch(slice.actions.deleteOperation({operationId}));
};

export default slice;
