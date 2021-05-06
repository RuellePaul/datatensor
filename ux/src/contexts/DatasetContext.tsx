import React, {createContext, FC, ReactNode, useCallback, useEffect, useState} from 'react';
import {Dataset} from 'src/types/dataset';
import api from 'src/utils/api';
import {Box, CircularProgress} from '@material-ui/core';

export interface DatasetContextValue {
    dataset: Dataset;
    saveDataset: (update: Dataset | ((dataset: Dataset) => Dataset)) => void;
}

interface DatasetProviderProps {
    dataset_id: string;
    children?: ReactNode;
}

export const DatasetContext = createContext<DatasetContextValue>({
    dataset: null,
    saveDataset: () => {
    }
});

export const DatasetProvider: FC<DatasetProviderProps> = ({dataset_id, children}) => {
    const [currentDataset, setCurrentDataset] = useState<Dataset>(null);

    const handleSaveDataset = (update: Dataset | ((dataset: Dataset) => Dataset)): void => {
        setCurrentDataset(update);
    };

    const fetchDataset = useCallback(async () => {
        try {
            const response = await api.get<Dataset>(`/v1/datasets/${dataset_id}`);
            handleSaveDataset(response.data);
        } catch (err) {
            console.error(err);
        }

    }, [dataset_id]);

    useEffect(() => {
        fetchDataset();
    }, [fetchDataset]);
;
    if (currentDataset === null)
        return (
            <Box
                display="flex"
                justifyContent="center"
            >
                <CircularProgress/>
            </Box>
        )

    return (
        <DatasetContext.Provider
            value={{
                dataset: currentDataset,
                saveDataset: handleSaveDataset
            }}
        >
            {children}
        </DatasetContext.Provider>
    )
};

export const DatasetConsumer = DatasetContext.Consumer;

export default DatasetContext;
