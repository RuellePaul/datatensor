import React, {createContext, FC, ReactNode, useEffect, useReducer} from 'react';
import jwtDecode from 'jwt-decode';
import {User} from 'src/types/user';
import SplashScreen from 'src/components/SplashScreen';
import api from 'src/utils/api';

interface AuthState {
    isInitialised: boolean;
    isAuthenticated: boolean;
    user: User | null;
}

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, name: string, password: string, recaptcha: string) => Promise<void>;
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
    };
};

type LogoutAction = {
    type: 'LOGOUT';
};

type RegisterAction = {
    type: 'REGISTER';
    payload: {
        user: User;
    };
};

type Action =
    | InitialiseAction
    | LoginAction
    | LogoutAction
    | RegisterAction;

const initialAuthState: AuthState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null
};

const isValidToken = (accessToken: string): boolean => {
    if (!accessToken) {
        return false;
    }

    const decoded: any = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
};

const setSession = (accessToken: string | null): void => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        localStorage.removeItem('accessToken');
        delete api.defaults.headers.common.Authorization;
    }
};

const reducer = (state: AuthState, action: Action): AuthState => {
    switch (action.type) {
        case 'INITIALISE': {
            const {isAuthenticated, user} = action.payload;

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user
            };
        }
        case 'LOGIN': {
            const {user} = action.payload;

            return {
                ...state,
                isAuthenticated: true,
                user
            };
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null
            };
        }
        case 'REGISTER': {
            const {user} = action.payload;

            return {
                ...state,
                isAuthenticated: true,
                user
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
    logout: () => {
    },
    register: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialAuthState);

    const login = async (email: string, password: string) => {
        const response = await api.post<{ accessToken: string; user: User }>('/api/v1/account/login/', {email, password});
        const {accessToken, user} = response.data;

        setSession(accessToken);
        dispatch({
            type: 'LOGIN',
            payload: {
                user
            }
        });
    };

    const logout = () => {
        setSession(null);
        dispatch({type: 'LOGOUT'});
    };

    const register = async (email: string, name: string, password: string, recaptcha: string) => {
        const response = await api.post<{ accessToken: string; user: User }>('/api/v1/account/register/', {
            email,
            name,
            password,
            recaptcha
        });
        const {accessToken, user} = response.data;

        window.localStorage.setItem('accessToken', accessToken);

        dispatch({
            type: 'REGISTER',
            payload: {
                user
            }
        });
    };

    useEffect(() => {
        const initialise = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');

                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken);

                    const response = await api.get<{ user: User; }>('/api/account/me');
                    const {user} = response.data;

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
        return <SplashScreen/>;
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
                register
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;