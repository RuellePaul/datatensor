import React, {FC} from 'react';
import {useHistory} from 'react-router';
import clsx from 'clsx';
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

interface DatasetProps {
    className?: string;
    dataset: Dataset;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
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

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <CardActionArea
                onClick={() => history.push(`/app/manage/datasets/${dataset.id}`)}
            >
                <CardMedia
                    className={classes.media}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {capitalize(dataset.name)}
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
                <Button size="small" color="primary">
                    Share
                </Button>
                <Button size="small" color="primary">
                    Learn More
                </Button>
            </CardActions>
        </Card>
    );
};

export default DTDataset;
