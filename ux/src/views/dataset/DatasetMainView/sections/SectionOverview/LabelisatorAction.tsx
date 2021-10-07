import React, {FC} from 'react';
import {Box, Button, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {CreateOutlined as LabelisatorIcon, CategoryOutlined as CategoriesIcon, LocalOfferOutlined as LabelsIcon, PhotoLibraryOutlined as ImagesIcon} from '@mui/icons-material';
import Categories from 'src/components/core/Dataset/Categories';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import useImages from 'src/hooks/useImages';


const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    icon: {
        marginRight: 6,
        verticalAlign: 'middle'
    }
}));

interface LabelisatorActionProps {
    className?: string;
}

const LabelisatorAction: FC<LabelisatorActionProps> = ({ className }) => {

    const classes = useStyles();

    const { dataset, categories } = useDataset();
    const { images } = useImages();

    const totalLabelsCount = categories.map(category => category.labels_count || 0).reduce((acc, val) => acc + val, 0);

    if (images.length === 0) return null;

    return (
        <div>
            <Box
                display='flex'
                alignItems='center'
                mb={2}
            >
                <Box mr={2}>
                    <Typography
                        fontWeight={600}
                        color='textPrimary'
                    >
                        <ImagesIcon
                            className={classes.icon}
                        />
                        {dataset.image_count + dataset.augmented_count}
                        {' '}
                        <Typography
                            variant='subtitle1'
                            component='span'
                            color='textSecondary'
                            fontWeight={400}
                        >
                            images
                        </Typography>
                    </Typography>
                </Box>
                <Box mr={2}>
                    <Typography
                        fontWeight={600}
                        color='textPrimary'
                    >
                        <CategoriesIcon
                            className={classes.icon}
                        />
                        {categories.length}
                        {' '}
                        <Typography
                            variant='subtitle1'
                            component='span'
                            color='textSecondary'
                            fontWeight={400}
                        >
                            categories
                        </Typography>
                    </Typography>
                </Box>
                <Box mr={2}>
                    <Typography
                        fontWeight={600}
                        color='textPrimary'
                    >
                        <LabelsIcon
                            className={classes.icon}
                        />
                        {totalLabelsCount}
                        {' '}
                        <Typography
                            variant='subtitle1'
                            component='span'
                            color='textSecondary'
                            fontWeight={400}
                        >
                            labels
                        </Typography>
                    </Typography>
                </Box>
            </Box>

            <Categories />
            <Typography variant='body2' color="textSecondary" gutterBottom>
                {totalLabelsCount > 0 ? 'Edit labels' : 'Start labeling'} with labelisator tool.
            </Typography>
            <Button
                color="primary"
                disabled={!!window.location.hash}
                onClick={() => (window.location.hash = images[0].id)}
                endIcon={<LabelisatorIcon />}
                variant="contained"
            >
                Labelisator
            </Button>
        </div>
    );
};

export default LabelisatorAction;
