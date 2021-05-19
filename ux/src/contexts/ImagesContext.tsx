import React, {createContext, FC, ReactNode, useCallback, useEffect, useState} from 'react';
import {Image} from 'src/types/image';
import api from 'src/utils/api';
import useDataset from 'src/hooks/useDataset';
import SplashScreen from 'src/components/screens/SplashScreen';
import {LAZY_LOAD_BATCH} from '../constants';

export interface ImagesContextValue {
    images: Image[];
    saveImages: (update: Image[] | ((images: Image[]) => Image[])) => void;
    offset: number;
    saveOffset: (update: number | ((offset: number) => number)) => void;
}

interface ImagesProviderProps {
    images?: Image[];
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

export const ImagesProvider: FC<ImagesProviderProps> = ({images, children}) => {
    const [currentImages, setCurrentImages] = useState<Image[] | []>(images || []);
    const [currentOffset, setCurrentOffset] = useState<number>(0);

    const {dataset} = useDataset();

    const handleSaveImages = (update: Image[] | ((images: Image[]) => Image[])): void => {
        setCurrentImages(update);
    };

    const fetchImages = useCallback(async () => {
        try {
            if (currentImages.length === dataset.image_count) return;

            const response = await api.get<{ images: Image[] }>(`/datasets/${dataset._id}/images/`, {
                params: {
                    offset: currentOffset,
                    limit: LAZY_LOAD_BATCH
                }
            });
            handleSaveImages(images => [...images, ...response.data.images]);
        } catch (err) {
            handleSaveImages([]);
            console.error(err);
        }

    }, [dataset._id, currentOffset]);

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
