import React, {FC} from 'react';
import clsx from 'clsx';
import {Divider, Grid, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import {SectionProps} from '../SectionProps';
import ChangePrivacyAction from './ChangePrivacyAction';
import DeleteDatasetAction from './DeleteDatasetAction';


const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

const SectionSettings: FC<SectionProps> = ({ className }) => {
    const classes = useStyles();

    return (
        <Grid className={clsx(classes.root, className)} container spacing={2}>
            <Grid item xs={12}>
                <Divider sx={{ mt: 6 }}>
                    <Typography variant="overline" color="textPrimary">
                        Settings
                    </Typography>
                </Divider>
            </Grid>
            <Grid item sm={6} xs={12}>
                <ChangePrivacyAction />
            </Grid>

            <Grid item sm={6} xs={12}>
                <DeleteDatasetAction />
            </Grid>
        </Grid>
    );
};

export default SectionSettings;
