import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Typography
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import api from 'src/utils/api';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    loader: {
        width: '20px !important',
        height: '20px !important'
    }
}));

interface ExportProps {
    className?: string;
}

const Export: FC<ExportProps> = ({className}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset} = useDataset();

    const [isExporting, setIsExporting] = useState<boolean>(false);

    const handleExport = async () => {
        try {
            const response = await api.post(`/datasets/${dataset.id}/export/`);
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Card className={clsx(classes.root, className)} variant="outlined">
            <CardContent>
                <Typography color="textPrimary" gutterBottom>
                    Export your dataset to .json
                </Typography>
            </CardContent>
            <CardActions style={{justifyContent: 'flex-end'}}>
                <Button
                    color="primary"
                    disabled={isExporting}
                    endIcon={
                        isExporting && (
                            <CircularProgress
                                className={classes.loader}
                                color="inherit"
                            />
                        )
                    }
                    onClick={handleExport}
                    variant="contained"
                >
                    Export
                </Button>
            </CardActions>
        </Card>
    );
};

export default Export;
