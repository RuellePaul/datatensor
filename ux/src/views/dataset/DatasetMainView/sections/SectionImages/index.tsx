import React, {FC} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import usePipeline from 'src/hooks/usePipeline';
import {CategoryProvider} from 'src/store/CategoryContext';
import {ImagesProvider} from 'src/store/ImagesContext';
import ImagesStackPanel from './ImagesStackPanel';
import {SectionProps} from '../SectionProps';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

const SectionImages: FC<SectionProps> = ({className}) => {
    const classes = useStyles();

    const {pipeline} = usePipeline();

    return (
        <div className={clsx(classes.root, className)}>
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
