import type {FC} from 'react';
import React from 'react';
import {Slider, Typography} from '@material-ui/core';
import {useDispatch} from 'src/store';
import type {Operation} from 'src/types/pipeline';
import {updateOperation} from 'src/slices/pipeline';

interface ProbabilitySliderProps {
    operation: Operation,
    setDragDisabled?: (update: boolean) => void
}

const ProbabilitySlider: FC<ProbabilitySliderProps> = ({operation, setDragDisabled}) => {
    const dispatch = useDispatch();

    const handleProbabilityChange = async (event, value): Promise<void> => {
        try {
            await dispatch(updateOperation(operation.id, {probability: value}));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Typography
                variant='overline'
                color='textSecondary'
            >
                Probability
            </Typography>

            <Slider
                min={0.05}
                max={1}
                step={0.05}
                marks
                valueLabelDisplay='auto'
                onClick={event => event.stopPropagation()}
                value={operation.probability}
                onChange={handleProbabilityChange}
                onMouseEnter={() => setDragDisabled && setDragDisabled(true)}
                onMouseLeave={() => setDragDisabled && setDragDisabled(false)}
            />
        </>
    );
}

export default ProbabilitySlider;