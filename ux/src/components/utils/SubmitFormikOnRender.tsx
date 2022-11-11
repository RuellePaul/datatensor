import {FC, useEffect} from 'react';
import {useFormikContext} from 'formik';

const SubmitFormikOnRender: FC = () => {
    const {submitForm} = useFormikContext();

    useEffect(() => {
        submitForm();
    }, [submitForm]);

    return null;
};

export default SubmitFormikOnRender;
