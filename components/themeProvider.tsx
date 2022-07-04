import { getLocalStorageValue } from '@lib/helpers/browswerStorageHelper';
import { themeStyleDefault, ThemeStyles } from '@lib/types/themeStyle';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

function getTheme(themeStyle: ThemeStyles)
{
    return createTheme({
        palette: {
            mode: themeStyle as any,
        }
    });
}

export function ThemeProvider({ children }: any)
{
    const [themeStyle, setThemeStyle] = useState<ThemeStyles>(themeStyleDefault);

    useEffect(() =>
    {
        const style = getLocalStorageValue("theme") || themeStyleDefault;
        setThemeStyle(style as ThemeStyles);
    }, [])

    return (
        <MuiThemeProvider theme={getTheme(themeStyle)}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
}