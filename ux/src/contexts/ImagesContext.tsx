import React, {createContext, FC, ReactNode, useCallback, useEffect, useState} from 'react';
import {Image} from 'src/types/image';
import api from 'src/utils/api';

export interface ImagesContextValue {
    images: Image[];
    saveImages: (update: Image[] | ((images: Image[]) => Image[])) => void;
}

interface ImagesProviderProps {
    dataset_id: string;
    images?: Image[];
    children?: ReactNode;
}

export const ImagesContext = createContext<ImagesContextValue>({
    images: [],
    saveImages: () => {}
});

export const ImagesProvider: FC<ImagesProviderProps> = ({dataset_id, images, children}) => {
    const [currentImages, setCurrentImages] = useState<Image[]>(images || []);

    const handleSaveImages = (update: Image[] | ((images: Image[]) => Image[])): void => {
        setCurrentImages(update);
    };

    const fetchImages = useCallback(async () => {
        try {
            const response = await api.get<Image[]>(`/v1/images/manage/${dataset_id}`);

            handleSaveImages(response.data);
        } catch (err) {
            console.error(err);
        }

    }, [dataset_id]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);


    return (
        <ImagesContext.Provider
            value={{
                images: currentImages,
                saveImages: handleSaveImages
            }}
        >
            {children}
        </ImagesContext.Provider>
    )
};

export const ImagesConsumer = ImagesContext.Consumer;

export default ImagesContext;
