import { Visibility, VisibilityOff } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FilledInput from "@mui/material/FilledInput";
import { ChangeEvent, useState } from "react";
import { Input } from "@mui/material";

type PasswordChangeEvent = (value: string) => void;

interface Props
{
    password?: string
    onPasswordChange: PasswordChangeEvent
    inputColor?: "primary" | "secondary" | "success" | "error" | "info" | "warning"
    label?: string
    fullWidth?: boolean
}

export const InputPasswordOutlined = (props: Props) =>
{
    const [showPassword, setShowPassword] = useState(false);

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => props.onPasswordChange(event.target.value)

    const onTogglePassword = () => setShowPassword(!showPassword);

    return (
        <FormControl sx={{ mt: 1 }} variant="outlined" fullWidth={props.fullWidth != false}>
            <InputLabel>{props.label || "Password"}</InputLabel>
            <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                value={props.password}
                onChange={onChangeHandler}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={onTogglePassword}
                            edge="end"
                            sx={{ marginRight: -0.9 }}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                color={props.inputColor}
                label={props.label || "Password"}
            />
        </FormControl>
    )
}

export const InputPasswordFilled = (props: Props) =>
{
    const [showPassword, setShowPassword] = useState(false);

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => props.onPasswordChange(event.target.value)

    const onTogglePassword = () => setShowPassword(!showPassword);

    return (
        <FormControl sx={{ mt: 1 }} variant="filled" fullWidth={props.fullWidth != false}>
            <InputLabel>{props.label || "Password"}</InputLabel>
            <FilledInput
                type={showPassword ? 'text' : 'password'}
                value={props.password}
                onChange={onChangeHandler}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={onTogglePassword}
                            edge="end"
                            sx={{ marginRight: -0.6 }}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                color={props.inputColor}
            />
        </FormControl>
    )
}

export const InputPassword = (props: Props) =>
{
    const [showPassword, setShowPassword] = useState(false);

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => props.onPasswordChange(event.target.value)

    const onTogglePassword = () => setShowPassword(!showPassword);

    return (
        <FormControl sx={{ mt: 1 }} variant="standard" fullWidth={props.fullWidth != false}>
            <InputLabel>Password</InputLabel>
            <Input
                type={showPassword ? 'text' : 'password'}
                value={props.password}
                onChange={onChangeHandler}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={onTogglePassword}
                            sx={{ marginRight: 0.9, marginBottom: 2.2 }}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    )
}