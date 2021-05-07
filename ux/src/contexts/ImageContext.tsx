import React, {createContext, FC, ReactNode, useCallback, useEffect, useState} from 'react';
import {Image} from 'src/types/image';
import api from 'src/utils/api';
import {Box, CircularProgress} from '@material-ui/core';

export interface ImageContextValue {
    image: Image;
    saveImage: (update: Image | ((image: Image) => Image)) => void;
}

interface ImageProviderProps {
    image_id: string;
    children?: ReactNode;
}

export const ImageContext = createContext<ImageContextValue>({
    image: null,
    saveImage: () => {
    }
});

export const ImageProvider: FC<ImageProviderProps> = ({image_id, children}) => {
    const [currentImage, setCurrentImage] = useState<Image>(null);

    const handleSaveImage = (update: Image | ((image: Image) => Image)): void => {
        setCurrentImage(update);
    };

    const fetchImage = useCallback(async () => {
        try {
            const response = await api.get<Image>(`/v1/images/${image_id}`);
            handleSaveImage(response.data);
        } catch (err) {
            console.error(err);
        }

    }, [image_id]);

    useEffect(() => {
        fetchImage();
    }, [fetchImage]);

    if (currentImage === null)
        return (
            <Box
                display="flex"
                justifyContent="center"
            >
                <CircularProgress/>
            </Box>
        );

    return (
        <ImageContext.Provider
            value={{
                image: currentImage,
                saveImage: handleSaveImage
            }}
        >
            {children}
        </ImageContext.Provider>
    )
};

export const ImageConsumer = ImageContext.Consumer;

export default ImageContext;
