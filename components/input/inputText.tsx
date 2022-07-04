import { TextField } from "@mui/material";

type ValueChangeEvent = (value: string) => void;

interface Props
{
    label?: string
    value?: string
    onValueChange: ValueChangeEvent
    inputVariant?: "standard" | "filled" | "outlined"
    fullWidth?: boolean
    color?: "error" | "primary" | "secondary" | "info" | "success" | "warning"
}

export const InputText = (props: Props) =>
{
    return (
        <TextField
            label={props.label}
            variant={props.inputVariant}
            value={props.value}
            onChange={(event) => props.onValueChange(event.target.value)}
            sx={{ mt: 1 }}
            fullWidth={props.fullWidth != false}
            color={props.color}
        />
    )
}