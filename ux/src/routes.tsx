import React, {Fragment, lazy, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import DocsLayout from 'src/layouts/DocsLayout';
import HomeView from 'src/views/home/HomeView';
import AuthGuard from 'src/components/guards/AuthGuard';
import GuestGuard from 'src/components/guards/GuestGuard';
import SplashScreen from 'src/components/screens/SplashScreen';
import TermsView from './views/legal/Terms';
import PrivacyView from './views/legal/Privacy';

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
    <Suspense fallback={<SplashScreen />}>
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
    {
        layout: MainLayout,
        exact: true,
        path: '/terms',
        component: TermsView
    },
    {
        layout: MainLayout,
        exact: true,
        path: '/privacy',
        component: PrivacyView
    },
    {
        path: '/auth',
        layout: MainLayout,
        routes: [
            {
                exact: true,
                guard: GuestGuard,
                path: '/auth/login',
                component: lazy(() => import('src/views/auth/LoginView'))
            },
            {
                exact: true,
                guard: GuestGuard,
                path: '/auth/forgot-password',
                component: lazy(() => import('src/views/auth/ForgotPasswordView'))
            },
            {
                exact: true,
                guard: GuestGuard,
                path: '/auth/reset-password',
                component: lazy(() => import('src/views/auth/ResetPasswordView'))
            },
            {
                exact: true,
                guard: GuestGuard,
                path: '/auth/callback/:scope',
                component: lazy(() => import('src/views/auth/OAuthCallbackView'))
            },
            {
                exact: true,
                guard: GuestGuard,
                path: '/auth/register',
                component: lazy(() => import('src/views/auth/RegisterView'))
            },
            {
                exact: true,
                path: '/auth/email-confirmation',
                component: lazy(() => import('src/views/auth/EmailConfirmationView'))
            }
        ]
    },
    {
        path: '/docs',
        layout: DocsLayout,
        routes: [
            {
                exact: true,
                path: '/docs/getting-started',
                component: lazy(() => import('src/views/docs/GettingStartedView'))
            },
            {
                exact: true,
                path: '/docs/about-datatensor',
                component: lazy(() => import('src/views/docs/AboutDatatensorView'))
            },
            {
                exact: true,
                path: '/docs/create-a-dataset',
                component: lazy(() => import('src/views/docs/CreateDatasetView'))
            },
            {
                exact: true,
                path: '/docs/upload-images',
                component: lazy(() => import('src/views/docs/UploadImagesView'))
            },
            {
                exact: true,
                path: '/docs/datasets/labeling',
                component: lazy(() => import('src/views/docs/LabelingView'))
            },
            {
                exact: true,
                path: '/docs/datasets/augmentation',
                component: lazy(() => import('src/views/docs/AugmentationView'))
            },
            {
                exact: true,
                path: '/docs/datasets/export',
                component: lazy(() => import('src/views/docs/ExportView'))
            },
            {
                exact: true,
                path: '/docs/computer-vision/using-an-exported-dataset',
                component: lazy(() => import('src/views/docs/UsingExportedDatasetView'))
            },
            {
                exact: true,
                path: '/docs/computer-vision/api-documentation',
                component: lazy(() => import('src/views/docs/APIDocsView'))
            },
            {
                exact: true,
                path: '/docs/contributing/project-architecture',
                component: lazy(() => import('src/views/docs/ProjectArchitectureView'))
            },
            {
                exact: true,
                path: '/docs/contributing/running-locally',
                component: lazy(() => import('src/views/docs/RunningLocallyView'))
            }
        ]
    },
    {
        path: '/app',
        guard: AuthGuard,
        layout: DashboardLayout,
        routes: [
            {
                exact: true,
                path: '/app/account',
                component: lazy(() => import('src/views/account/AccountView'))
            },
            {
                exact: true,
                path: '/app/users',
                component: lazy(() => import('src/views/user/UserListView'))
            },
            {
                exact: true,
                path: '/app/account',
                component: lazy(() => import('src/views/account/AccountView'))
            },
            {
                exact: true,
                path: '/app/users',
                component: lazy(() => import('src/views/user/UserListView'))
            },
            {
                exact: true,
                path: '/app/users/:user_id',
                component: lazy(() => import('src/views/user/UserDetailsView'))
            },
            {
                exact: true,
                path: '/app/datasets',
                component: lazy(() => import('src/views/dataset/DatasetBrowseView'))
            },
            {
                exact: true,
                path: '/app/datasets/create',
                component: lazy(() => import('src/views/dataset/DatasetCreateView'))
            },
            {
                exact: true,
                path: '/app/datasets/:dataset_id',
                component: lazy(() => import('src/views/dataset/DatasetMainView'))
            },
            {
                exact: true,
                path: '/app/admin/dashboard',
                component: lazy(() => import('src/views/reports/AdminDashboardView'))
            }
        ]
    },
    
    // Redirect rules
    {
        component: () => <Redirect from="/app" to="/app/datasets" />
    },
    {
        component: () =><Redirect from="/docs" to="/docs/getting-started" />
    },
    {
        component: () => <Redirect from="/auth" to="/auth/login" />
    },

    // 404
    {
        component: () => <Redirect to="/404" />
    }
];

export default routes;
