import React, {FC} from 'react';
import clsx from 'clsx';
import {ButtonBase, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import {Image} from 'src/types/image';

interface DTImageProps {
    className?: string;
    image: Image;
    clickable?: boolean;
    onClick?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& img': {
            userSelect: 'none'
        },
    },
    clickable: {
        '&:hover img': {
            boxShadow: theme.shadows[6],
            opacity: 0.85
        }
    }
}));

const DTImage: FC<DTImageProps> = ({
                                       className,
                                       image,
                                       clickable = false,
                                       ...rest
                                   }) => {
    const classes = useStyles();

    const Image = () => (
        <img
            src={image.path}
            alt={image.name}
            width="100%"
            draggable={false}
        />
    );

    if (clickable)
        return (
            <ButtonBase
                className={clsx(classes.root, classes.clickable, className)}
                {...rest}
            >
                <Image/>
            </ButtonBase>
        );

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Image/>
        </div>
    );
};

export default DTImage;
