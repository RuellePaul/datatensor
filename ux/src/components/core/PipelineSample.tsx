import React, {FC, useCallback, useState} from 'react';
import {useParams} from 'react-router';
import {useSnackbar} from 'notistack';
import {Formik} from 'formik';
import clsx from 'clsx';
import {Box, Button, CircularProgress, FormHelperText, Grid} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import type {Theme} from 'src/theme';
import {useSelector} from 'src/store';
import {Operation} from 'src/types/pipeline';
import useImage from 'src/hooks/useImage';
import api from 'src/utils/api';
import ImageBase64 from 'src/components/utils/ImageBase64';
import {Label} from 'src/types/label';
import wait from 'src/utils/wait';


interface PipelineSampleProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    loader: {
        width: '20px !important',
        height: '20px !important'
    }
}));

const PipelineSample: FC<PipelineSampleProps> = ({ className }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const { dataset_id } = useParams();
    const { image } = useImage();

    const pipeline = useSelector<any>((state) => state.pipeline);

    const image_id = image?.id;

    const [imagesBase64, setImagesBase64] = useState<string[]>([]);
    const [imagesLabels, setImagesLabels] = useState<Label[][]>([]);

    const doSample = useCallback(async () => {
        if (dataset_id && image_id && pipeline.isLoaded) {
            const operations: Operation[] = pipeline.operations.allIds.map(id => pipeline.operations.byId[id]);

            try {
                await wait(10);

                const response = await api.post<{ images: string[], images_labels: Label[][] }>(`/datasets/${dataset_id}/pipelines/sample`, {
                    image_id,
                    operations
                });

                setImagesBase64(response.data.images);
                setImagesLabels(response.data.images_labels);

            } catch (error) {
                console.error(error);
                enqueueSnackbar((error.message) || 'Something went wrong', { variant: 'error' });
            }
        }

        // eslint-disable-next-line
    }, [pipeline.isLoaded, dataset_id, image_id, pipeline.operations]);

    if (!image)
        return null;

    return (
        <div className={clsx(classes.root, className)}>
            <Grid
                container
                spacing={1}
            >
                <Grid
                    item
                    xs={12}
                >
                    <Formik
                        initialValues={{
                            submit: null
                        }}
                        onSubmit={async (values, {
                            setErrors,
                            setStatus,
                            setSubmitting
                        }) => {
                            try {
                                await doSample();

                                setStatus({ success: true });
                                setSubmitting(false);
                            } catch (err) {
                                console.error(err);
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({
                              errors,
                              handleSubmit,
                              isSubmitting
                          }) => (
                            <form
                                onSubmit={handleSubmit}
                            >

                                <Box mb={1}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        type="submit"
                                        disabled={isSubmitting}
                                        endIcon={isSubmitting && (
                                            <CircularProgress
                                                className={classes.loader}
                                                color="inherit"
                                            />
                                        )}
                                    >
                                        {isSubmitting ? 'Computing...' : 'Compute sample'}
                                    </Button>
                                </Box>

                                {errors.submit && (
                                    <Box mt={3}>
                                        <FormHelperText error>
                                            {errors.submit}
                                        </FormHelperText>
                                    </Box>
                                )}
                            </form>
                        )}
                    </Formik>
                </Grid>

                {imagesBase64.map((imageBase64, index) => (
                    <Grid
                        key={index}
                        item
                        xs={image.width > image.height ? 6 : 4}
                    >
                        <ImageBase64
                            imageBase64={imageBase64}
                            labels={imagesLabels[index]}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default PipelineSample;
