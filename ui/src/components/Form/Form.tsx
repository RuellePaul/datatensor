import React, {useEffect, FC} from 'react';
import clsx from 'clsx';
import validate from 'validate.js';
import {useForm, useLoading} from 'hooks';
import {FormProvider} from 'hooks/useForm';

interface FormContentInterface {
    className?: string,
    submit?(formState?: object, setFormState?: any): any
    schema?: object,
    dynamic?: boolean
}

const FormContent: FC<FormContentInterface> = ({className, schema, submit, dynamic, children, ...rest}) => {
    const {formState, setFormState} = useForm();
    const {setLoading} = useLoading();

    useEffect(() => {
        const errors = validate(formState.values, schema, {fullMessages: false});

        setFormState({
            ...formState,
            isValid: !errors,
            errors: errors || {}
        });

        if (submit && dynamic)
            submit(formState, setFormState)

        // eslint-disable-next-line
    }, [formState.values]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (dynamic) return;

        setFormState({
            ...formState,
            errors: {}
        });

        if (formState.isValid && submit) {
            setLoading(true);
            submit(formState, setFormState)
                .catch((error: Error) => {
                    throw(error)
                })
                .finally(() => setLoading(false))
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={clsx(className)}
            {...rest}
        >
            {children}
        </form>
    )
};

interface FormInterface {
    values?: object
}

const Form: FC<FormInterface & FormContentInterface> = ({children, values, ...rest}) => {

    return (
        <FormProvider values={values}>
            <FormContent {...rest}>
                {children}
            </FormContent>
        </FormProvider>
    )
}

export default Form;
