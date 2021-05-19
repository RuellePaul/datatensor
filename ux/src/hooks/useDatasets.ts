import {useContext} from 'react';
import DatasetsContext, {DatasetsContextValue} from 'src/store/DatasetsContext';

const useDatasets = (): DatasetsContextValue => useContext(DatasetsContext);

export default useDatasets;
