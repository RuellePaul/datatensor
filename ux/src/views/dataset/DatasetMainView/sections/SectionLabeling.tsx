import React, {FC} from 'react';
import {Box} from '@material-ui/core';
import DTCategories from 'src/components/datatensor/Categories';
import DTLabelisator from 'src/components/datatensor/Labelisator';
import KeyboardShortcuts from 'src/components/overlays/KeyboardShortcuts';


const SectionLabeling: FC = () => {

    return (
        <>
            <KeyboardShortcuts/>

            <Box mt={3}>
                <DTCategories/>
            </Box>

            <Box mt={3}>
                <DTLabelisator/>
            </Box>
        </>
    )
};

export default SectionLabeling;
