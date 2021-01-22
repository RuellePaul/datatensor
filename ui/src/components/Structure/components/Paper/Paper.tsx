import React, {FC} from 'react';

import {Box, Container, Paper as MuiPaper, Typography} from '@material-ui/core';

interface PaperProps {
    title: string
}

const Paper: FC<PaperProps> = ({title, children}) => {

    return (
        <Box p='5rem 0'>
            <Container
                maxWidth='sm'
            >
                <Typography
                    variant='h3'
                    align='center'
                    color='textPrimary'
                >
                    {title}
                </Typography>

                <Box mt='1rem'>
                    <MuiPaper>
                        <Box padding='1rem'>
                            {children}
                        </Box>
                    </MuiPaper>
                </Box>
            </Container>
        </Box>
    )
};

export default Paper;