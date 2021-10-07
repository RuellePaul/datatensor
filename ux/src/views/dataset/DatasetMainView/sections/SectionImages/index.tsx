import React, {FC} from 'react';
import clsx from 'clsx';
import {Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import FancyLabel from 'src/components/FancyLabel';
import useDataset from 'src/hooks/useDataset';
import {CategoryProvider} from 'src/store/CategoryContext';
import {ImagesProvider} from 'src/store/ImagesContext';
import {Theme} from 'src/theme';
import ImagesStackPanel from './ImagesStackPanel';
import {SectionProps} from '../SectionProps';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    label: {
        margin: theme.spacing(1, 2, 1, 0)
    }
}));

const SectionImages: FC<SectionProps> = ({className}) => {
    const classes = useStyles();

    const {dataset, pipelines} = useDataset();

    return (
        <div className={clsx(classes.root, className)}>
            <Typography color="textPrimary" gutterBottom>
                Currently, this dataset contains{' '}
                <strong>{dataset.image_count + dataset.augmented_count} images :</strong>{' '}
                <FancyLabel className={classes.label} color="info">
                    {dataset.image_count} original
                </FancyLabel>
                <FancyLabel className={classes.label} color="default">
                    + {dataset.augmented_count} augmented
                </FancyLabel>
            </Typography>

            <CategoryProvider>
                <ImagesStackPanel />
            </CategoryProvider>

            <CategoryProvider>
                {pipelines.map(pipeline => (
                    <ImagesProvider key={pipeline.id} pipeline_id={pipeline.id}>
                        <ImagesStackPanel pipeline={pipeline} />
                    </ImagesProvider>
                ))}
            </CategoryProvider>
        </div>
    );
};

export default SectionImages;
