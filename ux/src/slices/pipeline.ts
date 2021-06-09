import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';
import {v4 as uuid} from 'uuid';
import type {AppThunk} from 'src/store'
import type {Operation, OperationType} from 'src/types/pipeline';

interface PipelineState {
    isLoaded: boolean;
    operations: {
        byId: Record<string, Operation>;
        allIds: string[];
    };
}

const initialState: PipelineState = {
    isLoaded: false,
    operations: {
        byId: {},
        allIds: []
    }
};

const slice = createSlice({
    name: 'pipeline',
    initialState,
    reducers: {
        createOperation(state: PipelineState, action: PayloadAction<{ operation: Operation; }>) {
            const {operation} = action.payload;

            state.operations.byId[operation.id] = operation;
            state.operations.allIds.push(operation.id);
        },
        moveOperation(state: PipelineState, action: PayloadAction<{ operationId: string; position: number; }>) {
            const {operationId, position} = action.payload;

            _.pull(state.operations.allIds, operationId);
            state.operations.allIds.splice(position, 0, operationId);
        },
        deleteOperation(state: PipelineState, action: PayloadAction<{ operationId: string; }>) {
            const {operationId} = action.payload;

            state.operations.byId = _.omit(state.operations.byId, operationId);
            _.pull(state.operations.allIds, operationId);
        },
    }
});

export const reducer = slice.reducer;

export const createOperation = (type: OperationType): AppThunk => async (dispatch) => {
    const operation: Operation = {
        id: uuid(),
        type: type,
        probability: 0.8
    }

    dispatch(slice.actions.createOperation({operation}));
};

export const moveOperation = (operationId: string, position: number): AppThunk => async (dispatch) => {
    dispatch(slice.actions.moveOperation({
        operationId,
        position
    }));
};

export const deleteOperation = (operationId: string): AppThunk => async (dispatch) => {
    dispatch(slice.actions.deleteOperation({operationId}));
};

export default slice;
