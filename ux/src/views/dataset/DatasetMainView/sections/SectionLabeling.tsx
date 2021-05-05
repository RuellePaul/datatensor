import React, {FC} from 'react';
import {Box} from '@material-ui/core';
import DTObjects from 'src/components/datatensor/Objects';
import DTLabelisator from 'src/components/datatensor/Labelisator';
import KeyboardShortcuts from 'src/components/overlays/KeyboardShortcuts';


const SectionLabeling: FC = () => {

    return (
        <>
            <KeyboardShortcuts/>

            <Box mt={3}>
                <DTObjects/>
            </Box>

            <Box mt={3}>
                <DTLabelisator/>
            </Box>
        </>
    )
};

export default SectionLabeling;
