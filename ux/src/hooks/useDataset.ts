import {useContext} from 'react';
import DatasetContext, {DatasetContextValue} from 'src/store/DatasetContext';

const useDataset = (): DatasetContextValue => useContext(DatasetContext);

export default useDataset;
