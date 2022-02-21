import React, {lazy, Suspense} from 'react';
import Page from 'src/components/Page';

const Content = lazy(() => import('!babel-loader!mdx-loader!./Content.mdx'));

const UsingExportedDatasetView = () => {
    return (
        <Page title="Using an exported dataset">
            <Suspense fallback={null}>
                <Content />
            </Suspense>
        </Page>
    );
};

export default UsingExportedDatasetView;
