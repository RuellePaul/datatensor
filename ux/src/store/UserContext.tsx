import React, {createContext, FC, ReactNode, useCallback, useEffect, useState} from 'react';
import api from 'src/utils/api';
import {User} from 'src/types/user';

export interface UserContextValue {
    user: User;
    saveUser: (update: User | ((user: User) => User)) => void;
}

interface UserProviderProps {
    user_id?: string | null;
    children?: ReactNode;
    user?: User;
}

export const UserContext = createContext<UserContextValue>({
    user: null,
    saveUser: () => {}
});

export const UserProvider: FC<UserProviderProps> = ({user_id = null, user = null, children}) => {
    const [currentUser, setCurrentUser] = useState<User>(user);

    const handleSaveUser = (update: User | ((user: User) => User)): void => {
        setCurrentUser(update);
    };

    const fetchUser = useCallback(async () => {
        if (user_id) {
            try {
                const response = await api.get<{user: User}>(`/users/${user_id}`);
                handleSaveUser(response.data.user);
            } catch (err) {
                console.error(err);
            }
        }
    }, [user_id]);

    useEffect(() => {
        if (user === null)
            fetchUser();
    }, [fetchUser, user]);

    return (
        <UserContext.Provider
            value={{
                user: user || currentUser,
                saveUser: handleSaveUser
            }}
        >
            {currentUser !== null && children}
        </UserContext.Provider>
    );
};

export const UserConsumer = UserContext.Consumer;

export default UserContext;
