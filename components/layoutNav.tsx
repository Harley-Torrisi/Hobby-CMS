import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ImageIcon from '@mui/icons-material/Image';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getLocalStorageValue, setLocalStorageValue } from '@lib/helpers/browswerStorageHelper';
import { themeStyleDefault, ThemeStyles } from '@lib/types/themeStyle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Link } from '@mui/material';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

interface NavLink
{
    text: string
    href: string
    icon: () => JSX.Element
}

const navLinks: NavLink[] = [
    { text: 'Projects', href: '/projects', icon: () => <BusinessCenterIcon /> },
    { text: 'Posts', href: '/posts', icon: () => <NewspaperIcon /> },
    { text: 'Image Manager', href: '/images', icon: () => <ImageIcon /> }
];

export const LayoutNav = () =>
{
    const theme = useTheme();
    const isMobileMode = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [themeStyle, setThemeStyle] = useState<ThemeStyles>(null);

    useEffect(() =>
    {
        const style = getLocalStorageValue("theme") || themeStyleDefault;
        setThemeStyle(style as ThemeStyles);
    }, []);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () =>
    {
        setAnchorElNav(null);
    };

    const setThemeStyleHandler = (style: ThemeStyles) =>
    {
        setLocalStorageValue("theme", style);
        router.reload();
    }

    const getThemeButton = (): JSX.Element =>
    {
        if (themeStyle == "light") return (
            <IconButton onClick={() => setThemeStyleHandler("dark")} sx={{ color: 'white' }}>
                <DarkModeIcon />
            </IconButton>
        )
        else return (
            <IconButton onClick={() => setThemeStyleHandler("light")} sx={{ color: 'white' }}>
                <LightModeIcon />
            </IconButton>
        )
    }

    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                {/* Desktop */}
                {!isMobileMode &&
                    <Toolbar disableGutters>
                        <Typography
                            variant="h5" component="a" href="/" noWrap color="white"
                            sx={{ textDecoration: 'none' }}
                        >{process.env.NEXT_PUBLIC_SITE_NAME}</Typography>
                        <Box marginLeft={2} display="flex" flexGrow="1">
                            <Box display="flex" flexGrow="1" gap={2}>
                                {navLinks.map((link, i) =>
                                    <Link
                                        key={i} href={link.href} underline="hover"
                                        fontWeight={500} display="flex" alignItems="center" gap={1} color="white"
                                    >
                                        {link.icon()}
                                        <span>{link.text}</span>
                                    </Link>
                                )}
                            </Box>
                            <Box display="flex" gap={3}>
                                {getThemeButton()}
                                <Link
                                    underline="hover"
                                    display="flex" alignItems="center" gap={1} fontWeight={500} color="white"
                                    sx={{
                                        color: 'white',
                                        '&:hover': { cursor: 'pointer' }
                                    }}
                                    onClick={() => signOut()}
                                >
                                    <LogoutIcon />
                                    <span> Sign Out</span>
                                </Link>
                            </Box>
                        </Box>
                    </Toolbar>
                }
                {/* Mobile */}
                {isMobileMode &&
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6" component="a" href="/" noWrap color="white"
                            sx={{ textDecoration: 'none' }}
                        >{process.env.NEXT_PUBLIC_SITE_NAME}</Typography>

                        <Box display="flex" flexGrow={1} justifyContent="flex-end">
                            {getThemeButton()}
                            <Box>
                                <IconButton
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>

                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    keepMounted
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                >
                                    {navLinks.map((link, i) =>
                                        <MenuItem
                                            key={i}
                                            onClick={handleCloseNavMenu}
                                            sx={{ gap: 1.5, alignItems: 'center', display: 'flex' }}
                                        >
                                            {link.icon()}
                                            <Typography textAlign="center">{link.text}</Typography>
                                        </MenuItem>
                                    )}
                                    <MenuItem
                                        onClick={() => signOut()}
                                        sx={{ gap: 1.5, alignItems: 'center', display: 'flex' }}>
                                        <LogoutIcon />
                                        <Typography textAlign="center">Sign Out</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                    </Toolbar>
                }
            </Container>
        </AppBar>
    );
};
