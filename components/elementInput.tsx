import { ChangeEvent } from "react";
import { FloatingLabel, Form } from "react-bootstrap";

export namespace InputElement
{
    export type OnChangeValueHandler = (value: string) => void;
    export enum InputTypes { Text = 'text', Password = 'password', Email = 'email' }
    export interface Props
    {
        value?: string | number | string[]
        onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
        onChangeValue?: OnChangeValueHandler
        placeholder?: string
        type?: InputTypes | string
        title?: string
        subText?: string,
        className?: string,
        isInvalid?: boolean,
        name?: string,
        readonly?: boolean
        disabled?: boolean
    }
    export function Large({
        value, placeholder,
        onChange, onChangeValue,
        type = InputTypes.Text,
        title,
        subText,
        className,
        isInvalid,
        name,
        readonly = false,
        disabled = false
    }: Props)
    {
        function onChangeHandler(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
        {
            onChange && onChange(event);
            onChangeValue && onChangeValue(event.target.value);
        }

        return (
            <FloatingLabel label={placeholder} title={title} className={className}>
                <Form.Control
                    type={type} placeholder={placeholder}
                    value={value ?? ""} onChange={onChangeHandler}
                    isInvalid={isInvalid}
                    name={name}
                    readOnly={readonly}
                    disabled={disabled}
                />
                {subText && <Form.Text>{subText}</Form.Text>}
            </FloatingLabel>
        )
    }
}