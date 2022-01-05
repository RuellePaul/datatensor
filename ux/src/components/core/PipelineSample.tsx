import React, {FC, useCallback, useState} from 'react';
import {AxiosResponse} from 'axios';
import {useSnackbar} from 'notistack';
import {Formik} from 'formik';
import clsx from 'clsx';
import {Box, Button, CircularProgress, FormHelperText, Grid} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import type {Theme} from 'src/theme';
import {useSelector} from 'src/store';
import {Operation} from 'src/types/pipeline';
import ImageBase64 from 'src/components/utils/ImageBase64';
import {Label} from 'src/types/label';
import wait from 'src/utils/wait';
import useDataset from 'src/hooks/useDataset';
import Masonry from '@mui/lab/Masonry';
import MasonryItem from '@mui/lab/MasonryItem';


interface PipelineSampleProps {
    handler: (operations: Operation[]) => Promise<AxiosResponse>;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    loader: {
        width: '20px !important',
        height: '20px !important'
    }
}));

const PipelineSample: FC<PipelineSampleProps> = ({ handler, className }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const { dataset } = useDataset();

    const pipeline = useSelector<any>((state) => state.pipeline);

    const [imagesBase64, setImagesBase64] = useState<string[]>([]);
    const [imagesLabels, setImagesLabels] = useState<Label[][]>([]);

    const doSample = useCallback(async () => {
        if (dataset.id && pipeline.isLoaded) {
            const operations: Operation[] = pipeline.operations.allIds.map(id => pipeline.operations.byId[id]);

            try {
                await wait(10);

                const response = await handler(operations);

                setImagesBase64(response.data.images);
                setImagesLabels(response.data.images_labels);

            } catch (error) {
                console.error(error);
                enqueueSnackbar((error.message) || 'Something went wrong', { variant: 'error' });
            }
        }

        // eslint-disable-next-line
    }, [pipeline.isLoaded, dataset.id, pipeline.operations]);

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
                                        fullWidth
                                        size="small"
                                        variant="contained"
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

                <Masonry columns={{ xs: 2, sm: 3, }} spacing={1}>
                    {imagesBase64.map((imageBase64, index) => (
                        <MasonryItem key={`masonry_image_${index}`}>
                            <ImageBase64
                                imageBase64={imageBase64}
                                labels={imagesLabels[index]}
                            />
                        </MasonryItem>
                    ))}
                </Masonry>
            </Grid>
        </div>
    );
};

export default PipelineSample;
