import React, {FC} from 'react';
import {useSnackbar} from 'notistack';
import clsx from 'clsx';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {Button, CircularProgress, makeStyles} from '@material-ui/core';
import {ArrowRight} from 'react-feather';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import api from 'src/utils/api';

interface NextUnlabeledImageActionProps {
    index: number;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    button: {
        whiteSpace: 'nowrap',
        marginLeft: theme.spacing(2)
    },
    loader: {
        width: '20px !important',
        height: '20px !important'
    }
}));

const NextUnlabeledImageAction: FC<NextUnlabeledImageActionProps> = ({index, className}) => {

    const classes = useStyles();

    const {enqueueSnackbar} = useSnackbar();

    const {dataset} = useDataset();

    return (
        <Formik
            initialValues={{
                image_count: dataset.image_count * 2,
                submit: null
            }}
            validationSchema={Yup.object().shape({
                image_count: Yup.number().min(1).max(10 * dataset.image_count),
            })}
            onSubmit={async (values, {
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                try {
                    const response = await api.post<{ image_id: string }>(`/search/datasets/${dataset.id}/unlabeled-image-id`,
                        {},
                        {
                            params: {
                                offset: index,
                            }
                        });
                    if (response.data.image_id)
                        window.location.hash = response.data.image_id;
                    else
                        enqueueSnackbar('All images have labels', {variant: 'success'});

                } catch (err) {
                    console.error(err);
                    setStatus({success: false});
                    setErrors({submit: err.message});
                    setSubmitting(false);
                }
            }}
        >
            {({
                  handleSubmit,
                  isSubmitting,
              }) => (
                <form
                    onSubmit={handleSubmit}
                    className={clsx(classes.root, className)}
                >
                    <Button
                        className={classes.button}
                        size='small'
                        variant='outlined'
                        type='submit'
                        disabled={isSubmitting}
                        endIcon={isSubmitting
                            ? <CircularProgress
                                className={classes.loader}
                                color="inherit"
                            />
                            : <ArrowRight/>
                        }
                    >
                        Next unlabeled
                    </Button>
                </form>
            )}
        </Formik>
    )
};

export default NextUnlabeledImageAction;