import {useContext} from 'react';
import PipelineContext, {PipelineContextValue} from 'src/store/PipelineContext';

const usePipeline = (): PipelineContextValue => useContext(PipelineContext);

export default usePipeline;
