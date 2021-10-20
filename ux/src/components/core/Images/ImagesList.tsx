import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {IconButton, Tooltip, Typography} from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import MasonryItem from '@mui/lab/MasonryItem';
import makeStyles from '@mui/styles/makeStyles';
import {CreateOutlined as LabelisatorIcon} from '@mui/icons-material';
import DTImage from 'src/components/core/Images/Image';
import useImages from 'src/hooks/useImages';
import {Theme} from 'src/theme';
import {ImageProvider} from 'src/store/ImageContext';
import DTImagePreview from './ImagePreview';

interface ImagesListProps {
    pipeline_id?: string;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    grid: {
        display: 'flex',
        marginLeft: -10,
        width: 'auto',
        marginRight: 10
    },
    column: {
        paddingLeft: 10,
        backgroundClip: 'padding-box',
        '& > button': {
            margin: theme.spacing(0, 0, 1)
        }
    },
    image: {
        marginBottom: theme.spacing(1)
    },
    icon: {
        position: 'absolute',
        bottom: theme.spacing(1),
        right: theme.spacing(1),
        color: 'white',
        background: 'rgba(0, 0, 0, 0.25)'
    }
}));

const DTImagesList: FC<ImagesListProps> = ({className, pipeline_id, ...rest}) => {
    const classes = useStyles();

    const {images} = useImages();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(0);

    const imageSelected = images[selected];

    const handleOpenImage = index => {
        setOpen(true);
        setSelected(index);
    };

    if (images.length === 0)
        return (
            <Typography color="textSecondary" gutterBottom>
                No images found.
            </Typography>
        );

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Masonry columns={{xs: 2, sm: 3, md: 4}} spacing={1}>
                {images.map((image, index) => (
                    <MasonryItem key={image.id}>
                        <ImageProvider image={image}>
                            <DTImage
                                className={classes.image}
                                clickable
                                overlay={
                                    <Tooltip title={<Typography variant="overline">Edit labels</Typography>}>
                                        <IconButton
                                            className={classes.icon}
                                            onClick={event => {
                                                event.stopPropagation();
                                                window.location.hash = image.id;
                                            }}
                                            size="large"
                                        >
                                            <LabelisatorIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                                onClick={() => handleOpenImage(index)}
                            />
                        </ImageProvider>
                    </MasonryItem>
                ))}
            </Masonry>

            {imageSelected && (
                <DTImagePreview open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
            )}
        </div>
    );
};

export default DTImagesList;
