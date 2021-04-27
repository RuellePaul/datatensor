import React, {FC} from 'react';
import {Box} from '@material-ui/core';
import DTLabelisator from 'src/components/Labelisator';
import KeyboardShortcuts from 'src/components/overlays/KeyboardShortcuts';


const SectionLabeling: FC = () => {

    return (
        <>
            <KeyboardShortcuts/>

            <Box mt={3}>
                <DTLabelisator/>
            </Box>
        </>
    )
};

export default SectionLabeling;
