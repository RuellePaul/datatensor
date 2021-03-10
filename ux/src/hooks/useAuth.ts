import {useContext} from 'react';
import AuthContext from 'src/contexts/Auth0Context';

const useAuth = () => useContext(AuthContext);

export default useAuth;
