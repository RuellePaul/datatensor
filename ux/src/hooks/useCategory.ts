import {useContext} from 'react';
import CategoryContext, {CategoryContextValue} from 'src/store/CategoryContext';

const useCategory = (): CategoryContextValue => useContext(CategoryContext);

export default useCategory;
