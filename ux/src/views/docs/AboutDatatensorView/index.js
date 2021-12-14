import React, {lazy, Suspense} from 'react';
import Page from 'src/components/Page';

const Content = lazy(() => import('!babel-loader!mdx-loader!./Content.mdx'));

const AboutDatatensorView = () => {
    return (
        <Page title="About Datatensor">
            <Suspense fallback={null}>
                <Content />
            </Suspense>
        </Page>
    );
};

export default AboutDatatensorView;
