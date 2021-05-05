import React, {FC} from 'react';
import {Box} from '@material-ui/core';
import DTObjects from 'src/components/datatensor/Objects';
import DTLabelisator from 'src/components/datatensor/Labelisator';
import KeyboardShortcuts from 'src/components/overlays/KeyboardShortcuts';
import {Dataset} from 'src/types/dataset';


interface SectionLabelingProps {
    dataset: Dataset;
}

const SectionLabeling: FC<SectionLabelingProps> = ({dataset}) => {

    return (
        <>
            <KeyboardShortcuts/>

            <Box mt={3}>
                <DTObjects dataset={dataset}/>
            </Box>

            <Box mt={3}>
                <DTLabelisator dataset={dataset}/>
            </Box>
        </>
    )
};

export default SectionLabeling;
