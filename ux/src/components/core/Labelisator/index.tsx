import React, {FC, forwardRef, useCallback, useEffect, useState} from 'react';
import {AppBar, Button, Dialog, IconButton, makeStyles, Slide, Toolbar} from '@material-ui/core';
import {TransitionProps} from '@material-ui/core/transitions';
import {Close as CloseIcon} from '@material-ui/icons';
import DTImage from 'src/components/core/Images/Image';
import ToolLabel from './ToolLabel';
import ToolMove from './ToolMove';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import {Image} from 'src/types/image';
import api from 'src/utils/api';
import {ImageProvider} from 'src/store/ImageContext';

interface DTLabelisatorProps {
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    header: {
        position: 'relative'
    },
    toolbar: {
        justifyContent: 'space-between'
    }
}));

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction='up' ref={ref} {...props} />;
});


const DTLabelisator: FC<DTLabelisatorProps> = () => {
    const classes = useStyles();

    const {dataset} = useDataset();
    const [autoSwitch, setAutoSwitch] = useState<boolean>(true);
    const [tool, setTool] = useState<'label' | 'move'>('label');

    const index = window.location.hash.split('#')[1];

    const [image, setImage] = useState<Image>(null);

    const fetchImage = useCallback(async () => {
        try {
            const response = await api.get<{ images: Image[] }>(`/datasets/${dataset.id}/images/`, {
                params: {
                    offset: index,
                    limit: 1
                }
            });
            setImage(response.data.images[0]);
        } catch (err) {
            console.error(err);
        }

    }, [dataset.id, index]);

    useEffect(() => {
        fetchImage()
    }, [fetchImage]);

    const handleClose = () => {
        window.location.hash = '';
    }

    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        const onHashChange = () => setOpen(window.location.hash.length > 0);
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);

        // eslint-disable-next-line
    }, []);

    if (!image)
        return null;

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar
                className={classes.header}
                color='transparent'
            >
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge='start'
                        color='inherit'
                        onClick={handleClose}
                    >
                        <CloseIcon/>
                    </IconButton>

                    <Button color='inherit' onClick={handleClose}>
                        Save
                    </Button>
                </Toolbar>
            </AppBar>
            {tool === 'label' && (
                <ToolLabel
                    setTool={setTool}
                    autoSwitch={autoSwitch}
                />
            )}
            {tool === 'move' && (
                <ToolMove
                    setTool={setTool}
                    autoSwitch={autoSwitch}
                />
            )}
            <ImageProvider image={image}>
                <DTImage skeleton/>
            </ImageProvider>
        </Dialog>
    );
};

export default DTLabelisator;
