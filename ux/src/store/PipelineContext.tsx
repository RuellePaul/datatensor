import React, {createContext, FC, ReactNode, useState} from 'react';
import {Pipeline} from 'src/types/pipeline';

export interface PipelineContextValue {
    pipeline: Pipeline;
    savePipeline: (
        update: Pipeline | ((pipeline: Pipeline) => Pipeline)
    ) => void;
}

interface PipelineProviderProps {
    children?: ReactNode;
}

export const PipelineContext = createContext<PipelineContextValue>({
    pipeline: null,
    savePipeline: () => {}
});

export const PipelineProvider: FC<PipelineProviderProps> = ({children}) => {
    const [currentPipeline, setCurrentPipeline] = useState<Pipeline>(null);

    const handleSavePipeline = (
        update: Pipeline | ((pipeline: Pipeline) => Pipeline)
    ): void => {
        setCurrentPipeline(update);
    };

    return (
        <PipelineContext.Provider
            value={{
                pipeline: currentPipeline,
                savePipeline: handleSavePipeline
            }}
        >
            {children}
        </PipelineContext.Provider>
    );
};

export const PipelineConsumer = PipelineContext.Consumer;

export default PipelineContext;
