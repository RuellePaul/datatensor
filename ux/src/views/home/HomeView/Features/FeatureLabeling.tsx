import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {Box, ButtonBase, Button, Hidden, Typography, useMediaQuery} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import {DatasetProvider} from 'src/store/DatasetContext';
import {PUBLIC_DATASET_ID} from 'src/constants';
import DTImage from 'src/components/core/Images/Image';
import ToolLabel from 'src/components/core/Labelisator/ToolLabel';
import ToolMove from 'src/components/core/Labelisator/ToolMove';
import {ImageProvider} from 'src/store/ImageContext';
import {CANVAS_OFFSET} from 'src/utils/labeling';
import {ImagesConsumer, ImagesProvider} from 'src/store/ImagesContext';
import {MouseOutlined as MouseIcon} from '@mui/icons-material';
import KeyboardListener from '../../../../components/core/Labelisator/KeyboardListener';

interface FeaturesProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    labelisator: {
        position: 'relative',
        margin: `${CANVAS_OFFSET}px 0px`,
        [theme.breakpoints.down('sm')]: {
            marginLeft: -10,
            marginRight: -10,
            marginBottom: -10
        }
    },
    overlay: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.65)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: theme.spacing(2, 3),
        backdropFilter: 'blur(3px)'
    }
}));

const FeatureLabeling: FC<FeaturesProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const [tool, setTool] = useState<'label' | 'move'>('label');

    const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

    const autoSwitch = isDesktop;

    const [openOverlay, setOpenOverlay] = useState<boolean>(true);
    const handleCloseOverlay = () => {
        setOpenOverlay(false);
    };

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <DatasetProvider dataset_id={PUBLIC_DATASET_ID}>
                <ImagesProvider>
                    <ImagesConsumer>
                        {value =>
                            value.images &&
                            value.images.length > 0 && (
                                <ImageProvider image={value.images[0]}>
                                    <div className={classes.labelisator}>
                                        <div className={clsx(tool !== 'label' && 'hidden')}>
                                            <ToolLabel setTool={setTool} autoSwitch={autoSwitch} />
                                        </div>
                                        <div className={clsx(tool !== 'move' && 'hidden')}>
                                            <ToolMove setTool={setTool} autoSwitch={autoSwitch} />
                                        </div>
                                        <KeyboardListener index={0} imageIds={value.images.map(image => image.id)} setTool={setTool}/>

                                        <DTImage skeleton />

                                        {openOverlay && (
                                            <Hidden smDown>
                                                <ButtonBase className={classes.overlay} onClick={handleCloseOverlay}>
                                                    <Box mb={2}>
                                                        <Typography
                                                            variant="h6"
                                                            color="textPrimary"
                                                            align="center"
                                                            gutterBottom
                                                        >
                                                            To start drawing labels, click and drag.
                                                        </Typography>
                                                        <Typography
                                                            variant="h6"
                                                            color="textPrimary"
                                                            align="center"
                                                            gutterBottom
                                                        >
                                                            To change a label, hover it or use right click.
                                                        </Typography>
                                                    </Box>
                                                    <MouseIcon className="highlight" fontSize="large" />
                                                    <Button onClick={handleCloseOverlay} sx={{mt: 3}}>
                                                        Got it
                                                    </Button>
                                                </ButtonBase>
                                            </Hidden>
                                        )}
                                    </div>
                                </ImageProvider>
                            )
                        }
                    </ImagesConsumer>
                </ImagesProvider>
            </DatasetProvider>
        </div>
    );
};

export default FeatureLabeling;
