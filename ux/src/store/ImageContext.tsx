import React, {createContext, FC, ReactNode, useCallback, useEffect, useState} from 'react';
import {useSnackbar} from 'notistack';
import useImages from 'src/hooks/useImages';
import {Label} from 'src/types/label';
import {Image} from 'src/types/image';
import api from 'src/utils/api';
import useDataset from 'src/hooks/useDataset';

export interface ImageContextValue {
    image: Image;
    labels: Label[];
    saveLabels: (update: Label[] | ((labels: Label[]) => Label[])) => void;
    validateLabels: () => void;
    storePosition: (update: Label[]) => void;
    previousPosition: () => void;
    positions: Label[][];
}

interface ImageProviderProps {
    image: Image;
    children?: ReactNode;
    labels?: Label[]; // for public data
}

export const ImageContext = createContext<ImageContextValue>({
    image: null,
    labels: [],
    saveLabels: () => {},
    validateLabels: () => {},
    positions: [],
    storePosition: () => {},
    previousPosition: () => {}
});

export const ImageProvider: FC<ImageProviderProps> = ({image, children, labels = null}) => {
    const {dataset, saveCategories} = useDataset();
    const {saveImages} = useImages();

    const {enqueueSnackbar} = useSnackbar();

    const [currentLabels, setCurrentLabels] = useState<Label[]>(labels);

    const [positions, setPositions] = useState<Label[][]>([]);

    const handleSaveLabels = (update: Label[] | ((labels: Label[]) => Label[])): void => {
        setCurrentLabels(update);
    };

    const fetchLabels = useCallback(async () => {
        if (labels !== null) {
            handleSaveLabels(labels);
            setPositions([labels]);
            return;
        }

        setCurrentLabels(null);

        if (image) {
            try {
                const response = await api.get<{labels: Label[]}>(`/datasets/${dataset.id}/images/${image.id}/labels/`);
                handleSaveLabels(response.data.labels);
                setPositions([response.data.labels]);
            } catch (err) {
                console.error(err);
            }
        }
    }, [dataset.id, image, labels]);

    useEffect(() => {
        fetchLabels();
    }, [fetchLabels]);

    const validateLabels = async () => {
        if (labels !== null) return;

        try {
            const response = await api.post<any>(`/datasets/${dataset.id}/images/${image.id}/labels/`, {
                labels: currentLabels
            });
            saveCategories(categories =>
                categories.map(category => ({
                    ...category,
                    labels_count: category.labels_count + (response.data[category.id] ? response.data[category.id] : 0)
                }))
            );
            enqueueSnackbar('Labels updated', {variant: 'info'});
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        } finally {
            saveImages(images => images
                .filter(current => current.id !== image.id)
                .concat({...image, labels: currentLabels})
            )
        }
    };

    const handleSavePosition = (update: Label[]): void => {
        setPositions(positions => [...positions, update]);
    };

    const handlePreviousPosition = async () => {
        if (positions.length < 1) return;
        if (positions.length === 1) {
            setCurrentLabels(positions[0]);
        } else {
            setCurrentLabels(positions[positions.length - 2]);
            setPositions(positions.slice(0, positions.length - 1));
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
                previousPosition: handlePreviousPosition
            }}
        >
            {children}
        </ImageContext.Provider>
    );
};

export const ImageConsumer = ImageContext.Consumer;

export default ImageContext;
