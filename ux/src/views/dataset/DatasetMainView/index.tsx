import React, {FC, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {Container, makeStyles, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {Dataset} from 'src/types/dataset';
import api from 'src/utils/api'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        padding: theme.spacing(3, 0)
    }
}));

const DatasetMainView: FC = () => {
    const {dataset_id} = useParams();

    const classes = useStyles();
    const isMountedRef = useIsMountedRef();
    const [dataset, setDataset] = useState<Dataset>();

    const getDataset = useCallback(async () => {
        try {
            const response = await api.get<Dataset>(`/v1/dataset/manage/${dataset_id}`);

            if (isMountedRef.current) {
                setDataset(response.data);
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMountedRef, dataset_id]);

    useEffect(() => {
        getDataset();
    }, [getDataset]);

    return (
        <Page
            className={classes.root}
            title="Dataset List"
        >
            <Container maxWidth="lg">
                <Typography
                    color="textPrimary"
                    gutterBottom
                >
                    {JSON.stringify(dataset)}
                </Typography>

                <Typography
                    color="textPrimary"
                    gutterBottom
                >
                    {JSON.stringify({})}
                </Typography>
            </Container>
        </Page>
    );
};

export default DatasetMainView;
