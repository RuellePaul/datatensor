import React, {createContext, FC, ReactNode, useCallback, useEffect, useState} from 'react';
import {Image} from 'src/types/image';
import api from 'src/utils/api';
import useDataset from 'src/hooks/useDataset';
import SplashScreen from 'src/components/screens/SplashScreen';
import {LAZY_LOAD_BATCH} from 'src/constants';

export interface ImagesContextValue {
    images: Image[];
    saveImages: (update: Image[] | ((images: Image[]) => Image[])) => void;
    offset: number;
    saveOffset: (update: number | ((offset: number) => number)) => void;
}

interface ImagesProviderProps {
    children?: ReactNode;
}

export const ImagesContext = createContext<ImagesContextValue>({
    images: [],
    saveImages: () => {
    },
    offset: LAZY_LOAD_BATCH,
    saveOffset: () => {
    }
});

export const ImagesProvider: FC<ImagesProviderProps> = ({children}) => {
    const [currentImages, setCurrentImages] = useState<Image[] | []>([]);
    const [currentOffset, setCurrentOffset] = useState<number>(0);

    const {dataset, pipelines} = useDataset();

    const handleSaveImages = (update: Image[] | ((images: Image[]) => Image[])): void => {
        setCurrentImages(update);
    };

    const fetchImages = useCallback(async (reset: boolean = false) => {
        try {
            if (currentImages.length >= dataset.image_count) return;

            const response = await api.get<{ images: Image[] }>(`/datasets/${dataset.id}/images/`, {
                params: {
                    offset: currentOffset,
                    limit: LAZY_LOAD_BATCH
                }
            });
            handleSaveImages(images => reset ? response.data.images : [...images, ...response.data.images]);
        } catch (err) {
            handleSaveImages([]);
            console.error(err);
        }

        // eslint-disable-next-line
    }, [dataset.id, currentOffset]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    if (currentImages === null)
        return (
            <SplashScreen/>
        );

    return (
        <ImagesContext.Provider
            value={{
                images: currentImages,
                saveImages: handleSaveImages,
                offset: currentOffset,
                saveOffset: setCurrentOffset
            }}
        >
            {children}
        </ImagesContext.Provider>
    )
};

export const ImagesConsumer = ImagesContext.Consumer;

export default ImagesContext;
