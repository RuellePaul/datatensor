import React, {FC} from 'react';
import clsx from 'clsx';
import {Backdrop, ButtonBase, IconButton, makeStyles, Modal, Typography} from '@material-ui/core';
import {ArrowLeft as BackIcon} from 'react-feather';
import {Theme} from 'src/theme';
import {Image} from 'src/types/image';

interface ImageProps {
    className?: string;
    image: Image;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& img': {
            userSelect: 'none'
        },
        '&:hover img': {
            boxShadow: theme.shadows[6]
        }
    },
    backdrop: {
        background: 'rgba(0, 0, 0, 0.75)'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1)
    },
    buttonBase: {
        outline: 'initial !important'
    },
    header: {
        position: 'fixed',
        top: 0,
        left: 0,
        color: 'white',
        margin: theme.spacing(1),
        display: 'flex',
        alignItems: 'center'
    },
    content: {
        maxWidth: theme.breakpoints.values.lg,
    }
}));

const DTImage: FC<ImageProps> = ({
                                     className,
                                     image,
                                     ...rest
                                 }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const ImageHTMLElement = () => <img src={image.path} alt={image.name} width="100%" draggable={false}/>;

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <ButtonBase
                className={classes.buttonBase}
                onClick={handleOpen}
            >
                <ImageHTMLElement/>
            </ButtonBase>
            <Modal
                className={classes.modal}
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    className: classes.backdrop,
                }}
            >
                <>
                    <div className={classes.header}>
                        <IconButton
                            onClick={handleClose}
                        >
                            <BackIcon
                                width={40}
                                height={40}
                                color='white'
                            />
                        </IconButton>
                        <Typography
                            variant='h5'
                        >
                            {image.name}
                        </Typography>
                    </div>

                    <div className={classes.content}>
                        <ImageHTMLElement/>
                    </div>
                </>
            </Modal>
        </div>

    );
};

export default DTImage;
