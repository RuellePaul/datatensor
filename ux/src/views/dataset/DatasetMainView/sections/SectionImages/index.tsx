import React, {FC} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import usePipeline from 'src/hooks/usePipeline';
import {CategoryProvider} from 'src/store/CategoryContext';
import {ImagesProvider} from 'src/store/ImagesContext';
import ImagesStackPanel from './ImagesStackPanel';
import {SectionProps} from '../SectionProps';
import useImages from 'src/hooks/useImages';
import {Divider, Typography} from '@mui/material';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

const SectionImages: FC<SectionProps> = ({className}) => {
    const classes = useStyles();

    const {pipeline} = usePipeline();
    const {images} = useImages();

    if (images === null || images.length === 0)
        return null;

    return (
        <div className={clsx(classes.root, className)}>
            <Divider sx={{mt: 2}}>
                <Typography variant='overline' color='textPrimary'>
                    Images & labels
                </Typography>
            </Divider>
            <CategoryProvider>
                {pipeline === null ? (
                    <ImagesStackPanel />
                ) : (
                    <ImagesProvider key={pipeline.id} pipeline_id={pipeline.id}>
                        <ImagesStackPanel pipeline={pipeline} />
                    </ImagesProvider>
                )}
            </CategoryProvider>
        </div>
    );
};

export default SectionImages;
