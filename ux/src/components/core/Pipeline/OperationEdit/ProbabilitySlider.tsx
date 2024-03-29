import React, {FC} from 'react';
import {Slider, Typography} from '@mui/material';
import {useDispatch} from 'src/store';
import {Operation} from 'src/types/pipeline';
import {updateOperation} from 'src/slices/pipeline';

interface ProbabilitySliderProps {
    operation: Operation;
    setDragDisabled?: (update: boolean) => void;
    disabled?: boolean;
}

const ProbabilitySlider: FC<ProbabilitySliderProps> = ({operation, setDragDisabled, ...rest}) => {
    const dispatch = useDispatch();

    const handleProbabilityChange = async (event, value): Promise<void> => {
        try {
            await dispatch(updateOperation(operation.type, {probability: value}));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Typography variant="overline" color="textSecondary">
                Probability
            </Typography>

            <Slider
                min={0.05}
                max={1}
                step={0.05}
                marks
                valueLabelDisplay="auto"
                defaultValue={operation.probability}
                onClick={event => event.stopPropagation()}
                onChangeCommitted={handleProbabilityChange}
                onMouseEnter={() => setDragDisabled && setDragDisabled(true)}
                onMouseLeave={() => setDragDisabled && setDragDisabled(false)}
                sx={{py: 1}}
                {...rest}
            />
        </>
    );
};

export default ProbabilitySlider;
