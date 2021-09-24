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
    pipeline_id?: string;
    category_id?: string;
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

export const ImagesProvider: FC<ImagesProviderProps> = ({children, pipeline_id, category_id}) => {
    const [currentImages, setCurrentImages] = useState<Image[] | []>([]);
    const [currentOffset, setCurrentOffset] = useState<number>(0);

    const {dataset} = useDataset();

    const handleSaveImages = (update: Image[] | ((images: Image[]) => Image[])): void => {
        setCurrentImages(update);
    };

    const fetchImages = useCallback(async () => {
        try {
            if (currentImages.length >= dataset.image_count) return;

            const response = await api.get<{ images: Image[] }>(
                category_id
                    ? `/datasets/${dataset.id}/categories/${category_id}/images`
                    : `/datasets/${dataset.id}/images/`
                , {
                params: {
                    offset: currentOffset,
                    limit: LAZY_LOAD_BATCH,
                    pipeline_id
                }
            });
            handleSaveImages(images => [...images, ...response.data.images]);
        } catch (err) {
            handleSaveImages([]);
            console.error(err);
        }

        // eslint-disable-next-line
    }, [dataset.id, currentOffset, pipeline_id, category_id]);

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
