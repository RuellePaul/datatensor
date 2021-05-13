import React, {FC, useState} from 'react';
import {useSnackbar} from 'notistack';
import {Box, Button, TextField, Typography} from '@material-ui/core';
import api from 'src/utils/api';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Image} from 'src/types/image';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

interface ExploreProps {

}

const DTExplore: FC<ExploreProps> = () => {

    const [matchingImages, setMatchingImages] = useState<Image[]>([]);

    const isMountedRef = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();

    return (
        <>
            <Box my={1}>
                <Formik
                    initialValues={{
                        category_name: '',
                    }}
                    validationSchema={Yup.object().shape({
                        category_name: Yup.string().max(255).required('Name is required')
                    })}
                    onSubmit={async (values, {
                        setStatus,
                        setSubmitting
                    }) => {
                        try {
                            const response = await api.get<{ images: Image[] }>(`/search/images`, {params: values});
                            setMatchingImages(response.data.images);

                            if (isMountedRef.current) {
                                setStatus({success: true});
                                setSubmitting(false);
                            }
                        } catch (error) {
                            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});

                            if (isMountedRef.current) {
                                setStatus({success: false});
                                setSubmitting(false);
                            }
                        }
                    }}
                >
                    {({
                          errors,
                          handleBlur,
                          handleChange,
                          handleSubmit,
                          isSubmitting,
                          touched,
                          values
                      }) => (
                        <form
                            noValidate
                            onSubmit={handleSubmit}
                        >
                            <TextField
                                autoFocus
                                error={Boolean(touched.category_name && errors.category_name)}
                                fullWidth
                                helperText={touched.category_name && errors.category_name}
                                label="Category name *"
                                margin="normal"
                                name="category_name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.category_name}
                                variant="outlined"
                            />
                            <Typography gutterBottom>
                                Found {matchingImages.length} images
                            </Typography>
                            <Box mt={2}>
                                <Button
                                    color="secondary"
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                >
                                    Find images
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </>
    );
};

export default DTExplore;
