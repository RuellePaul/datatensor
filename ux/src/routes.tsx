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
    <Suspense fallback={<LoadingScreen/>}>
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
                        render={(props) => (
                            <Guard>
                                <Layout>
                                    {route.routes
                                        ? renderRoutes(route.routes)
                                        : <Component {...props} />}
                                </Layout>
                            </Guard>
                        )}
                    />
                );
            })}
        </Switch>
    </Suspense>
);

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
                path: '/app/account',
                component: lazy(() => import('src/views/account/AccountView'))
            },
            {
                exact: true,
                path: '/app/admin/users',
                component: lazy(() => import('src/views/user/UserListView'))
            },
            {
                exact: true,
                path: '/app/admin/users/:user_id/details',
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
                path: '/app/dashboard',
                component: lazy(() => import('src/views/reports/DashboardView'))
            },
            {
                exact: true,
                path: '/app/admin/dashboard',
                component: lazy(() => import('src/views/reports/AdminDashboardView'))
            },
            {
                exact: true,
                path: '/app',
                component: () => <Redirect to="/app/dashboard"/>
            },
            {
                component: () => <Redirect to="/404"/>
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
                component: () => <Redirect to="/docs/getting-started"/>
            },
            {
                exact: true,
                path: '/docs/getting-started',
                component: lazy(() => import('src/views/docs/GettingStartedView'))
            },
            {
                component: () => <Redirect to="/404"/>
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
                exact: true,
                path: '/pricing',
                component: lazy(() => import('src/views/pricing/PricingView'))
            },
            {
                component: () => <Redirect to="/404"/>
            }
        ]
    }
];

export default routes;
