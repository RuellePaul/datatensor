import React, {Fragment, lazy, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import HomeView from 'src/views/home/HomeView';
import LoadingScreen from 'src/components/LoadingScreen';
import AuthGuard from 'src/components/AuthGuard';
import GuestGuard from 'src/components/GuestGuard';

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
                path: '/app/admin/management/users',
                component: lazy(() => import('src/views/user/UserListView'))
            },
            {
                exact: true,
                path: '/app/admin/management/users/:userId',
                component: lazy(() => import('src/views/user/UserDetailsView'))
            },
            {
                exact: true,
                path: '/app/admin/management/users/:userId/edit',
                component: lazy(() => import('src/views/user/UserEditView'))
            },
            {
                exact: true,
                path: '/app/management/datasets',
                component: lazy(() => import('src/views/dataset/DatasetListView'))
            },
            {
                exact: true,
                path: '/app/management/datasets/create',
                component: lazy(() => import('src/views/dataset/DatasetCreateView'))
            },
            {
                exact: true,
                path: '/app/management',
                component: () => <Redirect to="/app/management/datasets"/>
            },
            {
                exact: true,
                path: '/app/reports/dashboard',
                component: lazy(() => import('src/views/reports/AdminDashboardView'))
            },
            {
                exact: true,
                path: '/app/admin/reports/dashboard',
                component: lazy(() => import('src/views/reports/DashboardView'))
            },
            {
                exact: true,
                path: '/app/reports',
                component: () => <Redirect to="/app/reports/dashboard"/>
            },
            {
                exact: true,
                path: '/app',
                component: () => <Redirect to="/app/reports/dashboard"/>
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
