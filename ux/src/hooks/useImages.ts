import {useContext} from 'react';
import ImagesContext, {ImagesContextValue} from 'src/contexts/ImagesContext';

const useImages = (): ImagesContextValue => useContext(ImagesContext);

export default useImages;
