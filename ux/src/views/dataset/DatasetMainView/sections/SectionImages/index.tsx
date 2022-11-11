import React, {FC} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import {SectionProps} from '../SectionProps';
import {Divider, Typography} from '@mui/material';
import {ImagesProvider} from 'src/store/ImagesContext';
import DTImagesWrapper from './DTImagesWrapper';
import useCategory from 'src/hooks/useCategory';


const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

const SectionImages: FC<SectionProps> = ({ className }) => {
    const classes = useStyles();

    const { currentCategory } = useCategory();

    return (
        <div className={clsx(classes.root, className)}>
            <Divider sx={{ mt: 2 }}>
                <Typography variant="overline" color="textPrimary">
                    Images & labels
                </Typography>
            </Divider>
            <div id="images">
                {currentCategory === null ? (
                    <DTImagesWrapper />
                ) : (
                    <ImagesProvider category_id={currentCategory.id}>
                        <DTImagesWrapper />
                    </ImagesProvider>
                )}
            </div>
        </div>
    );
};

export default SectionImages;
