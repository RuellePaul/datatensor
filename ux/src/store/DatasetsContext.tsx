import React, {createContext, FC, ReactNode, useCallback, useEffect, useState} from 'react';
import {Dataset} from 'src/types/dataset';
import api from 'src/utils/api';


export interface DatasetsContextValue {
    datasets: Dataset[];
    saveDatasets: (update: Dataset[] | ((datasets: Dataset[]) => Dataset[])) => void;
    displayedDatasets: Dataset[] | null;
    saveDisplayedDatasets: (update: Dataset[] | ((datasets: Dataset[]) => Dataset[])) => void;
}

interface DatasetsProviderProps {
    children?: ReactNode;
}

export const DatasetsContext = createContext<DatasetsContextValue>({
    datasets: [],
    saveDatasets: () => {
    },
    displayedDatasets: null,
    saveDisplayedDatasets: () => {
    }
});

export const DatasetsProvider: FC<DatasetsProviderProps> = ({ children }) => {
    const [currentDatasets, setCurrentDatasets] = useState<Dataset[]>([]);
    const [displayedDatasets, setDisplayedDatasets] = useState<Dataset[] | null>(null);

    const handleSaveDatasets = (update: Dataset[] | ((datasets: Dataset[]) => Dataset[])): void => {
        setCurrentDatasets(update);
    };

    const handleSaveDisplayedDatasets = (update: Dataset[] | ((datasets: Dataset[]) => Dataset[])): void => {
        setDisplayedDatasets(update);
    };

    const fetchDatasets = useCallback(async () => {
        try {
            const response = await api.get<{ datasets: Dataset[] }>(`/datasets/`, {
                params: {
                    'include_user': true,
                    'include_categories': true
                }
            });
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
                saveDatasets: handleSaveDatasets,
                displayedDatasets: displayedDatasets || currentDatasets,
                saveDisplayedDatasets: handleSaveDisplayedDatasets
            }}
        >
            {children}
        </DatasetsContext.Provider>
    );
};

export const DatasetsConsumer = DatasetsContext.Consumer;

export default DatasetsContext;
