import React, {FC, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import clsx from 'clsx';
import {LinearProgress, makeStyles, useTheme} from '@material-ui/core';
import DTImage from 'src/components/core/Images/Image';
import useImages from 'src/hooks/useImages';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import {CategoryProvider} from 'src/store/CategoryContext';
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
    const {images, saveOffset} = useImages();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(0);

    const imageSelected = images[selected];

    const handleOpenImage = (index) => {
        setOpen(true);
        setSelected(index);
    };

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
                hasMore={pipeline_id
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
                                clickable
                                onClick={() => handleOpenImage(index)}
                                style={{
                                    '& canvas': {
                                        animationDelay: Math.floor(Math.random() * 1000 * index)
                                    }
                                }}
                            />
                        </ImageProvider>
                    ))}
                </Masonry>
            </InfiniteScroll>

            <CategoryProvider>
                {imageSelected && (
                    <DTImagePreview
                        open={open}
                        setOpen={setOpen}
                        selected={selected}
                        setSelected={setSelected}
                    />
                )}
            </CategoryProvider>
        </div>
    );
};

export default DTImagesList;
