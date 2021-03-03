import React from 'react';
import {useHistory} from 'react-router-dom';

import {
    Avatar,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    IconButton,
    Typography
} from '@material-ui/core'

import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Favorite, MoreVert, Share} from '@material-ui/icons'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            maxWidth: 345,
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        avatar: {
            backgroundColor: theme.palette.primary.main,
        },
    }),
);

function Dataset({dataset}) {

    const classes = useStyles();
    const history = useHistory();

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar className={classes.avatar}>
                        {dataset.name[0]}
                    </Avatar>
                }
                action={
                    <IconButton>
                        <MoreVert/>
                    </IconButton>
                }
                title={dataset.name}
                subheader='September 14, 2016'
            />
            <CardActionArea
                onClick={() => history.push(`/datasets/${dataset.id}`)}
            >
                <CardMedia
                    className={classes.media}
                    image='/'
                    title={dataset.name}
                />
                <CardContent>
                    <Typography variant='body2' color='textSecondary' component='p'>
                        {dataset.desc}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions disableSpacing>
                <IconButton>
                    <Favorite color='secondary'/>
                </IconButton>
                <IconButton >
                    <Share/>
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default Dataset;