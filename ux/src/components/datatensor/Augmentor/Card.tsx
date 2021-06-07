import type {FC} from 'react';
import React, {forwardRef, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {Card as MuiCard, CardContent, CardMedia, makeStyles, Typography} from '@material-ui/core';
import type {Theme} from 'src/theme';
import type {RootState} from 'src/store';
import {useSelector} from 'src/store';
import type {Card as CardType, List} from 'src/types/pipeline';
import CardEditModal from './CardEditModal';

interface CardProps {
    className?: string;
    cardId: string;
    dragging: boolean;
    index?: number;
    list: List;
    style?: {};
}

interface PopulatedCard extends CardType {

}

const cardSelector = (state: RootState, cardId: string): PopulatedCard => {
    const {cards,} = state.pipeline;
    return cards.byId[cardId]
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        outline: 'none',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    card: {
        '&:hover': {
            backgroundColor: theme.palette.background.dark
        }
    },
    dragging: {
        backgroundColor: theme.palette.background.dark
    },
    cover: {
        height: 200
    },
    badge: {
        '& + &': {
            marginLeft: theme.spacing(2)
        }
    }
}));

const Card: FC<CardProps> = forwardRef(({
                                            cardId,
                                            className,
                                            dragging,
                                            index,
                                            list,
                                            style,
                                            ...rest
                                        }, ref) => {
    const classes = useStyles();
    const card = useSelector((state) => cardSelector(state, cardId));
    const [isOpened, setOpened] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpened(true);
    };

    const handleClose = (): void => {
        setOpened(false);
    };

    return (
        <div
            className={clsx(classes.root, className)}
            index={index}
            // @ts-ignore
            ref={ref}
            style={style}
            {...rest}
        >
            <MuiCard
                className={clsx(
                    classes.card,
                    {[classes.dragging]: dragging}
                )}
                raised={dragging}
                variant={dragging ? 'elevation' : 'outlined'}
                onClick={handleOpen}
            >
                {card.cover && (
                    <CardMedia
                        className={classes.cover}
                        image={card.cover}
                    />
                )}
                <CardContent>
                    <Typography
                        variant="h5"
                        color="textPrimary"
                    >
                        {card.name}
                    </Typography>
                </CardContent>
            </MuiCard>
            <CardEditModal
                open={isOpened}
                onClose={handleClose}
                card={card}
                list={list}
            />
        </div>
    );
});

Card.propTypes = {
    cardId: PropTypes.string.isRequired,
    className: PropTypes.string,
    dragging: PropTypes.bool.isRequired,
    index: PropTypes.number,
    // @ts-ignore
    list: PropTypes.object.isRequired,
    style: PropTypes.object
};

Card.defaultProps = {
    dragging: false,
    style: {}
};

export default Card;
