import {useEffect, useState} from 'react';

function useScroll(element: HTMLElement) {
    const [scrollTop, setScrollTop] = useState(0);
    const [scrolling, setScrolling] = useState(false);

    useEffect(() => {
        if (element !== null) {
            const onScroll = (event) => {
                setScrollTop(event.target.scrollTop);
                setScrolling(event.target.scrollTop > scrollTop);
            };
            element.addEventListener('scroll', onScroll);

            return () => element.removeEventListener('scroll', onScroll);
        }
    }, [scrollTop, element]);

    return {scrollTop, scrolling};
}

export default useScroll;
