import React, {FC} from 'react';
import {
    Avatar,
    Box,
    Card,
    CardMedia,
    colors,
    Divider,
    Grid,
    IconButton,
    Link,
    makeStyles,
    SvgIcon,
    Tooltip,
    Typography
} from '@material-ui/core';
import {Theme} from 'src/theme';
import {Dataset} from 'src/types/dataset';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import {Rating} from '@material-ui/lab';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import {Users as UsersIcon} from 'react-feather';

interface DatasetProps {
    className?: string;
    dataset: Dataset;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    image: {
        height: 200,
        backgroundColor: theme.palette.background.dark
    },
    likedButton: {
        color: colors.red[600]
    },
    membersIcon: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(1)
    }
}));


const DTDataset: FC<DatasetProps> = ({
                                          className,
                                          dataset,
                                          ...rest
                                      }) => {
    const classes = useStyles();

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Box p={3}>
                <CardMedia
                    className={classes.image}
                    image='/static/images/examples/eagle.jpg'
                />
                <Box
                    display="flex"
                    alignItems="center"
                    mt={2}
                >
                    <Avatar
                        alt="Author"
                        src=''
                    >
                        PR
                    </Avatar>
                    <Box ml={2}>
                        <Link
                            color="textPrimary"
                            component={RouterLink}
                            to="#"
                            variant="h5"
                        >
                            {dataset.name}
                        </Link>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                        >
                            by
                            {' '}
                            <Link
                                color="textPrimary"
                                component={RouterLink}
                                to="#"
                                variant="h6"
                            >
                                Paul Ruelle
                            </Link>
                            {' '}
                            | Created
                            {' '}
                            {moment(dataset.created_at).fromNow()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                pb={2}
                px={3}
            >
                <Typography
                    color="textSecondary"
                    variant="body2"
                    dangerouslySetInnerHTML={{__html: dataset.description}}
                />
            </Box>
            <Box
                py={2}
                px={3}
            >
                <Grid
                    alignItems="center"
                    container
                    justify="space-between"
                    spacing={3}
                >
                    <Grid item>
                        <Typography
                            variant="h5"
                            color="textPrimary"
                        >
                            500
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                        >
                            images
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="h5"
                            color="textPrimary"
                        >
                            Hello
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                        >
                            Location
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="h5"
                            color="textPrimary"
                        >
                            0.742
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                        >
                            mAP
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Divider/>
            <Box
                py={2}
                pl={2}
                pr={3}
                display="flex"
                alignItems="center"
            >
                <Tooltip title="Like">
                    <IconButton>
                        <FavoriteBorderIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
                <Typography
                    variant="subtitle2"
                    color="textSecondary"
                >
                    30
                </Typography>
                <SvgIcon
                    fontSize="small"
                    color="action"
                    className={classes.membersIcon}
                >
                    <UsersIcon/>
                </SvgIcon>
                <Typography
                    variant="subtitle2"
                    color="textSecondary"
                >
                    30
                </Typography>
                <Box flexGrow={1}/>
                <Rating
                    value={3}
                    size="small"
                    readOnly
                />
            </Box>
        </Card>
    );
};

export default DTDataset;
