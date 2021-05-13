import {useContext} from 'react';
import ImageContext, {ImageContextValue} from 'src/contexts/ImageContext';

const useImage = (): ImageContextValue => useContext(ImageContext);

export default useImage;
