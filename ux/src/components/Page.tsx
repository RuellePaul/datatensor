import React, {forwardRef, HTMLProps, ReactNode, useCallback, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {useLocation} from 'react-router-dom';
import track from 'src/utils/analytics';

interface PageProps extends HTMLProps<HTMLDivElement> {
    children?: ReactNode;
    title?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({
                                                        children,
                                                        title = '',
                                                        ...rest
                                                    }, ref) => {
    const location = useLocation();

    const sendPageViewEvent = useCallback(() => {
        track.pageview({
            page_path: location.pathname
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        sendPageViewEvent();
    }, [sendPageViewEvent]);

    console.log(process.env.REACT_APP_ENVIRONMENT)

    return (
        <div
            ref={ref as any}
            {...rest}
        >
            <Helmet>
                <title>
                    {title}
                    {' | '}
                    Datatensor
                    {' '}
                    {process.env.REACT_APP_ENVIRONMENT === 'development' ? '🔥' : ''}
                    {process.env.REACT_APP_ENVIRONMENT === 'test' ? '🧪' : ''}
                </title>
            </Helmet>
            {children}
        </div>
    );
});

export default Page;
