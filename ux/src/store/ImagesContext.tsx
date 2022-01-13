import React, {createContext, FC, ReactNode, useCallback, useEffect, useState} from 'react';
import NProgress from 'nprogress';

import {Image} from 'src/types/image';
import api from 'src/utils/api';
import useDataset from 'src/hooks/useDataset';
import {LAZY_LOAD_BATCH} from 'src/constants';

export interface ImagesContextValue {
    images: Image[] | null;
    saveImages: (update: Image[] | ((images: Image[]) => Image[])) => void;
    offset: number;
    saveOffset: (update: number | ((offset: number) => number)) => void;
    totalImagesCount: number | null;
}

interface ImagesProviderProps {
    original_image_id?: string;
    category_id?: string;
    children?: ReactNode;
    images?: Image[]; // for public data
}

export const ImagesContext = createContext<ImagesContextValue>({
    images: [],
    saveImages: () => {},
    offset: LAZY_LOAD_BATCH,
    saveOffset: () => {},
    totalImagesCount: null
});

export const ImagesProvider: FC<ImagesProviderProps> = ({children, original_image_id, category_id, images = null}) => {
    const [currentImages, setCurrentImages] = useState<Image[] | null>(null);
    const [currentOffset, setCurrentOffset] = useState<number>(0);
    const [totalImagesCount, setTotalImagesCount] = useState<number | null>(null);

    const {dataset} = useDataset();

    const handleSaveImages = (update: Image[] | ((images: Image[]) => Image[])): void => {
        setCurrentImages(update);
    };

    const fetchImages = useCallback(async () => {
        NProgress.start();

        try {
            let response;

            if (category_id) {
                response = await api.get<{
                    images: Image[];
                    total_count: number;
                }>(`/datasets/${dataset.id}/categories/${category_id}/images`, {
                    params: {
                        offset: currentOffset,
                        limit: LAZY_LOAD_BATCH
                    }
                });
                setTotalImagesCount(response.data.total_count);
            } else {
                response = await api.get<{images: Image[]}>(`/datasets/${dataset.id}/images/`, {
                    params: {
                        offset: currentOffset,
                        limit: LAZY_LOAD_BATCH,
                        original_image_id,
                        include_labels: true
                    }
                });
                setTotalImagesCount(null);
            }

            handleSaveImages(response.data.images.length > 0 ? response.data.images : []);
        } catch (err) {
            handleSaveImages([]);
            console.error(err);
        } finally {
            NProgress.done();
        }

        // eslint-disable-next-line
    }, [dataset.id, currentOffset, original_image_id, category_id]);

    useEffect(() => {
        images === null && fetchImages();
    }, [fetchImages, images]);

    return (
        <ImagesContext.Provider
            value={{
                images: images || currentImages,
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
