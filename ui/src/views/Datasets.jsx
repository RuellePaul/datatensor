import React from 'react';
import {useParams} from 'react-router-dom';

import {Typography} from '@material-ui/core';


function Datasets() {

    const {dataset_id} = useParams();

    return (
        <Typography
            variant='body2'
        >
             Page for dataset {dataset_id}
        </Typography>
    );
}

export default Datasets;