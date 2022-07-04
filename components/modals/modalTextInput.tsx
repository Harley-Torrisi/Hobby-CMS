import { ModalBase } from "./modalBase"
import { ChangeEvent, HTMLInputTypeAttribute, useEffect, useState } from "react"
import { Button, DialogContentText, TextField } from "@mui/material"

export type OnModalTextInputResponseEvent = (response: "accept" | "cancel", value: string | null) => void

interface Props
{
    title: string
    message: string
    textLabel?: string
    textType?: HTMLInputTypeAttribute
    modalOpen: boolean
    onModalRespond: OnModalTextInputResponseEvent
}

export const ModalTextInput = (props: Props) =>
{
    const [inputValue, setInputValue] = useState('');

    useEffect(() => setInputValue(''), [props.modalOpen])

    const onCancelHandler = () => props.onModalRespond("cancel", null);

    const onSubmitHandler = () => props.onModalRespond("accept", inputValue);

    const onInputChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInputValue(event.target.value);

    return (
        <ModalBase
            header={props.title}
            body={<>
                <DialogContentText marginBottom={1}>{props.message}</DialogContentText>
                <TextField
                    label={props.textLabel}
                    type={props.textType}
                    value={inputValue}
                    onChange={onInputChangeHandler}
                    variant="standard"
                    fullWidth
                    margin="dense"
                />
            </>}
            footer={<>
                <Button onClick={onCancelHandler}>Cancel</Button>
                <Button onClick={onSubmitHandler} disabled={inputValue.trim() == ''}>Submit</Button>
            </>}
            modalOpen={props.modalOpen}
            onHideModal={onCancelHandler}
        />
    )
}
