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

const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;

const routes: Routes = [
    {
        exact: true,
        path: '/404',
        component: lazy(() => import('src/views/errors/NotFoundView'))
    },
    {
        exact: true,
        guard: GuestGuard,
        path: '/login',
        component: lazy(() => import('src/views/auth/LoginView'))
    },
    {
        exact: true,
        guard: GuestGuard,
        path: '/forgot-password',
        component: lazy(() => import('src/views/auth/ForgotPasswordView'))
    },
    {
        exact: true,
        guard: GuestGuard,
        path: '/reset-password',
        component: lazy(() => import('src/views/auth/ResetPasswordView'))
    },
    {
        exact: true,
        guard: GuestGuard,
        path: '/oauthcallback/:scope',
        component: lazy(() => import('src/views/auth/OAuthCallbackView'))
    },
    {
        exact: true,
        guard: GuestGuard,
        path: '/register',
        component: lazy(() => import('src/views/auth/RegisterView'))
    },
    {
        exact: true,
        path: '/email-confirmation',
        component: lazy(() => import('src/views/auth/EmailConfirmationView'))
    },
    {
        path: '/app',
        guard: AuthGuard,
        layout: DashboardLayout,
        routes: [
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/account' : '/app/account',
                component: lazy(() => import('src/views/account/AccountView'))
            },
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/users' : '/app/users',
                component: lazy(() => import('src/views/user/UserListView'))
            },
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/users/:user_id' : '/app/users/:user_id',
                component: lazy(() => import('src/views/user/UserDetailsView'))
            },
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/datasets' : '/app/datasets',
                component: lazy(() => import('src/views/dataset/DatasetBrowseView'))
            },
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/datasets/create' : '/app/datasets/create',
                component: lazy(() => import('src/views/dataset/DatasetCreateView'))
            },
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/datasets/:dataset_id' : '/app/datasets/:dataset_id',
                component: lazy(() => import('src/views/dataset/DatasetMainView'))
            },
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/admin/dashboard' : '/app/admin/dashboard',
                component: lazy(() => import('src/views/reports/AdminDashboardView'))
            },
            {
                exact: true,
                path: '/app',
                component: () => <Redirect to="/app/datasets" />
            },
            {
                component: () => <Redirect to="/404" />
            }
        ]
    },
    {
        path: '/docs',
        layout: DocsLayout,
        routes: [
            {
                exact: true,
                path: '/docs',
                component: () => <Redirect to="/docs/getting-started" />
            },
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/getting-started' : '/docs/getting-started',
                component: lazy(() => import('src/views/docs/GettingStartedView'))
            },
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/about-datatensor' : '/docs/about-datatensor',
                component: lazy(() => import('src/views/docs/AboutDatatensorView'))
            },
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/datasets/create-a-dataset' : '/docs/datasets/create-a-dataset',
                component: lazy(() => import('src/views/docs/CreateDatasetView'))
            },
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/getting-started' : '/docs/datasets/upload-images',
                component: lazy(() => import('src/views/docs/UploadImagesView'))
            },
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/datasets/labeling' : '/docs/datasets/labeling',
                component: lazy(() => import('src/views/docs/LabelingView'))
            },
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/datasets/augmentation' : '/docs/datasets/augmentation',
                component: lazy(() => import('src/views/docs/AugmentationView'))
            },
            {
                exact: true,
                path: ENVIRONMENT === 'production' ? '/datasets/export' : '/docs/datasets/export',
                component: lazy(() => import('src/views/docs/ExportView'))
            },
            {
                exact: true,
                path:
                    ENVIRONMENT === 'production'
                        ? '/computer-vision/using-an-exported-dataset'
                        : '/docs/computer-vision/using-an-exported-dataset',
                component: lazy(() => import('src/views/docs/UsingExportedDatasetView'))
            },
            {
                exact: true,
                path:
                    ENVIRONMENT === 'production'
                        ? '/computer-vision/api-documentation'
                        : '/docs/computer-vision/api-documentation',
                component: lazy(() => import('src/views/docs/APIDocsView'))
            },
            {
                exact: true,
                path:
                    ENVIRONMENT === 'production'
                        ? '/contributing/project-architecture'
                        : '/docs/contributing/project-architecture',
                component: lazy(() => import('src/views/docs/ProjectArchitectureView'))
            },
            {
                exact: true,
                path:
                    ENVIRONMENT === 'production'
                        ? '/contributing/running-locally'
                        : '/docs/contributing/running-locally',
                component: lazy(() => import('src/views/docs/RunningLocallyView'))
            },
            {
                component: () => <Redirect to="/404" />
            }
        ]
    },
    {
        path: '*',
        layout: MainLayout,
        routes: [
            {
                exact: true,
                path: '/',
                component: HomeView
            },
            {
                component: () => <Redirect to="/404" />
            }
        ]
    }
];

export default routes;
