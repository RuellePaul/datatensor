import React, {createContext, FC, ReactNode, useCallback, useEffect, useState} from 'react';
import {Dataset} from 'src/types/dataset';
import api from 'src/utils/api';

export interface DatasetsContextValue {
    datasets: Dataset[];
    saveDatasets: (update: Dataset[] | ((datasets: Dataset[]) => Dataset[])) => void;
}

interface DatasetsProviderProps {
    children?: ReactNode;
}

export const DatasetsContext = createContext<DatasetsContextValue>({
    datasets: [],
    saveDatasets: () => {
    }
});

export const DatasetsProvider: FC<DatasetsProviderProps> = ({children}) => {
    const [currentDatasets, setCurrentDatasets] = useState<Dataset[]>([]);

    const handleSaveDatasets = (update: Dataset[] | ((datasets: Dataset[]) => Dataset[])): void => {
        setCurrentDatasets(update);
    };

    const fetchDatasets = useCallback(async () => {
        try {
            const response = await api.get<{ datasets: Dataset[] }>(`/datasets/`);
            handleSaveDatasets(response.data.datasets);
        } catch (err) {
            console.error(err);
        }

    }, []);

    useEffect(() => {
        fetchDatasets();
    }, [fetchDatasets]);


    return (
        <DatasetsContext.Provider
            value={{
                datasets: currentDatasets,
                saveDatasets: handleSaveDatasets
            }}
        >
            {children}
        </DatasetsContext.Provider>
    )
};

export const DatasetsConsumer = DatasetsContext.Consumer;

export default DatasetsContext;
