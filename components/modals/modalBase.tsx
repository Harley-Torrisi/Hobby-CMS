import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import { Breakpoint } from "@mui/material"

interface Props
{
	header?: any
	body?: any
	footer?: any
	modalOpen: boolean
	onHideModal?: () => void
	static?: boolean
	size?: Breakpoint
}

export const ModalBase = (props: Props) =>
{
	const onCloseHandler = () =>
	{
		if (props.static == false)
		{
			props.onHideModal && props.onHideModal();
		}
	}

	return (
		<Dialog
			open={props.modalOpen} onClose={onCloseHandler}
			maxWidth={props.size}
			fullWidth={props.size != null || typeof props.size !== "undefined"}
		>
			<DialogTitle>{props.header}</DialogTitle>
			<DialogContent>{props.body}</DialogContent>
			<DialogActions>{props.footer}</DialogActions>
		</Dialog>
	)
}