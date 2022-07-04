import { Button } from "@mui/material"
import { HTMLInputTypeAttribute, useState } from "react"
import { ModalTextInput, OnModalTextInputResponseEvent } from "./modalTextInput"

interface Props
{
    title: string
    message: string
    textLabel?: string
    textType?: HTMLInputTypeAttribute
    onModalRespond: OnModalTextInputResponseEvent
    buttonVariant?: "text" | "outlined" | "contained"
    buttonText: string
    buttonColor?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
}

export const ModalTextInputWithButton = (props: Props) =>
{
    const [modelOpen, setModelOpen] = useState(false);

    const onShowModalHandler = () => setModelOpen(true);

    const onModalRespond: OnModalTextInputResponseEvent = (response, value) =>
    {
        setModelOpen(false);
        props.onModalRespond(response, value);
    }

    return (
        <div>
            <Button variant={props.buttonVariant} onClick={onShowModalHandler} color={props.buttonColor}>{props.buttonText}</Button>
            <ModalTextInput
                {...{
                    title: props.title,
                    message: props.message,
                    modalOpen: modelOpen,
                    onModalRespond: onModalRespond,
                    textLabel: props.textLabel,
                    textType: props.textType
                }}
            />
        </div>
    )
}