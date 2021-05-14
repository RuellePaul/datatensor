import React, {FC} from 'react';
import moment from 'moment';
import {LinearProgress, makeStyles, Typography} from '@material-ui/core';
import {DataGrid, GridCellParams, GridColDef, GridOverlay, GridSortDirection} from '@material-ui/data-grid';
import FancyLabel from 'src/components/FancyLabel';
import useTasks from 'src/hooks/useTasks';
import {Theme} from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        borderColor: `${theme.palette.divider} !important`,
        '& *': {
            borderColor: `${theme.palette.divider} !important`
        }
    }
}));

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


interface TaskProps {

}

const LoadingOverlay: FC = () => (
    <GridOverlay>
        <div style={{position: 'absolute', top: 0, width: '100%'}}>
            <LinearProgress/>
        </div>
    </GridOverlay>
);

const DTTasks: FC<TaskProps> = () => {

    const classes = useStyles();

    const {tasks, loading} = useTasks();


    return (
        <DataGrid
            className={classes.root}
            autoHeight
            rows={tasks || []}
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
            loading={loading}
            components={{
                LoadingOverlay
            }}
        />
    );
};

export default DTTasks;
