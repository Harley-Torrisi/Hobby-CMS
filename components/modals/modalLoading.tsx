import { LinearProgress } from "@mui/material"
import { ModalBase } from "./modalBase"

interface Props
{
    modelOpen: boolean
    title?: string
    color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
}

export const ModalLoading = (props: Props) =>
{
    return (
        <ModalBase modalOpen={props.modelOpen} header={props.title || "Loading"} body={<LinearProgress color={props.color} />} />
    )
}