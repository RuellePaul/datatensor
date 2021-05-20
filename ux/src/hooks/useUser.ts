import {useContext} from 'react';
import UserContext, {UserContextValue} from 'src/store/UserContext';

const useUser = (): UserContextValue => useContext(UserContext);

export default useUser;
