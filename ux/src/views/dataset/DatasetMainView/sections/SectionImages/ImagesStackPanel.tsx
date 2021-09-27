import React, {FC, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Button, Card, CardContent, Grid, Link, makeStyles, Typography} from '@material-ui/core';
import {ArrowLeft as BackIcon} from 'react-feather';
import DTImagesList from 'src/components/core/Images/ImagesList';
import DTImagesStack from 'src/components/core/Images/ImagesStack';
import useDataset from 'src/hooks/useDataset';
import {Theme} from 'src/theme';
import UploadAction from './UploadAction';
import ViewPipelineAction from './ViewPipelineAction';
import DeletePipelineAction from './DeletePipelineAction';
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
        padding: `${theme.spacing(2, 2, 1, 2)} !important`,
    },
    fullWidth: {
        width: '100%',
    },
    header: {
        borderBottom: `1px dashed ${theme.palette.divider}`,
        marginBottom: theme.spacing(1)
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
            <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                mb={2}
            >
                <Button
                    onClick={() => setSelected(false)}
                    size='small'
                    startIcon={<BackIcon/>}
                >
                    Back
                </Button>

                <FilterCategories/>

                <Typography
                    variant='body2'
                    color='textPrimary'
                >
                    {images.length} / {
                    currentCategory
                        ? totalImagesCount
                        : pipeline_id
                        ? pipelines.find(pipeline => pipeline.id === pipeline_id).image_count
                        : dataset.image_count}
                </Typography>
            </Box>
            <DTImagesList pipeline_id={pipeline_id}/>
        </div>
    )
};


const ImagesStackPanel: FC<ImagesStackPanelProps> = ({
                                                         pipeline = {}
                                                     }) => {

    const classes = useStyles();
    const {dataset, savePipelines} = useDataset();
    const {currentCategory} = useCategory();
    const [selected, setSelected] = useState<boolean>(false);

    return (
        <Card
            className={classes.root}
            elevation={5}
            variant='outlined'
        >
            <CardContent className={classes.content}>
                {selected
                    ? (
                        currentCategory === null
                            ? <ImagesStackPanelExpanded
                                pipeline_id={pipeline.id}
                                setSelected={setSelected}
                            />
                            : (
                                <ImagesProvider
                                    category_id={currentCategory.id}
                                    pipeline_id={pipeline.id}
                                >
                                    <ImagesStackPanelExpanded
                                        setSelected={setSelected}
                                        pipeline_id={pipeline.id}
                                    />
                                </ImagesProvider>
                            )
                    )
                    : (
                        <Grid
                            container
                            spacing={1}
                        >
                            <Grid
                                item
                                md={5}
                                xs={12}
                            >
                                <DTImagesStack
                                    onClick={() => setSelected(true)}
                                />
                            </Grid>
                            <Grid
                                item
                                md={7}
                                xs={12}
                            >
                                {
                                    pipeline.id
                                        ? (
                                            <>
                                                <Typography
                                                    variant='h4'
                                                    color='textPrimary'
                                                    gutterBottom
                                                >
                                                    Augmented image ({pipeline.image_count})
                                                </Typography>


                                                <ViewPipelineAction
                                                    pipeline_id={pipeline.id}
                                                />
                                                <DeletePipelineAction
                                                    pipeline_id={pipeline.id}
                                                    callback={() => savePipelines(pipelines => pipelines.filter(current => current.id !== pipeline.id))}
                                                />

                                            </>
                                        ) : (
                                            <>
                                                <Typography
                                                    variant='h4'
                                                    color='textPrimary'
                                                    gutterBottom
                                                >
                                                    Original images ({dataset.image_count})
                                                </Typography>

                                                <Typography
                                                    color='textSecondary'
                                                    gutterBottom
                                                >
                                                    These images needs to be labeled by hand, and will be used to perform
                                                    augmentation
                                                    task to grow your dataset.
                                                </Typography>

                                                <Typography
                                                    color='textSecondary'
                                                    gutterBottom
                                                >
                                                    Check
                                                    {' '}
                                                    <Link
                                                        variant='subtitle1'
                                                        color='secondary'
                                                        component={RouterLink}
                                                        to='/docs'
                                                    >
                                                        original images
                                                    </Link>
                                                    {' '}
                                                    section on our documentation to understand.
                                                </Typography>

                                                <UploadAction/>
                                            </>
                                        )
                                }
                            </Grid>
                        </Grid>
                    )}
            </CardContent>
        </Card>
    )
}

export default ImagesStackPanel;
