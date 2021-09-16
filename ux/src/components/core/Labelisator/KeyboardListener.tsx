import {FC} from 'react';
import useImage from 'src/hooks/useImage';
import useEventListener from 'use-typed-event-listener';

interface KeyboardListenerProps {
    index: number;
    imageIds: string[];
    setTool: any;
}

const KeyboardListener: FC<KeyboardListenerProps> = ({index, imageIds, setTool}) => {

    const {validateLabels, previousPosition} = useImage();

    const handleKeyDown = async (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
            if (index === 0) return;
            window.location.hash = imageIds[index - 1]
        } else if (event.key === 'ArrowRight') {
            if (index === imageIds.length - 1) return;
            window.location.hash = imageIds[index + 1]
        } else if (event.key === 'a') {
            setTool('label')
        } else if (!event.ctrlKey && event.key === 'z') {
            setTool('move')
        } else if (event.key === 's') {
            validateLabels();
        } else if (event.ctrlKey && event.key === 'z') {
            previousPosition()
        }
    };

    useEventListener(window, 'keydown', handleKeyDown);

    return null;
};

export default KeyboardListener;