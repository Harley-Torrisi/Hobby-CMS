import { Box, CssBaseline } from "@mui/material";
import { LayoutNav } from "./layoutNav";

export function LayoutBase({ children }: any)
{
    return (<>
        <CssBaseline enableColorScheme />
        <LayoutNav />
        {children}
    </>)
}