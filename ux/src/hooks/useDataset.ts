import {useContext} from 'react';
import DatasetContext, {DatasetContextValue} from 'src/contexts/DatasetContext';

const useDataset = (): DatasetContextValue => useContext(DatasetContext);

export default useDataset;
