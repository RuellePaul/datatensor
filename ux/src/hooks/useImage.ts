import {useContext} from 'react';
import ImageContext, {ImageContextValue} from 'src/store/ImageContext';

const useImage = (): ImageContextValue => useContext(ImageContext);

export default useImage;
