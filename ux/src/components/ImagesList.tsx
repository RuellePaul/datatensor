import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {
    Backdrop,
    GridList,
    GridListTile,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    Modal,
    Typography
} from '@material-ui/core';
import {Pagination} from '@material-ui/lab';
import {ArrowLeft as BackIcon, MoreVertical as MoreIcon} from 'react-feather';
import DTImage from 'src/components/Image';
import {Theme} from 'src/theme';
import {Image} from 'src/types/image';
import api from 'src/utils/api'
import bytesToSize from 'src/utils/bytesToSize';

interface ImagesListProps {
    images: Image[];
    setImages: any;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    backdrop: {
        background: 'rgba(0, 0, 0, 0.8)'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1)
    },
    header: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center'
    },
    content: {
        position: 'relative',
        maxWidth: theme.breakpoints.values.lg,
    },
    footer: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: theme.spacing(2, 1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    resolution: {
        position: 'absolute',
        top: -25,
        right: 0
    }
}));

const DTImagesList: FC<ImagesListProps> = ({
                                               className,
                                               images,
                                               setImages,
                                               ...rest
                                           }) => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = useState(0);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const imageSelected = images[selected];

    const handleOpen = (index) => {
        setOpen(true);
        setSelected(index);
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

    const handleDelete = async event => {
        event.stopPropagation();
        handleCloseMenu();

        await api.post(`/v1/images/manage/${imageSelected.id}/delete`);
        setSelected(Math.max(0, selected - 1));
        setImages(images.filter(image => image.id !== imageSelected.id));
    };

    const handleKeyDown = (event: React.KeyboardEvent<unknown>) => {
        if (event.key === 'ArrowLeft')
            setSelected(Math.max(0, selected - 1));
        else if (event.key === 'ArrowRight')
            setSelected(Math.min(selected + 1, images.length - 1));
    };

    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSelected(value - 1);
    };

    return (
        <div
            className={clsx(classes.root, className)}
            onKeyDown={handleKeyDown}
            {...rest}
        >
            <GridList cols={5} spacing={8}>
                {images.map((image, index) => (
                    <GridListTile key={image.id}>
                        <DTImage
                            image={image}
                            clickable
                            onClick={() => handleOpen(index)}
                        />
                    </GridListTile>
                ))}
            </GridList>
            {imageSelected && <Modal
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
                        <div>
                            <Typography
                                variant='h5'
                                color='textPrimary'
                            >
                                {imageSelected.name}
                            </Typography>
                            <Typography
                                variant='h6'
                                color='textSecondary'
                            >
                                {bytesToSize(imageSelected.size)}
                            </Typography>
                        </div>

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
                        <div className={classes.resolution}>
                            <Typography
                                color='textSecondary'
                            >
                                {imageSelected.width} x {imageSelected.height}
                            </Typography>
                        </div>
                        <DTImage image={imageSelected}/>
                    </div>

                    <div className={classes.footer}>
                        <Pagination
                            color='primary'
                            count={images.length}
                            page={selected + 1}
                            onChange={handlePaginationChange}
                        />
                    </div>
                </>
            </Modal>}
        </div>
    );
};

export default DTImagesList;
