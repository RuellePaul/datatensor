import React, {createContext, FC, ReactNode, useCallback, useEffect, useState} from 'react';
import {Category} from 'src/types/category';
import {Dataset} from 'src/types/dataset';
import api from 'src/utils/api';
import {Pipeline} from 'src/types/pipeline';
import NProgress from 'nprogress';

export interface DatasetContextValue {
    dataset: Dataset;
    saveDataset: (update: Dataset | ((dataset: Dataset) => Dataset)) => void;
    categories: Category[];
    saveCategories: (update: Category[] | ((update: Category[]) => Category[])) => void;
    pipelines: Pipeline[];
    savePipelines: (update: Pipeline[] | ((update: Pipeline[]) => Pipeline[])) => void;
}

interface DatasetProviderProps {
    dataset_id?: string;
    children?: ReactNode;
    dataset?: Dataset; // for public data
    categories?: Category[]; // for public data
}

export const DatasetContext = createContext<DatasetContextValue>({
    dataset: null,
    saveDataset: () => {},
    categories: [],
    saveCategories: () => {},
    pipelines: [],
    savePipelines: () => {}
});

export const DatasetProvider: FC<DatasetProviderProps> = ({dataset_id, dataset = null, categories = [], children}) => {
    const [currentDataset, setCurrentDataset] = useState<Dataset>(dataset);
    const [currentCategories, setCurrentCategories] = useState<Category[]>(categories);
    const [currentPipelines, setCurrentPipelines] = useState<Pipeline[]>([]);

    const handleSaveDataset = (update: Dataset | ((dataset: Dataset) => Dataset)): void => {
        setCurrentDataset(update);
    };

    const handleSaveCategories = (update: Category[] | ((update: Category[]) => Category[])): void => {
        setCurrentCategories(update);
    };

    const fetchDataset = useCallback(async () => {
        try {
            const response = await api.get<{dataset: Dataset}>(`/datasets/${dataset_id}`, {
                params: {
                    include_user: true,
                    include_categories: true
                }
            });
            handleSaveDataset(response.data.dataset);
            handleSaveCategories(response.data.dataset.categories);
        } catch (err) {
            console.error(err);
        }
    }, [dataset_id]);

    const handleSavePipelines = (update: Pipeline[] | ((update: Pipeline[]) => Pipeline[])): void => {
        setCurrentPipelines(update);
    };

    const fetchPipelines = useCallback(async () => {
        try {
            const response = await api.get<{pipelines: Pipeline[]}>(`/datasets/${dataset_id}/pipelines/`);
            handleSavePipelines(response.data.pipelines);
        } catch (err) {
            console.error(err);
        }
    }, [dataset_id]);

    useEffect(() => {
        if (dataset === null) {
            fetchDataset();
            fetchPipelines();
        }
    }, [fetchDataset, fetchPipelines, dataset]);

    useEffect(() => {
        if (currentDataset === null)
            NProgress.start();
        else
            NProgress.done();

        return () => {
            NProgress.done();
        };
    }, [currentDataset])

    if (currentDataset === null)
        return null;

    return (
        <DatasetContext.Provider
            value={{
                dataset: dataset || currentDataset,
                saveDataset: handleSaveDataset,
                categories: currentCategories,
                saveCategories: handleSaveCategories,
                pipelines: currentPipelines,
                savePipelines: handleSavePipelines
            }}
        >
            {children}
        </DatasetContext.Provider>
    );
};

export const DatasetConsumer = DatasetContext.Consumer;

export default DatasetContext;
