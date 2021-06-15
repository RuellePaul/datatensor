import type {FC} from 'react';
import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Box, Button, Divider, Grid, Slider, TextField, Typography} from '@material-ui/core';
import {useDispatch} from 'src/store';
import type {Operation} from 'src/types/pipeline';
import {updateOperation} from 'src/slices/pipeline';
import {OPERATIONS_INITIAL_PROPERTIES, OPERATIONS_SHAPES} from 'src/config';

interface OperationPropertiesProps {
    operation: Operation,
}

const OperationProperties: FC<OperationPropertiesProps> = ({operation}) => {
    const dispatch = useDispatch();

    const handlePropertiesChange = async (properties): Promise<void> => {
        try {
            await dispatch(updateOperation(operation.id, {properties}));
        } catch (err) {
            console.error(err);
        }
    };

    if (Object.keys(operation.properties).length === 0)
        return null;

    return (
        <Formik
            initialValues={{
                ...(OPERATIONS_INITIAL_PROPERTIES[operation.type] || {}),
                ...operation.properties
            }}
            validationSchema={Yup.object().shape(OPERATIONS_SHAPES[operation.type] || {})}
            onSubmit={async (values) => {
                try {
                    await handlePropertiesChange(values);
                } catch (error) {
                    console.error(error);
                }
            }}
        >
            {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  setFieldValue,
                  touched,
                  values
              }) => (
                <form
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <Box mb={1}>
                        <Typography
                            variant='overline'
                            color='textSecondary'
                        >
                            Properties
                        </Typography>
                    </Box>

                    <Grid
                        container
                        spacing={4}
                    >
                        {operation.type === 'rotate' && (
                            <>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.max_left_rotation && errors.max_left_rotation)}
                                        fullWidth
                                        helperText={touched.max_left_rotation && errors.max_left_rotation}
                                        label='Max left rotation'
                                        name='max_left_rotation'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type='number'
                                        value={values.max_left_rotation}
                                        variant='outlined'
                                        InputProps={{inputProps: {min: 0, max: 25}}}
                                        size='small'
                                    />
                                </Grid>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.max_right_rotation && errors.max_right_rotation)}
                                        fullWidth
                                        helperText={touched.max_right_rotation && errors.max_right_rotation}
                                        label='Max right rotation'
                                        name='max_right_rotation'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type='number'
                                        value={values.max_right_rotation}
                                        variant='outlined'
                                        InputProps={{inputProps: {min: 0, max: 25}}}
                                        size='small'
                                    />
                                </Grid>
                            </>
                        )}
                        {operation.type === 'skew' && (
                            <>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <Typography
                                        color='textPrimary'
                                        variant='subtitle2'
                                    >
                                        Magnitude
                                    </Typography>
                                    <Slider
                                        name='magnitude'
                                        onBlur={handleBlur}
                                        onChange={(event, value) => setFieldValue('magnitude', value)}
                                        value={values.magnitude}
                                        min={0.05}
                                        max={1}
                                        step={0.05}
                                        marks
                                        valueLabelDisplay='auto'
                                    />
                                </Grid>
                            </>
                        )}
                        {operation.type === 'crop_random' && (
                            <>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <Typography
                                        color='textPrimary'
                                        variant='subtitle2'
                                    >
                                        Percentage_area
                                    </Typography>
                                    <Slider
                                        name='percentage_area'
                                        onBlur={handleBlur}
                                        onChange={(event, value) => setFieldValue('percentage_area', value)}
                                        value={values.percentage_area}
                                        min={0.05}
                                        max={1}
                                        step={0.05}
                                        marks
                                        valueLabelDisplay='auto'
                                    />
                                </Grid>
                            </>
                        )}
                        {operation.type === 'shear' && (
                            <>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.max_shear_left && errors.max_shear_left)}
                                        fullWidth
                                        helperText={touched.max_shear_left && errors.max_shear_left}
                                        label='Max shear left'
                                        name='max_shear_left'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type='number'
                                        value={values.max_shear_left}
                                        variant='outlined'
                                        InputProps={{inputProps: {min: 1, max: 25}}}
                                        size='small'
                                    />
                                </Grid>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.max_shear_right && errors.max_shear_right)}
                                        fullWidth
                                        helperText={touched.max_shear_right && errors.max_shear_right}
                                        label='Max shear left'
                                        name='max_shear_right'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type='number'
                                        value={values.max_shear_right}
                                        variant='outlined'
                                        InputProps={{inputProps: {min: 1, max: 25}}}
                                        size='small'
                                    />
                                </Grid>
                            </>
                        )}
                        {operation.type === 'random_distortion' && (
                            <>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.grid_width && errors.grid_width)}
                                        fullWidth
                                        helperText={touched.grid_width && errors.grid_width}
                                        label='Grid width'
                                        name='grid_width'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type='number'
                                        value={values.grid_width}
                                        variant='outlined'
                                        InputProps={{inputProps: {min: 1, max: 20}}}
                                        size='small'
                                    />
                                </Grid>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.grid_height && errors.grid_height)}
                                        fullWidth
                                        helperText={touched.grid_height && errors.grid_height}
                                        label='Grid height'
                                        name='grid_height'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type='number'
                                        value={values.grid_height}
                                        variant='outlined'
                                        InputProps={{inputProps: {min: 1, max: 20}}}
                                        size='small'
                                    />
                                </Grid>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <Typography
                                        color='textPrimary'
                                        variant='subtitle2'
                                    >
                                        Magnitude
                                    </Typography>
                                    <Slider
                                        name='magnitude'
                                        onBlur={handleBlur}
                                        onChange={(event, value) => setFieldValue('magnitude', value)}
                                        value={values.magnitude}
                                        min={1}
                                        max={20}
                                        step={1}
                                        marks
                                        valueLabelDisplay='auto'
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>

                    <Box my={2}>
                        <Button
                            color='secondary'
                            disabled={isSubmitting}
                            type='submit'
                            variant='contained'
                            size='small'
                        >
                            Update properties
                        </Button>
                    </Box>

                    <Divider/>
                </form>
            )}
        </Formik>
    );
}

export default OperationProperties;