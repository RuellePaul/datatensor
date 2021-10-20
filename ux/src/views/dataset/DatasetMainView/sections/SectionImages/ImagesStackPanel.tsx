import React, {FC, useState} from 'react';
import {Box, Button, Card, CardContent, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {ArrowLeft as BackIcon} from 'react-feather';
import DTImagesList from 'src/components/core/Images/ImagesList';
import useDataset from 'src/hooks/useDataset';
import {Theme} from 'src/theme';
import useCategory from 'src/hooks/useCategory';
import useImages from 'src/hooks/useImages';
import FilterCategories from './FilterCategories';
import {ImagesProvider} from 'src/store/ImagesContext';
import {Pipeline} from 'src/types/pipeline';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBottom: theme.spacing(3),
        '& .MuiCardHeader-action': {
            margin: 0
        }
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        padding: `${theme.spacing(2, 2, 1, 2)} !important`
    },
    wrapper: {
        margin: theme.spacing(3, 0, 0, 4),
        [theme.breakpoints.down('md')]: {
            margin: theme.spacing(0, 0, 3)
        }
    },
    fullWidth: {
        width: '100%'
    }
}));

interface ImagesStackPanelProps {
    pipeline?: Pipeline;
}

interface ImagesStackPanelExpandedProps {
    pipeline_id?: string;
    setSelected: any;
}

const ImagesStackPanelExpanded: FC<ImagesStackPanelExpandedProps> = ({setSelected, pipeline_id}) => {
    const classes = useStyles();

    const {images, totalImagesCount} = useImages();
    const {currentCategory} = useCategory();

    const {dataset, pipelines} = useDataset();

    return (
        <div className={classes.fullWidth}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Button color="inherit" onClick={() => setSelected(false)} size="small" startIcon={<BackIcon />}>
                    Back
                </Button>

                <FilterCategories />

                <Typography variant="body2" color="textPrimary">
                    {images.length} /{' '}
                    {currentCategory
                        ? totalImagesCount
                        : pipeline_id
                        ? pipelines.find(pipeline => pipeline.id === pipeline_id).image_count
                        : dataset.image_count}
                </Typography>
            </Box>
            <DTImagesList pipeline_id={pipeline_id} />
        </div>
    );
};

const ImagesStackPanel: FC<ImagesStackPanelProps> = ({pipeline = {}}) => {
    const classes = useStyles();
    const {dataset, savePipelines} = useDataset();
    const {currentCategory} = useCategory();
    const [selected, setSelected] = useState<boolean>(false);

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent className={classes.content}>
                {currentCategory === null ? (
                    <ImagesStackPanelExpanded pipeline_id={pipeline.id} setSelected={setSelected} />
                ) : (
                    <ImagesProvider category_id={currentCategory.id} pipeline_id={pipeline.id}>
                        <ImagesStackPanelExpanded setSelected={setSelected} pipeline_id={pipeline.id} />
                    </ImagesProvider>
                )}
            </CardContent>
        </Card>
    );
};

export default ImagesStackPanel;
