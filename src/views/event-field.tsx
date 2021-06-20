import React from 'react';
import { RouteComponentProps } from 'react-router';
import {
    Await, Button, Input, InputType, ISelectItem, message, NavigationPanel, Select, t,
} from 'pl-core-ui';
import { IEventFields, initialEventFieldsModel, ValueTypes } from '../model/eventFields';
import { FormItem } from '../components/common/FormItem';
import { choose, enter } from '../lib/util/formHelpers';
import { eventFieldsDTO } from '../controllers/eventFieldsDTO';
import { useForm } from '../lib/useForm';

export default ({ history, match: { params: { eventFieldId } } }: RouteComponentProps<{ eventFieldId: string }>) => {
    const onOutClick = () => history.push('/collectors-settings/event-fields');

    const changesSaved = t('changes_saved');
    const onSubmit = (v: IEventFields) => {
        const thenHandler = () => {
            message(changesSaved);
            history.push('/collectors-settings/event-fields');
        };

        if (eventFieldId !== undefined) {
            return eventFieldsDTO
                .getInstance(eventFieldId)
                .update(v)
                .then(thenHandler);
        }
        return eventFieldsDTO
            .create(v)
            .then(thenHandler);
    };

    const errorOccurred = t('error_occurred');
    const onError = (e: any) => message.error(e.data.synopsis || errorOccurred);

    const requiredMsg = t('required');
    const enterCorrectDataMsg = t('enter_correct_data');
    const beginningFieldNameError = t('beginning_field_name_error');
    const busyMsg = t('busy');

    const onValidateForm = async (v: IEventFields, initial: IEventFields) => {
        const newErrors: { [key in keyof Partial<IEventFields>]: string } = {};
        const reg = /^([A-Z][a-z]*(\.[A-Z][a-z]*)*)*$/;
        const snmpReg = /^SNMP\./i;
        const wmiReg = /^WMI\./i;
        const syslogReg = /^SYSLOG\./i;
        const sqlReg = /^SQL\./i;
        const xflowReg = /^XFLOW\./i;
        const fileReg = /^FILE\./i;
        const collectorsRegExp = [snmpReg, wmiReg, syslogReg, sqlReg, xflowReg, fileReg];

        if (!v.FieldName || !/[^\s]/.test(v.FieldName)) {
            newErrors.FieldName = requiredMsg;
        } else if (!reg.test(v.FieldName)) {
            newErrors.FieldName = enterCorrectDataMsg;
        } else if (v.FieldName !== undefined && collectorsRegExp.some((regexp) => regexp.test(v.FieldName as string))) {
            newErrors.FieldName = beginningFieldNameError;
        } else {
            const res = await eventFieldsDTO.check(v.FieldName);
            if (!res && v.FieldName !== initial.FieldName) {
                newErrors.FieldName = busyMsg;
            }
        }

        if (v.ShortDescription) {
            const res = await eventFieldsDTO.check(v.ShortDescription);
            if (!res && v.ShortDescription !== initial.ShortDescription) {
                newErrors.ShortDescription = busyMsg;
            }
        }

        return newErrors;
    };

    const {
        changeTouched,
        changeValue,
        errors,
        handleSubmit,
        isInSessionStorage,
        notValid,
        setInitialValues,
        setValues,
        touched,
        values,
    } = useForm<IEventFields>({
        key: 'event-field', initialValues: initialEventFieldsModel, onError, onSubmit, onValidateForm,
    });

    const getData = async () => {
        if (eventFieldId !== undefined && !isInSessionStorage) {
            eventFieldsDTO.get(eventFieldId).then(({ value }) => {
                if (value !== undefined) {
                    setInitialValues(value);
                    setValues(value);
                }
            });
        }
    };

    const typesList: ISelectItem<string>[] = Object.values(ValueTypes).map((item) => ({ label: item, value: item }));
    return (
        <>
            <NavigationPanel
                onOutClick={onOutClick}
                out={t('event_fields')}
            />
            <Await
                promiseFactory={getData}
                watchFor={[eventFieldId]}
            >
                <div className="page-content">
                    <h2 className="title">
                        {t(eventFieldId !== undefined ? 'setting_event_field' : 'new_event_field')}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <FormItem className="form-item_width-400">
                            <Input
                                error={touched.FieldName && errors.FieldName}
                                label={t('name')}
                                name="FieldName"
                                onBlur={changeTouched}
                                onChange={changeValue}
                                placeholder={enter('name_PascalCase', true)}
                                value={values.FieldName}
                            />
                        </FormItem>
                        <FormItem className="form-item_width-400">
                            <Input
                                error={touched.ShortDescription && errors.ShortDescription}
                                label={t('field_name')}
                                name="ShortDescription"
                                onBlur={changeTouched}
                                onChange={changeValue}
                                placeholder={enter('field_name', true)}
                                value={values.ShortDescription}
                            />
                        </FormItem>
                        <FormItem className="form-item_width-400">
                            <Input
                                label={t('description')}
                                name="LongDescription"
                                onChange={changeValue}
                                placeholder={enter('description', true)}
                                rows={3}
                                type={InputType.TEXTAREA}
                                value={values.LongDescription}
                                maxLength={500}
                            />
                        </FormItem>
                        <FormItem className="form-item_width-400">
                            <Select
                                items={typesList}
                                label={t('type_field')}
                                name="ValueType"
                                onChange={changeValue}
                                placeholder={choose('type_field', true)}
                                value={values.ValueType}
                            />
                        </FormItem>
                        <FormItem className="form-item_width-400">
                            <Button
                                disabled={notValid}
                                submit
                            >
                                {t('save')}
                            </Button>
                        </FormItem>
                    </form>
                </div>
            </Await>
        </>
    );
};
