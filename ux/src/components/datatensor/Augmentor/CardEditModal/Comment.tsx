import type {FC} from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {Avatar, Box, makeStyles, Paper, Typography} from '@material-ui/core';
import type {Theme} from 'src/theme';
import type {RootState} from 'src/store';
import {useSelector} from 'src/store';
import type {Comment as CommentType} from 'src/types/kanban';

interface CommentProps {
    className?: string;
    comment: CommentType;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        marginBottom: theme.spacing(2)
    },
    messageContainer: {
        backgroundColor: theme.palette.background.dark,
        marginBottom: theme.spacing(1),
        padding: theme.spacing(2)
    }
}));

const Comment: FC<CommentProps> = ({
                                       comment,
                                       className,
                                       ...rest
                                   }) => {
    const classes = useStyles();

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Box
                ml={2}
                flexGrow={1}
            >
                <Paper
                    className={classes.messageContainer}
                    variant="outlined"
                >
                    <Typography
                        variant="body2"
                        color="textPrimary"
                    >
                        {comment.message}
                    </Typography>
                </Paper>
                <Typography
                    variant="caption"
                    color="textSecondary"
                >
                    {moment(comment.createdAt).format('MMM DD, YYYY [at] hh:mm a')}
                </Typography>
            </Box>
        </div>
    );
};

Comment.propTypes = {
    // @ts-ignore
    comment: PropTypes.object.isRequired,
    className: PropTypes.string
};

export default Comment;
