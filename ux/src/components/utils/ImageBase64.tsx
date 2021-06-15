import React, {FC} from 'react';

interface ImageBase64Props {
    base64string: string;
    [key: string]: any;
}

const ImageBase64: FC<ImageBase64Props> = ({base64string, ...props}) => {

    return (
        <img
            src={`data:image/png;base64, ${base64string}`}
            alt='Augmented sample'
            width="100%"
            draggable={false}
            {...props}
        />
    );
};

export default ImageBase64;
