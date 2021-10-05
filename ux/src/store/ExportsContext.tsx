import React, {
    createContext,
    FC,
    ReactNode,
    useCallback,
    useEffect,
    useState
} from 'react';
import {Export} from 'src/types/export';
import api from 'src/utils/api';
import useDataset from 'src/hooks/useDataset';
import SplashScreen from 'src/components/screens/SplashScreen';

export interface ExportsContextValue {
    exports: Export[];
    saveExports: (update: Export[] | ((exports: Export[]) => Export[])) => void;
}

interface ExportsProviderProps {
    children?: ReactNode;
}

export const ExportsContext = createContext<ExportsContextValue>({
    exports: [],
    saveExports: () => {}
});

export const ExportsProvider: FC<ExportsProviderProps> = ({
    children
}) => {
    const [currentExports, setCurrentExports] = useState<Export[] | []>([]);

    const {dataset} = useDataset();

    const handleSaveExports = (
        update: Export[] | ((exports: Export[]) => Export[])
    ): void => {
        setCurrentExports(update);
    };

    const fetchExports = useCallback(async () => {
        try {
            const response = await api.get<{exports: Export[]}>(
                `/datasets/${dataset.id}/exports`
            );
            handleSaveExports(response.data.exports);
        } catch (err) {
            handleSaveExports([]);
            console.error(err);
        }

        // eslint-disable-next-line
    }, [dataset.id]);

    useEffect(() => {
        fetchExports();
    }, [fetchExports]);

    if (currentExports === null) return <SplashScreen />;

    return (
        <ExportsContext.Provider
            value={{
                exports: currentExports,
                saveExports: handleSaveExports
            }}
        >
            {children}
        </ExportsContext.Provider>
    );
};

export const ExportsConsumer = ExportsContext.Consumer;

export default ExportsContext;
