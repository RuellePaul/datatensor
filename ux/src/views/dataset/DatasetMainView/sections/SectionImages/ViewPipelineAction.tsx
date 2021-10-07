import React, {FC, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Button, Dialog, DialogContent, DialogTitle, IconButton, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Close as CloseIcon, VisibilityOutlined as ViewIcon} from '@mui/icons-material';
import {Theme} from 'src/theme';
import Pipeline from 'src/components/core/Pipeline';
import {setDefaultPipeline, setPipeline} from 'src/slices/pipeline';
import useDataset from 'src/hooks/useDataset';

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        marginRight: theme.spacing(1)
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

interface ViewPipelineActionProps {
    pipeline_id: string;
}

const ViewPipelineAction: FC<ViewPipelineActionProps> = ({pipeline_id}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const {pipelines} = useDataset();

    const [openPipeline, setOpenPipeline] = useState(false);

    const handlePipelineOpen = () => {
        if (!pipeline_id) return;

        dispatch(setPipeline(pipelines.find(pipeline => pipeline.id === pipeline_id)));
        setOpenPipeline(true);
    };

    const handlePipelineClose = () => {
        setOpenPipeline(false);
        dispatch(setDefaultPipeline());
    };

    if (!pipeline_id) return null;

    return (
        <>
            <Button
                className={classes.button}
                endIcon={<ViewIcon />}
                size="small"
                onClick={handlePipelineOpen}
                variant="outlined"
            >
                Operations pipeline
            </Button>

            <Dialog disableRestoreFocus fullWidth maxWidth="xs" open={openPipeline} onClose={handlePipelineClose}>
                <DialogTitle className="flex">
                    <Typography variant="h4">Operations pipeline</Typography>

                    <IconButton className={classes.close} onClick={handlePipelineClose} size="large">
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Pipeline readOnly />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ViewPipelineAction;
