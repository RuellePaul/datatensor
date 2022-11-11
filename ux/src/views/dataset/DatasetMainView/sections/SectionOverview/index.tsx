import React, {FC, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Box, Grid, Stack, Step, StepButton, StepContent, Stepper, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import {SectionProps} from '../SectionProps';
import Categories from 'src/components/core/Dataset/Categories';
import ExportAction from './ExportAction';
import LabelisatorAction from './LabelisatorAction';
import UploadAction from './UploadAction';
import AugmentAction from './AugmentAction';
import EditAction from './EditAction';
import Overview from './Overview';
import useImages from 'src/hooks/useImages';
import useDataset from 'src/hooks/useDataset';
import AnimatedLogo from 'src/components/utils/AnimatedLogo';
import {
    BrandingWatermarkOutlined as LabelingIcon,
    Check as CheckIcon,
    Downloading as ExportIcon,
    DynamicFeedOutlined as AugmentationIcon,
    LockOutlined as LockIcon,
    PublishOutlined as UploadIcon
} from '@mui/icons-material';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

const DATASET_ACTIONS = [
    {
        label: 'Upload',
        component: <UploadAction />,
        icon: <UploadIcon sx={{color: 'text.primary'}} />,
        description: 'Add images to your dataset'
    },
    {
        label: 'Labelisation',
        component: <LabelisatorAction />,
        icon: <LabelingIcon sx={{color: 'text.primary'}} />,
        description: 'Frame your objects on your images'
    },
    {
        label: 'Augmentation',
        component: <AugmentAction />,
        icon: <AugmentationIcon sx={{color: 'text.primary'}} />,
        description: 'Get more labeled images'
    },
    {
        label: 'Export',
        component: <ExportAction />,
        icon: <ExportIcon sx={{color: 'text.primary'}} />,
        description: 'Download .json state of your dataset'
    }
];

const SectionOverview: FC<SectionProps> = ({className}) => {
    const classes = useStyles();
    const {categories, pipelines} = useDataset();
    const {images} = useImages();

    const totalLabelsCount = categories.map(category => category.labels_count || 0).reduce((acc, val) => acc + val, 0);

    const currentStep =
        images instanceof Array
            ? images.length === 0
                ? 0
                : totalLabelsCount === 0
                ? 1
                : pipelines.length === 0
                ? 2
                : 3
            : null;

    useEffect(() => {
        setActiveStep(currentStep);
    }, [currentStep]);

    const [activeStep, setActiveStep] = useState<number>(currentStep);

    return (
        <div className={clsx(classes.root, className)}>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item md={7} xs={12}>
                    <Stack spacing={3}>
                        <EditAction />
                        <Overview />
                        <Categories />
                    </Stack>
                </Grid>

                <Grid item md={4} xs={12}>
                    {images instanceof Array ? (
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {DATASET_ACTIONS.map((action, index) => (
                                <Step key={action.label} disabled={index > currentStep}>
                                    <StepButton
                                        icon={action.icon}
                                        onClick={() => setActiveStep(activeStep !== index ? index : null)}
                                        optional={
                                            <Box display="flex" alignItems="center">
                                                <Typography variant="caption">{action.description} </Typography>

                                                {index < currentStep && (
                                                    <CheckIcon sx={{color: 'success.main', fontSize: 18, pl: 0.25}} />
                                                )}
                                                {index > currentStep && (
                                                    <LockIcon sx={{color: 'disabled', fontSize: 16, pl: 0.25}} />
                                                )}
                                            </Box>
                                        }
                                    >
                                        {action.label}
                                    </StepButton>
                                    <StepContent TransitionProps={{unmountOnExit: false}}>
                                        <Box my={2}>{action.component}</Box>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                width: '100%',
                                height: 300,
                                backgroundColor: 'background.paper',
                                borderRadius: 8,
                                p: 3
                            }}
                        >
                            <AnimatedLogo />

                            <Typography variant="body2" sx={{my: 2}} color="textSecondary">
                                Loading actions...
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

export default SectionOverview;
