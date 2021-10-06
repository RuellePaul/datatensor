import type {FC} from 'react';
import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
    Alert,
    Box,
    Button,
    capitalize,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    TextField,
    Typography
} from '@mui/material';
import {useDispatch} from 'src/store';
import type {Operation} from 'src/types/pipeline';
import {updateOperation} from 'src/slices/pipeline';
import {OPERATIONS_INITIAL_PROPERTIES, OPERATIONS_SHAPES} from 'src/config';


interface OperationPropertiesProps {
    operation: Operation,
}

const OperationProperties: FC<OperationPropertiesProps> = ({ operation }) => {
    const dispatch = useDispatch();

    const handlePropertiesChange = async (properties): Promise<void> => {
        try {
            await dispatch(updateOperation(operation.id, { properties }));
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
                            variant="overline"
                            color="textSecondary"
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
                                        label="Max left rotation"
                                        name="max_left_rotation"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="number"
                                        value={values.max_left_rotation}
                                        variant="outlined"
                                        InputProps={{ inputProps: { min: 0, max: 25 } }}
                                        size="small"
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
                                        label="Max right rotation"
                                        name="max_right_rotation"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="number"
                                        value={values.max_right_rotation}
                                        variant="outlined"
                                        InputProps={{ inputProps: { min: 0, max: 25 } }}
                                        size="small"
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
                                        color="textPrimary"
                                        variant="subtitle2"
                                    >
                                        Magnitude
                                    </Typography>
                                    <Slider
                                        name="magnitude"
                                        onBlur={handleBlur}
                                        onChange={(event, value) => setFieldValue('magnitude', value)}
                                        value={values.magnitude}
                                        min={0.05}
                                        max={1}
                                        step={0.05}
                                        marks
                                        valueLabelDisplay="auto"
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
                                        color="textPrimary"
                                        variant="subtitle2"
                                    >
                                        Percentage_area
                                    </Typography>
                                    <Slider
                                        name="percentage_area"
                                        onBlur={handleBlur}
                                        onChange={(event, value) => setFieldValue('percentage_area', value)}
                                        value={values.percentage_area}
                                        min={0.05}
                                        max={1}
                                        step={0.05}
                                        marks
                                        valueLabelDisplay="auto"
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
                                        label="Max shear left"
                                        name="max_shear_left"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="number"
                                        value={values.max_shear_left}
                                        variant="outlined"
                                        InputProps={{ inputProps: { min: 1, max: 25 } }}
                                        size="small"
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
                                        label="Max shear left"
                                        name="max_shear_right"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="number"
                                        value={values.max_shear_right}
                                        variant="outlined"
                                        InputProps={{ inputProps: { min: 1, max: 25 } }}
                                        size="small"
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
                                        label="Grid width"
                                        name="grid_width"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="number"
                                        value={values.grid_width}
                                        variant="outlined"
                                        InputProps={{ inputProps: { min: 1, max: 20 } }}
                                        size="small"
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
                                        label="Grid height"
                                        name="grid_height"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="number"
                                        value={values.grid_height}
                                        variant="outlined"
                                        InputProps={{ inputProps: { min: 1, max: 20 } }}
                                        size="small"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <Typography
                                        color="textPrimary"
                                        variant="subtitle2"
                                    >
                                        Magnitude
                                    </Typography>
                                    <Slider
                                        name="magnitude"
                                        onBlur={handleBlur}
                                        onChange={(event, value) => setFieldValue('magnitude', value)}
                                        value={values.magnitude}
                                        min={1}
                                        max={20}
                                        step={1}
                                        marks
                                        valueLabelDisplay="auto"
                                    />
                                </Grid>
                            </>
                        )}
                        {operation.type === 'gaussian_distortion' && (
                            <>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.grid_width && errors.grid_width)}
                                        fullWidth
                                        label="Grid width"
                                        name="grid_width"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="number"
                                        value={values.grid_width}
                                        variant="outlined"
                                        InputProps={{ inputProps: { min: 1, max: 20 } }}
                                        size="small"
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
                                        label="Grid height"
                                        name="grid_height"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="number"
                                        value={values.grid_height}
                                        variant="outlined"
                                        InputProps={{ inputProps: { min: 1, max: 20 } }}
                                        size="small"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <Typography
                                        color="textPrimary"
                                        variant="subtitle2"
                                    >
                                        Magnitude
                                    </Typography>
                                    <Slider
                                        name="magnitude"
                                        onBlur={handleBlur}
                                        onChange={(event, value) => setFieldValue('magnitude', value)}
                                        value={values.magnitude}
                                        min={1}
                                        max={20}
                                        step={1}
                                        marks
                                        valueLabelDisplay="auto"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <InputLabel>Corner</InputLabel>
                                    <Select
                                        fullWidth
                                        name="corner"
                                        onChange={handleChange}
                                        value={values.corner || 'bell'}
                                        variant="outlined"
                                    >
                                        {['bell', 'ul', 'ur', 'dl', 'dr'].map(corner => (
                                            <MenuItem
                                                key={corner}
                                                value={corner}
                                            >
                                                {capitalize(corner)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <InputLabel>Method</InputLabel>
                                    <Select
                                        fullWidth
                                        name="method"
                                        onChange={handleChange}
                                        value={values.method || 'in'}
                                        variant="outlined"
                                    >
                                        {['in', 'out'].map(method => (
                                            <MenuItem
                                                key={method}
                                                value={method}
                                            >
                                                {capitalize(method)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </>
                        )}

                        {['random_brightness', 'random_color', 'random_contrast'].includes(operation.type) && (
                            <>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <Typography
                                        color="textPrimary"
                                        variant="subtitle2"
                                    >
                                        Min factor
                                    </Typography>
                                    <Slider
                                        name="min_factor"
                                        onBlur={handleBlur}
                                        onChange={(event, value) => setFieldValue('min_factor', value)}
                                        value={values.min_factor}
                                        min={1}
                                        max={4}
                                        step={0.05}
                                        marks
                                        valueLabelDisplay="auto"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <Typography
                                        color="textPrimary"
                                        variant="subtitle2"
                                    >
                                        Max factor
                                    </Typography>
                                    <Slider
                                        name="max_factor"
                                        onBlur={handleBlur}
                                        onChange={(event, value) => setFieldValue('max_factor', value)}
                                        value={values.max_factor}
                                        min={1}
                                        max={4}
                                        step={0.05}
                                        marks
                                        valueLabelDisplay="auto"
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>

                    {Object.keys(errors).length > 0 && (
                        <Alert severity="error">
                            {Object.values(errors).map(error => (
                                <>
                                    {error}
                                    <br />
                                </>))}
                        </Alert>
                    )}

                    <Box my={2}>
                        <Button
                            color="primary"
                            disabled={isSubmitting || Object.keys(errors).length > 0}
                            type="submit"
                            variant="contained"
                            size="small"
                        >
                            Update properties
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default OperationProperties;