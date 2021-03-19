import React, {useContext, useState} from 'react';
import {AppBar, Button, Drawer, IconButton, makeStyles, Toolbar, Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {AppContext} from '../../utils/appContext';
import {NavLink} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontSize: 24
  },
  drawer: {
    width: 300,
    padding: 20,
  },
  linkWrapper: {
    padding: 10
  },
  link: {
    textTransform: 'capitalize',
    color: '#111',
    textDecoration: 'none'
  },
  linkActive: {
    textTransform: 'capitalize',
    color: '#888',
    textDecoration: 'underline'
  },
}));
const routes = [
  'unit',
  'scheduler',
  'roles',
  'profile',
  'employee',
];
export default function Header({title}) {
  const classes = useStyles();
  const {dispatch} = useContext(AppContext);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  function handleLogout() {
    dispatch({
      type: 'LOGOUT'
    });
  }

  function toggleDrawer(isOpen) {
    return () => setIsOpenDrawer(isOpen);
  }

  return <AppBar position="static">
    <Toolbar>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon/>
      </IconButton>
      <Typography variant="h1" className={classes.title}>
        {title}
      </Typography>
      <Button color="inherit" onClick={handleLogout}>Logout</Button>
    </Toolbar>
    <Drawer
      anchor={'left'}
      open={isOpenDrawer}
      onClose={toggleDrawer(false)}
    >
      <div className={classes.drawer}>
        <nav>
          {
            routes.map((item, i) => {
              return <div key={i} className={classes.linkWrapper}>
                <NavLink
                  to={`/${item}`}
                  className={classes.link}
                  activeClassName={classes.linkActive}
                >{item}</NavLink>
              </div>;
            })
          }
        </nav>
      </div>
    </Drawer>
  </AppBar>;
}
