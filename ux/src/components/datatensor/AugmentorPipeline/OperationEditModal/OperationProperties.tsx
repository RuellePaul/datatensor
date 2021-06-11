import type {FC} from 'react';
import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Button, Grid, TextField, Typography} from '@material-ui/core';
import {useDispatch} from 'src/store';
import type {Operation} from 'src/types/pipeline';
import {updateOperation} from 'src/slices/pipeline';

interface OperationPropertiesProps {
    operation: Operation,
}

const OperationProperties: FC<OperationPropertiesProps> = ({operation}) => {
    const dispatch = useDispatch();

    const handlePropertiesChange = async (properties): Promise<void> => {
        try {
            await dispatch(updateOperation(operation.id, {properties: properties}));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Formik
            initialValues={{
                max_left_rotation: 25,
                max_right_rotation: 25
            }}
            validationSchema={Yup.object().shape({
                max_left_rotation: Yup.number().min(0).max(25),
                max_right_rotation: Yup.number().min(0).max(25)
            })}
            onSubmit={async (values, {}) => {
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
                  touched,
                  values
              }) => (
                <form
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <Typography
                        variant='overline'
                        color='textSecondary'
                    >
                        Properties
                    </Typography>

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
                                        label="Max left rotation"
                                        name="max_left_rotation"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="number"
                                        value={values.max_left_rotation}
                                        variant="outlined"
                                        InputProps={{inputProps: {min: 0, max: 25}}}
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
                                        label="Max right rotation"
                                        name="max_right_rotation"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="number"
                                        value={values.max_right_rotation}
                                        variant="outlined"
                                        InputProps={{inputProps: {min: 0, max: 25}}}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>


                    <Button
                        color="secondary"
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                    >
                        Update properties
                    </Button>
                </form>
            )}
        </Formik>
    );
}

export default OperationProperties;