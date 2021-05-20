import {useContext} from 'react';
import ImagesContext, {ImagesContextValue} from 'src/store/ImagesContext';

const useImages = (): ImagesContextValue => useContext(ImagesContext);

export default useImages;
