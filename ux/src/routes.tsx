import React, {Fragment, lazy, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import DocsLayout from 'src/layouts/DocsLayout';
import HomeView from 'src/views/home/HomeView';
import LoadingScreen from 'src/components/screens/LoadingScreen';
import AuthGuard from 'src/components/guards/AuthGuard';
import GuestGuard from 'src/components/guards/GuestGuard';


type Routes = {
    exact?: boolean;
    path?: string | string[];
    guard?: any;
    layout?: any;
    component?: any;
    scope?: 'app' | 'docs';
    routes?: Routes;
}[];

export const renderRoutes = (routes: Routes = []): JSX.Element => (
    <Suspense fallback={<LoadingScreen />}>
        <Switch>
            {routes.map((route, i) => {
                const Guard = route.guard || Fragment;
                const Layout = route.layout || Fragment;
                const Component = route.component;

                return (
                    <Route
                        key={i}
                        path={route.path}
                        exact={route.exact}
                        render={props => (
                            <Guard>
                                <Layout>{route.routes ? renderRoutes(route.routes) : <Component {...props} />}</Layout>
                            </Guard>
                        )}
                    />
                );
            })}
        </Switch>
    </Suspense>
);

const routes: Routes = [
    // datatensor.io
    {
        exact: true,
        path: '/404',
        component: lazy(() => import('src/views/errors/NotFoundView'))
    },
    {
        layout: MainLayout,
        exact: true,
        path: '/',
        component: HomeView
    },

    // docs.datatensor.io
    {
        layout: DocsLayout,
        exact: true,
        path: '/getting-started',
        component: lazy(() => import('src/views/docs/GettingStartedView')),
        scope: 'docs'
    },
    {
        layout: DocsLayout,
        exact: true,
        path: '/about-datatensor',
        component: lazy(() => import('src/views/docs/AboutDatatensorView')),
        scope: 'docs'
    },
    {
        layout: DocsLayout,
        exact: true,
        path: '/create-a-dataset',
        component: lazy(() => import('src/views/docs/CreateDatasetView')),
        scope: 'docs'
    },
    {
        layout: DocsLayout,
        exact: true,
        path: '/upload-images',
        component: lazy(() => import('src/views/docs/UploadImagesView')),
        scope: 'docs'
    },
    {
        layout: DocsLayout,
        exact: true,
        path: '/datasets/labeling',
        component: lazy(() => import('src/views/docs/LabelingView')),
        scope: 'docs'
    },
    {
        layout: DocsLayout,
        exact: true,
        path: '/datasets/augmentation',
        component: lazy(() => import('src/views/docs/AugmentationView')),
        scope: 'docs'
    },
    {
        layout: DocsLayout,
        exact: true,
        path: '/datasets/export',
        component: lazy(() => import('src/views/docs/ExportView')),
        scope: 'docs'
    },
    {
        layout: DocsLayout,
        exact: true,
        path: '/computer-vision/using-an-exported-dataset',
        component: lazy(() => import('src/views/docs/UsingExportedDatasetView')),
        scope: 'docs'
    },
    {
        layout: DocsLayout,
        exact: true,
        path: '/computer-vision/api-documentation',
        component: lazy(() => import('src/views/docs/APIDocsView')),
        scope: 'docs'
    },
    {
        layout: DocsLayout,
        exact: true,
        path: '/contributing/project-architecture',
        component: lazy(() => import('src/views/docs/ProjectArchitectureView')),
        scope: 'docs'
    },
    {
        layout: DocsLayout,
        exact: true,
        path: '/contributing/running-locally',
        component: lazy(() => import('src/views/docs/RunningLocallyView')),
        scope: 'docs'
    },

    // app.datatensor.io
    {
        layout: MainLayout,
        exact: true,
        guard: GuestGuard,
        path: '/login',
        component: lazy(() => import('src/views/auth/LoginView')),
        scope: 'app'
    },
    {
        exact: true,
        guard: GuestGuard,
        path: '/forgot-password',
        component: lazy(() => import('src/views/auth/ForgotPasswordView')),
        scope: 'app'
    },
    {
        exact: true,
        guard: GuestGuard,
        path: '/reset-password',
        component: lazy(() => import('src/views/auth/ResetPasswordView')),
        scope: 'app'
    },
    {
        exact: true,
        guard: GuestGuard,
        path: '/oauthcallback/:scope',
        component: lazy(() => import('src/views/auth/OAuthCallbackView')),
        scope: 'app'
    },
    {
        exact: true,
        guard: GuestGuard,
        path: '/register',
        component: lazy(() => import('src/views/auth/RegisterView')),
        scope: 'app'
    },
    {
        exact: true,
        path: '/email-confirmation',
        component: lazy(() => import('src/views/auth/EmailConfirmationView')),
        scope: 'app'
    },

    {
        guard: AuthGuard,
        layout: DashboardLayout,
        exact: true,
        path: '/account',
        component: lazy(() => import('src/views/account/AccountView')),
        scope: 'app'
    },
    {
        guard: AuthGuard,
        layout: DashboardLayout,
        exact: true,
        path: '/users',
        component: lazy(() => import('src/views/user/UserListView')),
        scope: 'app'
    },
    {
        guard: AuthGuard,
        layout: DashboardLayout,
        exact: true,
        path: '/account',
        component: lazy(() => import('src/views/account/AccountView')),
        scope: 'app'
    },
    {
        guard: AuthGuard,
        layout: DashboardLayout,
        exact: true,
        path: '/users',
        component: lazy(() => import('src/views/user/UserListView')),
        scope: 'app'
    },
    {
        guard: AuthGuard,
        layout: DashboardLayout,
        exact: true,
        path: '/users/:user_id',
        component: lazy(() => import('src/views/user/UserDetailsView')),
        scope: 'app'
    },
    {
        guard: AuthGuard,
        layout: DashboardLayout,
        exact: true,
        path: '/datasets',
        component: lazy(() => import('src/views/dataset/DatasetBrowseView')),
        scope: 'app'
    },
    {
        guard: AuthGuard,
        layout: DashboardLayout,
        exact: true,
        path: '/datasets/create',
        component: lazy(() => import('src/views/dataset/DatasetCreateView')),
        scope: 'app'
    },
    {
        guard: AuthGuard,
        layout: DashboardLayout,
        exact: true,
        path: '/datasets/:dataset_id',
        component: lazy(() => import('src/views/dataset/DatasetMainView')),
        scope: 'app'
    },
    {
        guard: AuthGuard,
        layout: DashboardLayout,
        exact: true,
        path: '/admin/dashboard',
        component: lazy(() => import('src/views/reports/AdminDashboardView')),
        scope: 'app'
    },

    // 404
    {
        component: () => <Redirect to="/404" />
    }
];

export default routes;
