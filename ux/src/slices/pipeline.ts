import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';
import objFromArray from 'src/utils/objFromArray';
import type {AppThunk} from 'src/store';
import type {Operation, OperationType, Pipeline} from 'src/types/pipeline';
import {DEFAULT_PIPELINE, OPERATIONS_INITIAL_PROPERTIES} from 'src/config';


interface PipelineState {
    isLoaded: boolean;
    operations: {
        byType: Record<string, Operation>;
        allTypes: string[];
    };
}

const initialState: PipelineState = {
    isLoaded: false,
    operations: {
        byType: {},
        allTypes: []
    }
};

const slice = createSlice({
    name: 'pipeline',
    initialState,
    reducers: {
        setPipeline(state: PipelineState, action: PayloadAction<Pipeline>) {
            const { operations } = action.payload;

            state.operations.byType = objFromArray(operations, 'type');
            state.operations.allTypes = Object.keys(state.operations.byType);
            state.isLoaded = true;
        },
        createOperation(state: PipelineState, action: PayloadAction<{ operation: Operation; }>) {
            const { operation } = action.payload;

            state.operations.byType[operation.type] = operation;
            state.operations.allTypes.push(operation.type);
        },
        moveOperation(state: PipelineState, action: PayloadAction<{ operationType: string; position: number; }>) {
            const { operationType, position } = action.payload;

            _.pull(state.operations.allTypes, operationType);
            state.operations.allTypes.splice(position, 0, operationType);
        },
        updateOperation(state: PipelineState, action: PayloadAction<{ operationType: string; update: object; }>) {
            const { operationType, update } = action.payload;

            _.merge(state.operations.byType[operationType], update);
        },
        deleteOperation(state: PipelineState, action: PayloadAction<{ operationType: string; }>) {
            const { operationType } = action.payload;

            state.operations.byType = _.omit(state.operations.byType, operationType);
            _.pull(state.operations.allTypes, operationType);
        }
    }
});

export const reducer = slice.reducer;

export const setDefaultPipeline = (): AppThunk => async (dispatch) => {

    dispatch(slice.actions.setPipeline(DEFAULT_PIPELINE));
};

export const setPipeline = (pipeline: Pipeline): AppThunk => async (dispatch) => {

    dispatch(slice.actions.setPipeline(pipeline));
};

export const createOperation = (type: OperationType): AppThunk => async (dispatch) => {
    const operation: Operation = {
        type: type,
        probability: 0.8,
        properties: OPERATIONS_INITIAL_PROPERTIES[type] || {}
    };

    dispatch(slice.actions.createOperation({ operation }));
};

export const moveOperation = (operationType: string, position: number): AppThunk => async (dispatch) => {
    dispatch(slice.actions.moveOperation({
        operationType,
        position
    }));
};

export const updateOperation = (operationType: string, update: object): AppThunk => async (dispatch) => {
    dispatch(slice.actions.updateOperation({
        operationType,
        update
    }));
};

export const deleteOperation = (operationType: string): AppThunk => async (dispatch) => {
    dispatch(slice.actions.deleteOperation({ operationType }));
};

export default slice;
