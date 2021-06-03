import React, {FC, useState} from 'react';
import moment from 'moment';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    LinearProgress,
    Link,
    makeStyles,
    Typography
} from '@material-ui/core';
import {
    DataGrid,
    GridCellParams,
    GridColDef,
    GridOverlay,
    GridRowParams,
    GridSortDirection
} from '@material-ui/data-grid';
import FancyLabel from 'src/components/FancyLabel';
import useTasks from 'src/hooks/useTasks';
import {Theme} from 'src/theme';
import {Close as CloseIcon} from '@material-ui/icons';
import UserAvatar from 'src/components/UserAvatar';
import {DatasetConsumer, DatasetProvider} from 'src/store/DatasetContext';
import DTDataset from './Dataset';
import {UserConsumer, UserProvider} from 'src/store/UserContext';
import {Link as RouterLink} from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: theme.palette.background.paper,
        borderColor: `${theme.palette.divider} !important`,
        '& *': {
            borderColor: `${theme.palette.divider} !important`
        },
        '& .MuiDataGrid-iconSeparator': {
            color: theme.palette.text.secondary
        },
        '& .Mui-even': {
            background: theme.palette.background.dark,
        }
    },
    dialog: {
        padding: theme.spacing(1, 2, 2)
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
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
            return '🏗️ Generator'
        case 'delete':
            return '🗑️ Delete'
        case 'augmentor':
            return 'Images augmentation'
    }
}

const columns: GridColDef[] = [
    {
        field: 'user_id',
        headerName: 'User',
        width: 200,
        renderCell: (params: GridCellParams) => (
            <UserProvider user_id={params.value.toString()}>
                <UserConsumer>
                    {
                        value => (
                            <>
                                <Box mr={1}>
                                    <UserAvatar
                                        user={value.user}
                                        style={{width: 30, height: 30}}
                                    />

                                </Box>

                                <Link
                                    color="inherit"
                                    component={RouterLink}
                                    to={`/app/admin/manage/users/${params.value.toString()}/details`}
                                    variant="h6"
                                >
                                    {value.user.name}
                                </Link>
                            </>
                        )
                    }
                </UserConsumer>
            </UserProvider>
        ),
    },
    {
        field: 'type',
        headerName: 'Name',
        width: 160,
        renderCell: (params: GridCellParams) => (
            <strong>
                {translateType(params.value)}
            </strong>
        ),
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 120,
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
            if (params.row.status === 'success')
                return <div/>
            return (
                <>
                    <Box width="100%" mr={1}>
                        <LinearProgress
                            variant={(params.row.progress <= 0 || params.row.progress) >= 1 ? 'query' : 'determinate'}
                            value={params.row.status === 'success' ? 100 : 100 * (params.value as number)}
                        />
                    </Box>
                    <Box minWidth={35}>
                        <Typography
                            variant="body2"
                            color="textSecondary">{`${(100 * params.row.progress).toFixed()}%`}
                        </Typography>
                    </Box>
                </>

            )
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

    const [selectedTask, setSelectedTask] = useState(null);

    const handleRowClick = (params: GridRowParams) => {
        setSelectedTask(params.row);
    }

    const handleClose = () => {
        setSelectedTask(null);
    }

    return (
        <>
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
                onRowClick={handleRowClick}
            />

            <UserProvider user_id={selectedTask?.user_id}>
                <Dialog
                    disableRestoreFocus
                    PaperProps={{
                        className: classes.dialog
                    }}
                    fullWidth
                    maxWidth='md'
                    open={selectedTask !== null}
                    onClose={handleClose}
                >
                    {selectedTask && (
                        <>
                            <DialogTitle
                                className='flex'
                                disableTypography
                            >
                                <div>
                                    <Typography variant='h4'>
                                        Task details
                                    </Typography>
                                    <Typography color='textSecondary'>
                                        ID : {selectedTask?._id}
                                    </Typography>
                                </div>

                                <IconButton
                                    className={classes.close}
                                    onClick={handleClose}
                                >
                                    <CloseIcon/>
                                </IconButton>
                            </DialogTitle>
                            <DialogContent>
                                <Box my={2}>
                                    <Grid
                                        container
                                        spacing={4}
                                    >
                                        <Grid
                                            item
                                            md={7}
                                            xs={12}
                                        >
                                            <Typography gutterBottom>
                                                <strong>{translateType(selectedTask?.type)}</strong>,
                                                the
                                                {` `}
                                                {moment(selectedTask?.created_at).format('DD/MM')},
                                                at {moment(selectedTask?.created_at).format('HH:mm:ss')}
                                            </Typography>

                                            <Typography gutterBottom>
                                                Properties :
                                            </Typography>
                                            <pre>
                                                {JSON.stringify(selectedTask?.properties, null, 4)}
                                            </pre>
                                            {selectedTask.error && (
                                                <Typography color="error" gutterBottom>
                                                    Error : {selectedTask.error}
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid
                                            item
                                            md={5}
                                            xs={12}
                                        >
                                            <DatasetProvider dataset_id={selectedTask?.dataset_id}>
                                                <DatasetConsumer>
                                                    {value => <DTDataset dataset={value.dataset} isWorking={value.isWorking}/>}
                                                </DatasetConsumer>
                                            </DatasetProvider>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </DialogContent>
                        </>
                    )
                    }
                </Dialog>
            </UserProvider>
        </>
    );
};

export default DTTasks;
