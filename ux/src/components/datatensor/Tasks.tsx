import React, {FC} from 'react';
import {LinearProgress, Typography} from '@material-ui/core';
import {DataGrid, GridCellParams, GridColDef} from '@material-ui/data-grid';
import FancyLabel from 'src/components/FancyLabel';

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

const columns: GridColDef[] = [
    {
        field: 'user_id',
        headerName: 'User',
        width: 200,
        renderCell: (params: GridCellParams) => (
            <div>
                {params.value}
            </div>
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
    }
];

const rows = [
    {
        id: 0,
        user_id: '58a802c1b350056c737ca447db48c7c645581b265e61d2ceeae5e0320adc7e6a',
        dataset_id: '507f191e810c19729de860ea',
        name: 'Generator',
        created_at: '2021-05-14T17:09:24.007531',
        status: 'active',
        progress: 0.53
    },
    {
        id: 1,
        user_id: '58a802c1b350056c737ca447db48c7c645581b265e61d2ceeae5e0320adc7e6a',
        dataset_id: '507f191e810c19729de860ea',
        name: 'Generator',
        created_at: '2021-05-14T17:09:24.007531',
        status: 'success',
        progress: 0
    },
    {
        id: 2,
        user_id: '58a802c1b350056c737ca447db48c7c645581b265e61d2ceeae5e0320adc7e6a',
        dataset_id: '507f191e810c19729de860ea',
        name: 'Generator',
        created_at: '2021-05-14T17:12:48.007531',
        status: 'pending',
        progress: 0
    },
    {
        id: 3,
        user_id: '58a802c1b350056c737ca447db48c7c645581b265e61d2ceeae5e0320adc7e6a',
        dataset_id: '507f191e810c19729de860ea',
        name: 'Generator',
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
        <div style={{height: 400, width: '100%'}}>
            <DataGrid rows={rows} columns={columns} pageSize={5}/>
        </div>
    );
};

export default DTTasks;
