import React, {FC} from 'react';
import {Box, capitalize, LinearProgress, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {DataGrid, GridCellParams, GridColDef, GridOverlay, GridRowParams, GridSortDirection} from '@mui/x-data-grid';
import useTasks from 'src/hooks/useTasks';
import {Theme} from 'src/theme';
import {UserConsumer, UserProvider} from 'src/store/UserContext';
import getDateDiff from 'src/utils/getDateDiff';
import {Task, TaskStatus, TaskType} from 'src/types/task';
import {TaskStatusLabel} from 'src/components/core/TaskDetails';
import UserLabel from 'src/components/UserLabel';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        borderColor: `${theme.palette.divider} !important`,
        '& *': {
            borderColor: `${theme.palette.divider} !important`
        },
        '& .MuiDataGrid-iconSeparator': {
            color: theme.palette.text.secondary
        },
        '& .Mui-even': {
            background: theme.palette.background.paper
        }
    }
}));

const columns: GridColDef[] = [
    {
        field: 'user_id',
        headerName: 'User',
        width: 200,
        renderCell: (params: GridCellParams) => (
            <UserProvider user_id={params.value.toString()}>
                <UserConsumer>{value => <UserLabel user={value.user} />}</UserConsumer>
            </UserProvider>
        )
    },
    {
        field: 'type',
        headerName: 'Name',
        width: 160,
        renderCell: (params: GridCellParams) => <strong>{capitalize(params.value as TaskType)}</strong>
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params: GridCellParams) => <TaskStatusLabel status={params.value as TaskStatus} />
    },
    {
        field: 'progress',
        headerName: 'Progress',
        width: 240,
        renderCell: (params: GridCellParams) => {
            if (params.row.status === 'failed')
                return (
                    <Typography variant="body2" color="error" noWrap>
                        {params.row.error}
                    </Typography>
                );
            if (params.row.status === 'pending') return <LinearProgress variant="query" style={{width: '100%'}} />;
            if (params.row.status === 'success')
                return (
                    <Typography variant="body2" color="textSecondary" noWrap>
                        Done in {getDateDiff(params.row.created_at, params.row.ended_at)}
                    </Typography>
                );
            return (
                <>
                    <Box width="100%" mr={1}>
                        <LinearProgress
                            variant={(params.row.progress <= 0 || params.row.progress) >= 1 ? 'query' : 'determinate'}
                            value={params.row.status === 'success' ? 100 : 100 * (params.value as number)}
                        />
                    </Box>
                    <Box minWidth={35}>
                        <Typography variant="body2" color="textSecondary">
                            {`${(100 * params.row.progress).toFixed()}%`}
                        </Typography>
                    </Box>
                </>
            );
        }
    },
    {
        field: 'created_at',
        headerName: 'Created',
        width: 180,
        renderCell: (params: GridCellParams) => (
            <Typography variant="body2" color="textSecondary">
                {getDateDiff(new Date(), params.value, 'passed_event')}
            </Typography>
        )
    }
];

const LoadingOverlay: FC = () => (
    <GridOverlay>
        <div style={{position: 'absolute', top: 0, width: '100%'}}>
            <LinearProgress />
        </div>
    </GridOverlay>
);

const DTTasks: FC = () => {
    const classes = useStyles();

    const {tasks, saveSelectedTask} = useTasks();

    const handleRowClick = (params: GridRowParams) => {
        saveSelectedTask(params.row as Task);
    };

    return (
        <DataGrid
            className={classes.root}
            autoHeight
            rows={tasks || []}
            columns={columns}
            pageSize={5}
            getRowId={task => task.id || task.id}
            disableColumnMenu
            disableColumnSelector
            disableSelectionOnClick
            loading={tasks === null}
            sortModel={[
                {
                    field: 'created_at',
                    sort: 'desc' as GridSortDirection
                }
            ]}
            components={{
                LoadingOverlay
            }}
            onRowClick={handleRowClick}
        />
    );
};

export default DTTasks;
