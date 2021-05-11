import React, {createContext, FC, ReactNode, useCallback, useEffect, useState} from 'react';
import {Label} from 'src/types/label';
import {Image} from 'src/types/image';
import api from 'src/utils/api';
import {useSnackbar} from 'notistack';

export interface ImageContextValue {
    image: Image;
    labels: Label[];
    saveLabels: (update: Label[] | ((labels: Label[]) => Label[])) => void;
    validateLabels: () => void;
}

interface ImageProviderProps {
    image: Image;
    children?: ReactNode;
}

export const ImageContext = createContext<ImageContextValue>({
    image: null,
    labels: [],
    saveLabels: () => {
    },
    validateLabels: () => {
    }
});

export const ImageProvider: FC<ImageProviderProps> = ({image, children}) => {

    const {enqueueSnackbar} = useSnackbar();

    const [currentLabels, setCurrentLabels] = useState<Label[]>(null);

    const handleSaveLabels = (update: Label[] | ((labels: Label[]) => Label[])): void => {
        setCurrentLabels(update);
    };

    const fetchLabels = useCallback(async () => {
        try {
            const response = await api.get<{ labels: Label[] }>(`/images/${image._id}/labels/`);
            handleSaveLabels(response.data.labels);
        } catch (err) {
            console.error(err);
        }

    }, [image._id]);

    useEffect(() => {
        fetchLabels();
    }, [fetchLabels]);

    const validateLabels = async () => {
        await api.post(`/images/${image._id}/labels/`, {labels: currentLabels});
        enqueueSnackbar('Labels updated', {variant: 'info'});
    };

    return (
        <ImageContext.Provider
            value={{
                image: image,
                labels: currentLabels,
                saveLabels: handleSaveLabels,
                validateLabels: validateLabels
            }}
        >
            {children}
        </ImageContext.Provider>
    )
};

export const ImageConsumer = ImageContext.Consumer;

export default ImageContext;
