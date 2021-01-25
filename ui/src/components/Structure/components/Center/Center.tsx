import React, {FC} from 'react';

import {Box, Container, Typography} from '@material-ui/core';

interface PaperProps {
    title: string
}

const Center: FC<PaperProps> = ({title, children}) => {

    return (
        <Container
            maxWidth='sm'
        >
            <Box padding='4rem 2rem'>
                <Typography
                    variant='h3'
                    align='center'
                    color='textPrimary'
                >
                    {title}
                </Typography>

                <Box padding='1rem 0'>
                    {children}
                </Box>
            </Box>
        </Container>
    )
};

export default Center;