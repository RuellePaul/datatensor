import React, {createContext, FC, ReactNode, useEffect, useReducer, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import GoogleOneTapLogin from 'react-google-one-tap-login';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import {useSnackbar} from 'notistack';
import {User} from 'src/types/user';
import SplashScreen from 'src/components/screens/SplashScreen';
import {PUBLIC_PATHS} from 'src/components/utils/LocationReset';
import api from 'src/utils/api';

interface AuthState {
    isInitialised: boolean;
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
}

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    loginOAuth: (code: string, scope: string) => Promise<void>;
    loginGoogleOneTap: (googleAccessToken: string) => Promise<void>;
    logout: () => void;
    register: (email: string, name: string, password: string, recaptcha: string) => Promise<void>;
    confirmEmail: (activation_code: string) => Promise<void>;
    sendPasswordRecoveryLink: (email: string, recaptcha: string) => Promise<void>;
    resetPassword: (email: string, recaptcha: string) => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

type InitialiseAction = {
    type: 'INITIALISE';
    payload: {
        isAuthenticated: boolean;
        user: User | null;
    };
};

type LoginAction = {
    type: 'LOGIN';
    payload: {
        user: User;
        accessToken: string;
    };
};

type LogoutAction = {
    type: 'LOGOUT';
};

type RegisterAction = {
    type: 'REGISTER';
    payload: {
        user: User;
        accessToken: string;
    };
};

type Action = InitialiseAction | LoginAction | LogoutAction | RegisterAction;

const initialAuthState: AuthState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
    accessToken: null
};

const isValidToken = (accessToken: string): boolean => {
    if (!accessToken) {
        return false;
    }

    const decoded: any = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
};

const reducer = (state: AuthState, action: Action): AuthState => {
    switch (action.type) {
        case 'INITIALISE': {
            const {isAuthenticated, user} = action.payload;

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
                accessToken: Cookies.get('access_token') || null
            };
        }
        case 'LOGIN': {
            const {user, accessToken} = action.payload;

            return {
                ...state,
                isAuthenticated: true,
                user,
                accessToken
            };
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                accessToken: null
            };
        }
        case 'REGISTER': {
            const {user, accessToken} = action.payload;

            return {
                ...state,
                isAuthenticated: true,
                user,
                accessToken
            };
        }
        default: {
            return {...state};
        }
    }
};

const AuthContext = createContext<AuthContextValue>({
    ...initialAuthState,
    login: () => Promise.resolve(),
    loginOAuth: () => Promise.resolve(),
    loginGoogleOneTap: () => Promise.resolve(),
    logout: () => {},
    register: () => Promise.resolve(),
    confirmEmail: () => Promise.resolve(),
    sendPasswordRecoveryLink: () => Promise.resolve(),
    resetPassword: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = ({children}) => {
    const history = useHistory();
    const [state, dispatch] = useReducer(reducer, initialAuthState);
    const {enqueueSnackbar} = useSnackbar();

    const location = useLocation();

    const login = async (email: string, password: string) => {
        const response = await api.post<{accessToken: string; user: User}>('/auth/login', {email, password});
        const {accessToken, user} = response.data;

        dispatch({
            type: 'LOGIN',
            payload: {
                user,
                accessToken
            }
        });
    };

    const loginOAuth = async (code: string, scope: string) => {
        const response = await api.post<{accessToken: string; user: User}>(`/oauth/callback`, {code, scope});
        const {accessToken, user} = response.data;

        dispatch({
            type: 'LOGIN',
            payload: {
                user,
                accessToken
            }
        });
    };

    const [isDoingOneTap, setIsDoingOneTap] = useState<boolean>(false);

    const loginGoogleOneTap = async (googleAccessToken: string) => {
        setIsDoingOneTap(true);
        const response = await api.post<{accessToken: string; user: User}>(`/oauth/google-one-tap`, {
            google_access_token: googleAccessToken
        });
        const {accessToken, user} = response.data;

        dispatch({
            type: 'LOGIN',
            payload: {
                user,
                accessToken
            }
        });
        history.push('/datasets');
        setIsDoingOneTap(false);
    };

    const logout = () => {
        dispatch({type: 'LOGOUT'});
    };

    const register = async (email: string, name: string, password: string, recaptcha: string) => {
        const response = await api.post<{accessToken: string; user: User}>('/auth/register', {
            email,
            name,
            password,
            recaptcha
        });
        const {accessToken, user} = response.data;

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
                accessToken
            }
        });
    };

    const confirmEmail = async (activation_code: string) => {
        try {
            const response = await api.post<{accessToken: string; user: User}>('/auth/email-confirmation', {
                activation_code
            });

            const {accessToken, user} = response.data;

            dispatch({
                type: 'LOGIN',
                payload: {
                    user,
                    accessToken
                }
            });

            history.push('/datasets');
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });

            history.push('/');
        }
    };

    const sendPasswordRecoveryLink = async (email: string, recaptcha: string) => {
        try {
            await api.post('/auth/send-password-recovery-link', {email, recaptcha});
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        }
    };

    const resetPassword = async (new_password: string, recovery_code: string) => {
        try {
            await api.post('/auth/reset-password', {new_password, recovery_code});
            enqueueSnackbar('Password reset', {variant: 'info'});
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        }
    };

    useEffect(() => {
        const initialise = async () => {
            try {
                const accessToken = Cookies.get('access_token');

                if (accessToken && isValidToken(accessToken)) {
                    const response = await api.get<User>('/auth/me');
                    const user = response.data;

                    dispatch({
                        type: 'INITIALISE',
                        payload: {
                            isAuthenticated: true,
                            user
                        }
                    });
                } else {
                    dispatch({
                        type: 'INITIALISE',
                        payload: {
                            isAuthenticated: false,
                            user: null
                        }
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: 'INITIALISE',
                    payload: {
                        isAuthenticated: false,
                        user: null
                    }
                });
            }
        };

        initialise();
    }, []);

    if (!state.isInitialised) {
        return <SplashScreen />;
    }

    if (isDoingOneTap) {
        return <SplashScreen />;
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                loginOAuth,
                loginGoogleOneTap,
                logout,
                register,
                confirmEmail,
                sendPasswordRecoveryLink,
                resetPassword
            }}
        >
            {children}

            {PUBLIC_PATHS.includes(location.pathname) && (
                <GoogleOneTapLogin
                    googleAccountConfigs={{
                        client_id: process.env.REACT_APP_OAUTH_GOOGLE_CLIENT_ID,
                        context: 'use',
                        cancel_on_tap_outside: false,
                        callback: async data => {
                            const googleAccessToken = data.credential;
                            await loginGoogleOneTap(googleAccessToken);
                        }
                    }}
                    disabled={state.isAuthenticated}
                    disableCancelOnUnmount
                    onError={error => console.error(error)}
                />
            )}
        </AuthContext.Provider>
    );
};

export default AuthContext;
