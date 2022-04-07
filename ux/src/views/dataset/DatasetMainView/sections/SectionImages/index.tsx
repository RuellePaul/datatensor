import React, {FC} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import {CategoryConsumer, CategoryProvider} from 'src/store/CategoryContext';
import {SectionProps} from '../SectionProps';
import {Divider, Typography} from '@mui/material';
import {ImagesProvider} from 'src/store/ImagesContext';
import DTImagesWrapper from './DTImagesWrapper';


const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

const SectionImages: FC<SectionProps> = ({ className }) => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)} id="images">
            <Divider sx={{ mt: 2 }}>
                <Typography variant="overline" color="textPrimary">
                    Images & labels
                </Typography>
            </Divider>
            <CategoryProvider>
                <CategoryConsumer>
                    {value =>
                        value.currentCategory === null ? (
                            <DTImagesWrapper />
                        ) : (
                            <ImagesProvider category_id={value.currentCategory.id}>
                                <DTImagesWrapper />
                            </ImagesProvider>
                        )
                    }
                </CategoryConsumer>
            </CategoryProvider>
        </div>
    );
};

export default SectionImages;
