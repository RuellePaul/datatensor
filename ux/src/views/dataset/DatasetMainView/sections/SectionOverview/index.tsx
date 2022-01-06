import React, {FC, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Grid, Stack, Step, StepButton, StepContent, StepLabel, Stepper, Tooltip} from '@mui/material';
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


const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

const DATASET_ACTIONS = [
    {
        label: 'Upload images',
        component: <UploadAction />
    },
    {
        label: 'Label images',
        component: <LabelisatorAction />
    },
    {
        label: 'Augment images',
        component: <AugmentAction />
    },
    {
        label: 'Export dataset',
        component: <ExportAction />
    }
];

const SectionOverview: FC<SectionProps> = ({ className }) => {
    const classes = useStyles();
    const { categories, pipelines } = useDataset();
    const { images } = useImages();

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
            : 0;

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

                {images instanceof Array && (
                    <Grid item md={4} xs={12}>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {DATASET_ACTIONS.map((action, index) => (
                                <Step key={action.label} disabled={index > currentStep}>
                                    <StepButton onClick={() => setActiveStep(index)}>
                                        {action.label}
                                    </StepButton>
                                    <StepContent>{action.component}</StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </Grid>
                )}
            </Grid>
        </div>
    );
};

export default SectionOverview;
