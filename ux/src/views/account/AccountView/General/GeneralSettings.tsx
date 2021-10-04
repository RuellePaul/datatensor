import React, {FC} from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {useSnackbar} from 'notistack';
import {Box, Button, Card, CardContent, CardHeader, Divider, Grid, Switch, TextField, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Autocomplete from '@mui/material/Autocomplete';
import {User} from 'src/types/user';
import api from 'src/utils/api';
import countries, {Country} from './countries';

interface GeneralSettingsProps {
    className?: string;
    user: User;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const GeneralSettings: FC<GeneralSettingsProps> = ({
    className,
    user,
    ...rest
}) => {
    const classes = useStyles();

    const {enqueueSnackbar} = useSnackbar();

    return (
        <Formik
            enableReinitialize
            initialValues={{
                city: user.city || '',
                country: user.country || '',
                is_public: user.is_public || false,
                name: user.name || '',
                phone: user.phone || ''
            }}
            validationSchema={Yup.object().shape({
                city: Yup.string().max(255),
                country: Yup.string().max(255),
                is_public: Yup.bool(),
                name: Yup.string()
                    .max(255)
                    .required('Name is required'),
                phone: Yup.string()
            })}
            onSubmit={async (values, {setStatus, setSubmitting}) => {
                try {
                    await api.patch(`/users/me`, values);
                    enqueueSnackbar(`Profile updated`, {variant: 'success'});
                    setStatus({success: true});
                    setSubmitting(false);
                } catch (error) {
                    enqueueSnackbar(error.message || 'Something went wrong', {
                        variant: 'error'
                    });
                    setStatus({success: false});
                    setSubmitting(false);
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
                <form onSubmit={handleSubmit}>
                    <Card className={clsx(classes.root, className)} {...rest}>
                        <CardHeader title="Profile" />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={4}>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        error={Boolean(
                                            touched.name && errors.name
                                        )}
                                        fullWidth
                                        helperText={touched.name && errors.name}
                                        label="Name"
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        helperText="We will use this email to contact you"
                                        label="Email Address"
                                        type="email"
                                        value={user.email}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        error={Boolean(
                                            touched.phone && errors.phone
                                        )}
                                        fullWidth
                                        helperText={
                                            touched.phone && errors.phone
                                        }
                                        label="Phone Number"
                                        name="phone"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.phone}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        error={Boolean(
                                            touched.city && errors.city
                                        )}
                                        fullWidth
                                        helperText={touched.city && errors.city}
                                        label="City"
                                        name="city"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.city}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Autocomplete
                                        getOptionLabel={option => option.text}
                                        options={countries}
                                        defaultValue={countries.find(
                                            country =>
                                                country.text === user.country
                                        )}
                                        onChange={(event, country) =>
                                            setFieldValue(
                                                'country',
                                                (country as Country).text
                                            )
                                        }
                                        renderInput={params => (
                                            <TextField
                                                fullWidth
                                                label="Country"
                                                name="country"
                                                variant="outlined"
                                                {...params}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Typography
                                        variant="h6"
                                        color="textPrimary"
                                    >
                                        Make Contact Info Public
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        Means that anyone viewing your profile
                                        will be able to see your contacts
                                        details
                                    </Typography>
                                    <Switch
                                        checked={values.is_public}
                                        edge="start"
                                        name="is_public"
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider />
                        <Box p={2} display="flex" justifyContent="flex-end">
                            <Button
                                color="primary"
                                disabled={isSubmitting}
                                type="submit"
                                variant="contained"
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </Card>
                </form>
            )}
        </Formik>
    );
};

export default GeneralSettings;
