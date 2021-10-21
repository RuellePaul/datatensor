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
    totalImagesCount: number | null;
}

interface ImagesProviderProps {
    pipeline_id?: string;
    category_id?: string;
    children?: ReactNode;
}

export const ImagesContext = createContext<ImagesContextValue>({
    images: [],
    saveImages: () => {},
    offset: LAZY_LOAD_BATCH,
    saveOffset: () => {},
    totalImagesCount: null
});

export const ImagesProvider: FC<ImagesProviderProps> = ({children, pipeline_id, category_id}) => {
    const [currentImages, setCurrentImages] = useState<Image[] | []>([]);
    const [currentOffset, setCurrentOffset] = useState<number>(0);
    const [totalImagesCount, setTotalImagesCount] = useState<number | null>(null);

    const {dataset} = useDataset();

    const handleSaveImages = (update: Image[] | ((images: Image[]) => Image[])): void => {
        setCurrentImages(update);
    };

    const fetchImages = useCallback(async () => {
        try {
            if (currentImages.length >= dataset.image_count) return;

            let response;

            if (category_id) {
                response = await api.get<{
                    images: Image[];
                    total_count: number;
                }>(`/datasets/${dataset.id}/categories/${category_id}/images`, {
                    params: {
                        offset: currentOffset,
                        limit: LAZY_LOAD_BATCH,
                        pipeline_id
                    }
                });
                setTotalImagesCount(response.data.total_count);
            } else {
                response = await api.get<{images: Image[]}>(`/datasets/${dataset.id}/images/`, {
                    params: {
                        offset: currentOffset,
                        limit: LAZY_LOAD_BATCH,
                        pipeline_id
                    }
                });
                setTotalImagesCount(null);
            }

            handleSaveImages(response.data.images);
        } catch (err) {
            handleSaveImages([]);
            console.error(err);
        }

        // eslint-disable-next-line
    }, [dataset.id, currentOffset, pipeline_id, category_id]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    if (currentImages === null) return <SplashScreen />;

    return (
        <ImagesContext.Provider
            value={{
                images: currentImages,
                saveImages: handleSaveImages,
                offset: currentOffset,
                saveOffset: setCurrentOffset,
                totalImagesCount: totalImagesCount
            }}
        >
            {children}
        </ImagesContext.Provider>
    );
};

export const ImagesConsumer = ImagesContext.Consumer;

export default ImagesContext;
