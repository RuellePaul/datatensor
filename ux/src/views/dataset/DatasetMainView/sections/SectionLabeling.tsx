import React, {FC} from 'react';
import {Box} from '@material-ui/core';
import DTCategories from 'src/components/datatensor/Categories';
import DTLabelisator from 'src/components/datatensor/Labelisator';
import KeyboardShortcuts from 'src/components/overlays/KeyboardShortcuts';
import {CategoryProvider} from 'src/contexts/CategoryContext';

const SectionLabeling: FC = () => {

    return (
        <>
            <KeyboardShortcuts/>

            <CategoryProvider>
                <Box mt={3}>
                    <DTCategories/>
                </Box>

                <Box mt={3}>
                    <DTLabelisator/>
                </Box>
            </CategoryProvider>
        </>
    )
};

export default SectionLabeling;
