import React, {FC} from 'react';
import moment from 'moment';
import {LinearProgress, Typography} from '@material-ui/core';
import {DataGrid, GridCellParams, GridColDef, GridSortDirection} from '@material-ui/data-grid';
import FancyLabel from 'src/components/FancyLabel';
import {Task} from 'src/types/task';

function reducer(status) {
    switch (status) {
        case 'pending':
            return 'default'
        case 'success':
            return 'success'
        case 'active':
            return 'info'
        case 'failed':
            return 'error'
        default:
            throw new Error('Invalid status')
    }
}

function translateType(type) {
    switch (type) {
        case 'generator':
            return 'Dataset generation'
        case 'augmentor':
            return 'Images augmentation'
    }
}

const columns: GridColDef[] = [
    {
        field: 'type',
        headerName: 'Name',
        width: 200,
        renderCell: (params: GridCellParams) => (
            <strong>
                {translateType(params.value)}
            </strong>
        ),
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 110,
        renderCell: (params: GridCellParams) => (
            <FancyLabel color={reducer(params.value)}>
                {params.value}
            </FancyLabel>
        ),
    },
    {
        field: 'progress',
        headerName: 'Progress',
        width: 240,
        renderCell: (params: GridCellParams) => {
            if (params.row.status === 'failed')
                return (
                    <Typography variant='body2' color='error' noWrap>
                        {params.row.error}
                    </Typography>
                );
            if (params.row.status === 'pending')
                return (
                    <LinearProgress
                        variant='query'
                        style={{width: '100%'}}
                    />
                );
            return (
                <LinearProgress
                    variant={params.row.progress >= 1 ? 'query' : 'determinate'}
                    value={params.row.status === 'success' ? 100 : 100 * (params.value as number)}
                    style={{width: '100%'}}
                />)
        },
    },
    {
        field: 'created_at',
        headerName: 'Created at',
        width: 180,
        renderCell: (params: GridCellParams) => (
            <div>
                {typeof params.value === 'string' && moment(params.value).format('DD MMM | H:mm')}
            </div>
        )
    }
];

const rows: Task[] = [
    {
        _id: '0',
        user_id: '58a802c1b350056c737ca447db48c7c645581b265e61d2ceeae5e0320adc7e6a',
        dataset_id: '507f191e810c19729de860ea',
        type: 'generator',
        created_at: '2021-05-14T17:09:24.007531',
        status: 'active',
        progress: 0.53
    },
    {
        _id: '1',
        user_id: '58a802c1b350056c737ca447db48c7c645581b265e61d2ceeae5e0320adc7e6a',
        dataset_id: '507f191e810c19729de860ea',
        type: 'generator',
        created_at: '2021-05-14T17:09:24.007531',
        status: 'success',
        progress: 0
    },
    {
        _id: '2',
        user_id: '58a802c1b350056c737ca447db48c7c645581b265e61d2ceeae5e0320adc7e6a',
        dataset_id: '507f191e810c19729de860ea',
        type: 'generator',
        created_at: '2021-05-14T17:12:48.007531',
        status: 'pending',
        progress: 0
    },
    {
        _id: '3',
        user_id: '58a802c1b350056c737ca447db48c7c645581b265e61d2ceeae5e0320adc7e6a',
        dataset_id: '507f191e810c19729de860ea',
        type: 'generator',
        created_at: '2021-05-14T17:12:48.007531',
        status: 'failed',
        progress: 0,
        error: "You're missing out of memory. Consider upgrade to premium"
    },
];

interface TaskProps {

}


const DTTasks: FC<TaskProps> = () => {

    return (
        <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            pageSize={5}
            getRowId={row => row._id}
            disableColumnMenu
            disableColumnSelector
            disableSelectionOnClick
            sortModel={[
                {
                    field: 'created_at',
                    sort: 'desc' as GridSortDirection,
                },
            ]}
        />
    );
};

export default DTTasks;
