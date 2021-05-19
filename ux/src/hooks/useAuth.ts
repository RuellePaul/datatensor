import {useContext} from 'react';
import AuthContext from 'src/store/AuthContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;
