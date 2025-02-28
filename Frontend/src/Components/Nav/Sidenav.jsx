import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import CarCrashIcon from '@mui/icons-material/CarCrash';

import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../../Context/AuthContext';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    })
);

export default function Sidenav() {
    const { state } = useAuth();
    const currentRole = state.role;
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpen(!open)}
                        edge="start"
                        sx={[
                            {
                                marginRight: 0,
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Navbar />
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                {currentRole === "Superuser" && (
                    <>
                        <List>
                            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate(`/sadmin/users`) }}>
                                <ListItemButton sx={{ minHeight: 48, px: 2.5, justifyContent: open ? 'initial' : 'center' }}>
                                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                                        <PeopleIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Users" sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate(`/sadmin/office`) }}>
                                <ListItemButton sx={{ minHeight: 48, px: 2.5, justifyContent: open ? 'initial' : 'center' }}>
                                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                                        <BusinessIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Office" sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate(`/sadmin/branch`) }}>
                                <ListItemButton sx={{ minHeight: 48, px: 2.5, justifyContent: open ? 'initial' : 'center' }}>
                                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                                        <RoomPreferencesIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Branch" sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </>
                )}
                <Divider />
                {currentRole === "Admin" || currentRole === "Superuser" && (
                    <>
                        <List>
                            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate(`/admin/driver`) }}>
                                <ListItemButton sx={{ minHeight: 48, px: 2.5, justifyContent: open ? 'initial' : 'center' }}>
                                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                                        <CarCrashIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Vehicle & Driver" sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                        <List>
                            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate(`/admin`) }}>
                                <ListItemButton sx={{ minHeight: 48, px: 2.5, justifyContent: open ? 'initial' : 'center' }}>
                                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                                        <AirportShuttleIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Vehicle & Driver" sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </>
                )}
                <Divider />
                {currentRole === "User" || currentRole === "Admin" || currentRole === "Superuser" && (
                    <List>
                        <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate(`/userpage`) }}>
                            <ListItemButton sx={{ minHeight: 48, px: 2.5, justifyContent: open ? 'initial' : 'center' }}>
                                <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                )}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginBottom: 5, padding: 2, paddingLeft: 2 }}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box>
    );
}
