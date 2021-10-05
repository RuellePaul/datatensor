import {useContext} from 'react';
import ExportsContext, {ExportsContextValue} from 'src/store/ExportsContext';

const useExports = (): ExportsContextValue => useContext(ExportsContext);

export default useExports;
