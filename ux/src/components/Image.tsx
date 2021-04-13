import React, {FC} from 'react';
import clsx from 'clsx';
import {Backdrop, ButtonBase, Grow, makeStyles, Modal} from '@material-ui/core';
import {Theme} from 'src/theme';
import {Image} from 'src/types/image';

interface ImageProps {
    className?: string;
    image: Image;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
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
    },
    content: {
        maxWidth: theme.breakpoints.values.lg
    },
    buttonBase: {
        outline: 'initial !important'
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
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    className: classes.backdrop,
                    timeout: 300,
                }}
            >
                <Grow in={open} >
                    <div className={classes.content}>
                        <ImageHTMLElement/>
                    </div>
                </Grow>
            </Modal>
        </div>

    );
};

export default DTImage;
