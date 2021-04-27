import {useContext} from 'react';
import DatasetsContext, {DatasetsContextValue} from 'src/contexts/DatasetsContext';

const useDatasets = (): DatasetsContextValue => useContext(DatasetsContext);

export default useDatasets;
