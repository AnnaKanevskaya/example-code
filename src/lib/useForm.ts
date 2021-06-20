import * as React from 'react';
import {
    useState, useCallback, useEffect, useRef,
} from 'react';
import { useFormik } from 'formik';
import { areEqualObjects } from 'pl-core-ui';
import { Util } from 'pl-core-ui-lib';
import { FormikErrors } from 'formik/dist/types';

interface IUseForm<M> {
    changeTouched: () => void;
    changeValue: (val: any, prop: string) => void;
    errors: any;
    handleSubmit: () => void;
    initialModel: M;
    isInSessionStorage: boolean;
    notValid: boolean;
    setInitialValues: (val: M) => void;
    setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean | undefined) => Promise<FormikErrors<M>> | Promise<void>;
    setStatus: (status: any) => void;
    setValues: (val: React.SetStateAction<M>, shouldValidate?: boolean | undefined) => Promise<FormikErrors<M>> | Promise<void>;
    touched: any;
    values: M;
}

interface IForm<N> {
    key?: string;
    initialValues?: N;
    onError?: (e: any) => void;
    onSubmit?: (val: N, initial: N) => Promise<any>;
    onValidateForm?: (val: N, initial: N) => void;
}

export const dataFormKey = 'data-form';

export function useForm<T>({
    key = '',
    initialValues = {} as T,
    onError,
    onSubmit = () => Promise.resolve(),
    onValidateForm = () => Promise.resolve(),
}: IForm<T>): IUseForm<T> {
    const valuesKey = `${dataFormKey}-${key}`;
    const initialValuesKey = `${dataFormKey}-${key}-initial`;
    const sessionValues = sessionStorage.getItem(valuesKey);
    const sessionInitialValues = sessionStorage.getItem(initialValuesKey);

    const initialModel = useRef<T>(sessionInitialValues !== null
        ? JSON.parse(sessionInitialValues as string)
        : initialValues);

    const setSessionInitialValues = (val: T) => sessionStorage.setItem(initialValuesKey, JSON.stringify(val));

    const setInitialValues = (val: T) => {
        initialModel.current = val;
        if (key !== '') {
            setSessionInitialValues(val);
        }
    };

    const {
        errors,
        isValid,
        handleSubmit,
        setFieldTouched,
        setFieldValue,
        setStatus,
        setValues,
        status,
        touched,
        values,
    } = useFormik<T>({
        initialStatus: sessionValues !== null,
        initialValues: sessionValues !== null && key !== '' ? JSON.parse(sessionValues) : initialModel.current,
        onSubmit: (val) => onSubmit(val, initialModel.current)
            .then((v: any) => {
                if (v !== undefined) {
                    setValues(v);
                    setInitialValues(v);
                }
            })
            .catch(onError),
        validate: (val) => onValidateForm(val, initialModel.current),
    });

    const changeValue = useCallback((val: string | number, prop: string) => setFieldValue(prop, val), []);
    const changeTouched = useCallback((arg?: any) => setFieldTouched(arg?.target?.name), []);

    useEffect(() => {
        if (values !== null && key !== '') {
            sessionStorage.setItem(valuesKey, JSON.stringify(values));
        }
    }, [values]);

    const [notValid, setNotValid] = useState<boolean>(true);
    useEffect(() => {
        setNotValid(!isValid || areEqualObjects(Util.clean(initialModel.current), Util.clean(values)));
    }, [isValid, initialModel.current, values]);

    useEffect(() => {
        if (sessionInitialValues === null && key !== '') {
            setSessionInitialValues(initialValues);
        }
    }, []);

    return {
        changeTouched,
        changeValue,
        errors,
        handleSubmit,
        initialModel: initialModel.current,
        isInSessionStorage: status,
        notValid,
        setInitialValues,
        setFieldTouched,
        setStatus,
        setValues,
        touched,
        values,
    };
}
