import React from "react";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from '@material-ui/core/List';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Divider from '@material-ui/core/Divider';



const drawerWidth = 240;



const useStyles = makeStyles(theme => ({
    appBar: {
        background: 'transparent'
    },
    menuButton: {
      marginRight: 'auto',
    },
    title: {
      flexGrow: 1,
    },
    rightSide: {
        marginLeft: 'auto'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
      },
      drawerPaper: {
        width: drawerWidth,
        background: 'black'
      },
      drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
}));

export default function ButtonAppBar() {
    const classes = useStyles()
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


	return (
        <React.Fragment>
            <AppBar className={classes.appBar} position="static">
                <Toolbar >
                    <Typography variant="h6" className={classes.menuButton}>
                    gelato finance
                    </Typography>
                    <Hidden xsDown>
                        <Button style={{color: 'white'}}>
                            Overview
                        </Button>
                        <Button style={{color: 'white'}}>
                            Connect
                        </Button>
                    </Hidden>
                    <Hidden smUp>
                        <IconButton
                            edge="end"
                            onClick={handleDrawerToggle}
                            // className={clsx(open && classes.hide)}
                            color="inherit"
                            aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                    </Hidden>
                </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="right"
                    open={mobileOpen}
                    classes={{
                    paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerToggle}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon color="primary" /> : <ChevronRightIcon color="primary" />}
                    </IconButton>
                    </div>
                    <Divider />
                    <List style={{color: 'white'}}>
                    {['Connect', 'Overview'].map((text, index) => (
                        <ListItem
                            button
                            key={text}
                        >
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary={text} />
                        </ListItem>
                    ))}
                    </List>
                    <Divider />

                </Drawer>

        </React.Fragment>
	);
}
