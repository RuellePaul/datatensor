import {useContext} from 'react';
import CategoryContext, {CategoryContextValue} from 'src/contexts/CategoryContext';

const useCategory = (): CategoryContextValue => useContext(CategoryContext);

export default useCategory;
