import React, {FC} from 'react';
import {Box} from '@material-ui/core';
import DTLabelisator from 'src/components/Labelisator';


const SectionLabeling: FC = () => {

    return (
        <>
            <Box mt={3}>
                <DTLabelisator/>
            </Box>
        </>
    )
};

export default SectionLabeling;
