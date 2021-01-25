import React, {FC, useContext, useState} from 'react';

export interface FormStateInterface {
    isValid: boolean,
    values: object,
    touched: object,
    errors: object
}

export const FormContext = React.createContext({
    formState: {
        isValid: false,
        values: {},
        touched: {},
        errors: {}
    },
    setFormState: (formState: FormStateInterface) => {
        return;
    }
});

interface FormInterface {
    values?: any
}

export const FormProvider: FC<FormInterface> = ({children, values}) => {

    const setFormState = (formState: FormStateInterface) => {
        setState({...state, formState: formState});
    };

    const initState = {
        formState: {
            isValid: false,
            values: values || {},
            touched: {},
            errors: {}
        },
        setFormState: setFormState
    };

    const [state, setState] = useState(initState);

    return (
        <FormContext.Provider value={state}>
            {children}
        </FormContext.Provider>
    )
};

function useForm() {
    return useContext(FormContext);
}

export default useForm;