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
    storePosition: (update: Label[]) => void;
    previousPosition: () => void;
    positions: Label[][]
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
    },
    positions: [],
    storePosition: () => {
    },
    previousPosition: () => {
    },
});

export const ImageProvider: FC<ImageProviderProps> = ({image, children}) => {

    const {enqueueSnackbar} = useSnackbar();

    const [currentLabels, setCurrentLabels] = useState<Label[]>(null);

    const handleSaveLabels = (update: Label[] | ((labels: Label[]) => Label[])): void => {
        setCurrentLabels(update);
    };

    const fetchLabels = useCallback(async () => {
        setCurrentLabels(null);
        try {
            const response = await api.get<{ labels: Label[] }>(`/images/${image._id}/labels/`);
            handleSaveLabels(response.data.labels);
            setPositions([response.data.labels]);
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

    const [positions, setPositions] = useState<Label[][]>([]);

    const handleSavePosition = (update: Label[]): void => {
        setPositions(positions => [...positions, update]);
    };

    const handlePreviousPosition = async () => {
        if (positions.length < 1) return;
        if (positions.length === 1) {
            setCurrentLabels(positions[0]);
        } else {
            setCurrentLabels(positions[positions.length - 2]);
            setPositions(positions.slice(0, positions.length - 1))
        }
    };

    return (
        <ImageContext.Provider
            value={{
                image: image,
                labels: currentLabels,
                saveLabels: handleSaveLabels,
                validateLabels: validateLabels,
                positions: positions,
                storePosition: handleSavePosition,
                previousPosition: handlePreviousPosition,
            }}
        >
            {children}
        </ImageContext.Provider>
    )
};

export const ImageConsumer = ImageContext.Consumer;

export default ImageContext;
