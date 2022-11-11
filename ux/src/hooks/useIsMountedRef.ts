import {MutableRefObject, useEffect, useRef} from 'react';

const useIsMountedRef = (): MutableRefObject<boolean> => {
    const isMounted = useRef(true);

    useEffect(
        () => () => {
            isMounted.current = false;
        },
        []
    );

    return isMounted;
};

export default useIsMountedRef;
