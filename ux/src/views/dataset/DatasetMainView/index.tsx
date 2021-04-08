import React, {FC, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {Box, Card, CardContent, CardHeader, Container, Divider, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import ImagesDropzone from 'src/components/ImagesDropzone';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {Dataset} from 'src/types/dataset';
import {Image} from 'src/types/image';
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
    const [images, setImages] = useState<Image[]>([]);

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

    const getImages = useCallback(async () => {
        try {
            const response = await api.get<Image[]>(`/v1/images/manage/${dataset_id}`);

            if (isMountedRef.current) {
                setImages(response.data);
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMountedRef, dataset_id]);

    useEffect(() => {
        getDataset();
    }, [getDataset]);

    useEffect(() => {
        getImages();
    }, [getImages]);

    return (
        <Page
            className={classes.root}
            title="Dataset List"
        >
            <Container maxWidth="lg">
                <Box mt={3}>
                    <Card>
                        <CardHeader title="Upload Images"/>
                        <Divider/>
                        <CardContent>
                            <ImagesDropzone
                                dataset_id={dataset_id}
                            />
                        </CardContent>
                    </Card>
                </Box>

                <Box mt={3}>
                    {images.map(image => (
                        <img
                            src={image.path}
                            alt={image.id}
                            width="300"
                            height="300"
                        />
                    ))}
                </Box>
            </Container>
        </Page>
    );
};

export default DatasetMainView;
