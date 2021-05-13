import React, {FC, useRef} from 'react';
import {useHistory} from 'react-router';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {
    Button,
    capitalize,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    makeStyles,
    Typography
} from '@material-ui/core';
import {Theme} from 'src/theme';
import {Dataset} from 'src/types/dataset';
import api from 'src/utils/api';
import useDatasets from 'src/hooks/useDatasets';

interface DatasetProps {
    className?: string;
    dataset: Dataset;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        transition: 'transform 1s ease',
        transformOrigin: '50% 50%',
        '&:hover': {
            transition: 'all .15s ease'
        }
    },
    media: {
        height: 150,
    }
}));

const DTDataset: FC<DatasetProps> = ({
                                         className,
                                         dataset,
                                         ...rest
                                     }) => {
    const classes = useStyles();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    const {saveDatasets} = useDatasets();

    const datasetRef = useRef(null);

    const handleMouseMove = (event) => {
        let dataset = datasetRef.current;
        dataset.style.transform = `matrix3d(1.02,0,0,${(-event.nativeEvent.offsetX + 0.5 * dataset.clientWidth) / 2e6},0,1.02,0,0,0,0,1,0,0,0,0,1)`
    };

    const handleMouseLeave = () => {
        let dataset = datasetRef.current;
        dataset.style.transform = `matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)`
    };

    const handleDeleteDataset = async () => {
        try {
            await api.delete(`/datasets/${dataset._id}`);
            saveDatasets(datasets => datasets.filter((current: Dataset) => current._id !== dataset._id));
            enqueueSnackbar(`Deleted dataset ${dataset.name}`, {variant: 'info'});
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
        }
    };

    return (
        <Card
            className={clsx(classes.root, className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={datasetRef}
            {...rest}
        >
            <CardActionArea
                onClick={() => history.push(`/app/manage/datasets/${dataset._id}`)}
            >
                <CardMedia
                    className={classes.media}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title={`Open dataset "${dataset.name}"`}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {dataset.name && capitalize(dataset.name)}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="body2"
                        component="p"
                        dangerouslySetInnerHTML={{__html: dataset.description}}
                    />
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button
                    color="primary"
                    onClick={handleDeleteDataset}
                    size="small"
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
};

export default DTDataset;
