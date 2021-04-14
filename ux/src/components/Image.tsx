import React, {FC} from 'react';
import clsx from 'clsx';
import {Backdrop, ButtonBase, IconButton, makeStyles, Menu, MenuItem, Modal, Typography} from '@material-ui/core';
import {ArrowLeft as BackIcon, MoreVertical as MoreIcon} from 'react-feather';
import {Theme} from 'src/theme';
import {Image} from 'src/types/image';
import api from 'src/utils/api'

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
        width: '100%',
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        color: 'white'
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

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleDelete = event => {
        event.stopPropagation();
        handleCloseMenu();

        api.post(`/v1/images/manage/${image.id}/delete`);
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
                        <div className='flexGrow'/>
                        <IconButton
                            onClick={handleOpenMenu}
                        >
                            <MoreIcon
                                width={30}
                                height={30}
                                color='white'
                            />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={openMenu}
                            onClose={handleCloseMenu}
                            PaperProps={{
                                style: {
                                    width: '20ch'
                                }
                            }}
                        >
                            <MenuItem onClick={handleDelete}>
                                Delete
                            </MenuItem>
                        </Menu>
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
