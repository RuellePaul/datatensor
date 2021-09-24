import React, {FC, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Button, Card, CardContent, CardHeader, Grid, Link, makeStyles, Typography} from '@material-ui/core';
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
import {ImagesProvider} from '../../../../../store/ImagesContext';

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
    title: string;
    pipeline_id?: string;
}


const ImagesStackPanel: FC<ImagesStackPanelProps> = ({
                                                         title,
                                                         pipeline_id = null
                                                     }) => {

    const classes = useStyles();
    const {dataset, pipelines, savePipelines} = useDataset();
    const {currentCategory} = useCategory();
    const {images} = useImages();
    const [selected, setSelected] = useState<boolean>(false);

    return (
        <Card
            className={classes.root}
            elevation={5}
            variant='outlined'
        >
            <CardHeader
                className={classes.header}
                action={pipeline_id
                    ? (
                        <>
                            <ViewPipelineAction
                                pipeline_id={pipeline_id}
                            />
                            <DeletePipelineAction
                                pipeline_id={pipeline_id}
                                callback={() => savePipelines(pipelines => pipelines.filter(pipeline => pipeline.id !== pipeline_id))}
                            />
                        </>
                    ) : (
                        <UploadAction/>
                    )
                }
                title={title}
            />
            <CardContent className={classes.content}>
                {selected
                    ? (
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
                                    {images.length} / {pipeline_id
                                    ? pipelines.find(pipeline => pipeline.id === pipeline_id).image_count
                                    : dataset.image_count}
                                </Typography>
                            </Box>
                            {currentCategory === null
                                ? <DTImagesList pipeline_id={pipeline_id}/>
                                : (
                                    <ImagesProvider
                                        category_id={currentCategory.id}
                                        pipeline_id={pipeline_id}
                                    >
                                        <DTImagesList pipeline_id={pipeline_id}/>
                                    </ImagesProvider>
                                )
                            }
                        </div>
                    ) : (
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
                                    pipeline_id === null && (
                                        <>
                                            <Typography
                                                variant='h4'
                                                color='textPrimary'
                                                gutterBottom
                                            >
                                                Original images
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
