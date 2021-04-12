import React, {FC} from 'react';
import clsx from 'clsx';
import {
    ButtonBase,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles,
    useMediaQuery,
    useTheme
} from '@material-ui/core';
import {Theme} from 'src/theme';
import {Image} from 'src/types/image';

interface ImageProps {
    className?: string;
    image: Image;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    media: {
        height: 150,
    }
}));

const DTImage: FC<ImageProps> = ({
                                     className,
                                     image,
                                     ...rest
                                 }) => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <ButtonBase
                onClick={handleOpen}
            >
                <img src={image.path} alt={image.id} width="100%"/>
            </ButtonBase>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={fullScreen}
                maxWidth="lg"
            >
                <DialogTitle>{image.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <img src={image.path} alt={image.id} width="100%"/>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>

    );
};

export default DTImage;
