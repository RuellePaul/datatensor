import React, {FC, useContext, useState} from 'react';

export const UserContext = React.createContext({
    user: {
        id: undefined,
        name: undefined,
        avatar: undefined
    },
    setUser: (user: object) => {
        return;
    }
});


export const UserProvider: FC = ({children}) => {

    const setUser = (user: object) => {
        setState({...state, user: user});
        localStorage.setItem('DT_user', JSON.stringify(user));
    };

    const initState = {
        user: JSON.parse(localStorage.getItem('DT_user') as string) || {},
        setUser: setUser
    };

    const [state, setState] = useState(initState);

    return (
        <UserContext.Provider value={state}>
            {children}
        </UserContext.Provider>
    )
};

function useUser() {
    return useContext(UserContext);
}

export default useUser;