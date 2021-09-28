import React, {FC, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import clsx from 'clsx';
import {IconButton, LinearProgress, makeStyles, Typography, useTheme} from '@material-ui/core';
import {Create as LabelisatorIcon} from '@material-ui/icons';
import DTImage from 'src/components/core/Images/Image';
import useImages from 'src/hooks/useImages';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import {ImageProvider} from 'src/store/ImageContext';
import {LAZY_LOAD_BATCH} from 'src/constants';
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
        color: 'white'
    }
}));

const DTImagesList: FC<ImagesListProps> = ({
                                               className,
                                               pipeline_id,
                                               ...rest
                                           }) => {
    const classes = useStyles();
    const theme = useTheme();

    const {dataset, pipelines} = useDataset();
    const {images, saveOffset, totalImagesCount} = useImages();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(0);

    const imageSelected = images[selected];

    const handleOpenImage = (index) => {
        setOpen(true);
        setSelected(index);
    };

    if (images.length === 0)
        return (
            <Typography
                color='textSecondary'
                gutterBottom
            >
                No images found.
            </Typography>
        )

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <InfiniteScroll
                className='scroll'
                dataLength={images.length}
                next={() => saveOffset(offset => offset + LAZY_LOAD_BATCH)}
                height={700}
                hasMore={
                    totalImagesCount
                        ? totalImagesCount > images.length
                        : pipeline_id
                        ? pipelines.find(pipeline => pipeline.id === pipeline_id).image_count > images.length
                        : dataset.image_count > images.length
                }
                loader={<LinearProgress/>}
            >
                <Masonry
                    breakpointCols={{
                        default: 4,
                        [theme.breakpoints.values.md]: 3,
                        700: 2
                    }}
                    className={classes.grid}
                    columnClassName={classes.column}
                >
                    {images.map((image, index) => (
                        <ImageProvider
                            key={image.id}
                            image={image}
                        >
                            <DTImage
                                className={classes.image}
                                clickable
                                overlay={(
                                    <IconButton
                                        className={classes.icon}
                                        onClick={event => {
                                            event.stopPropagation();
                                            window.location.hash = image.id;
                                        }}
                                    >
                                        <LabelisatorIcon/>
                                    </IconButton>
                                )}
                                onClick={() => handleOpenImage(index)}
                            />
                        </ImageProvider>
                    ))}
                </Masonry>
            </InfiniteScroll>

            {imageSelected && (
                <DTImagePreview
                    open={open}
                    setOpen={setOpen}
                    selected={selected}
                    setSelected={setSelected}
                />
            )}
        </div>
    );
};

export default DTImagesList;
