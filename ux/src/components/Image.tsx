import React, {FC} from 'react';
import clsx from 'clsx';
import {ButtonBase, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import {Image} from 'src/types/image';

interface DTImageProps {
    className?: string;
    image: Image;
    onClick?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& img': {
            userSelect: 'none'
        },
        '&:hover img': {
            boxShadow: theme.shadows[6]
        }
    }
}));

const DTImage: FC<DTImageProps> = ({
                                       className,
                                       image,
                                       ...rest
                                   }) => {
    const classes = useStyles();

    return (
        <ButtonBase
            className={clsx(classes.root, className)}
            {...rest}
        >
            <img
                src={image.path}
                alt={image.name}
                width="100%"
                draggable={false}
            />
        </ButtonBase>
    );
};

export default DTImage;
