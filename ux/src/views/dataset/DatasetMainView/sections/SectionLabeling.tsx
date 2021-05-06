import React, {FC} from 'react';
import {Box} from '@material-ui/core';
import DTLabelisator from 'src/components/datatensor/Labelisator';
import {CategoryProvider} from 'src/contexts/CategoryContext';

const SectionLabeling: FC = () => {

    return (
        <>
            <CategoryProvider>
                <Box mt={3}>
                    <DTLabelisator/>
                </Box>
            </CategoryProvider>
        </>
    )
};

export default SectionLabeling;
