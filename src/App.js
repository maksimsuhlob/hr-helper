import './App.css';
import {Switch, Route, Redirect} from 'react-router-dom';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import {AppContext} from './utils/appContext';
import React, {useEffect, useReducer, useState} from 'react';
import Roles from './pages/roles/Roles';
import firebase from 'firebase';
import {PermissionKeys} from './utils/constants';
import Employee from './pages/emloyee/Employee';
import User from './pages/user/User';
import Positions from './pages/positions/Positions';
import Unit from './pages/unit/Unit';
import {Snackbar} from '@material-ui/core';
import Scheduler from './pages/scheduler/Scheduler';
import StaffingTable from './pages/staffing-table/StaffingTable';
import {IntlProvider} from 'react-intl';
import EnTranslations from './en.json';
import RuTranslations from './ru.json';

const initialState = {
  profile: null,
  roles: null
};

function init() {
  return initialState;
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      state.profile = {...action.payload};
      return {...state};
    case 'LOGOUT':
      state.profile = null;
      return {...state};
    case 'SET_ROLES':
      state.roles = {...action.payload};
      return {...state};
    default:
      throw new Error();
  }
}

function PrivateRoute({children, isAuthorize, ...rest}) {
  return (
    <Route
      {...rest}
      render={({location}) =>
        isAuthorize ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: {from: location}
            }}
          />
        )
      }
    />
  );
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const [alert, setAlert] = useState(null);
  useEffect(() => {
    firebase.database().ref(`/roles`).get()
      .then(data => {
        dispatch({
          type: 'SET_ROLES',
          payload: data.val()
        });
      })
      .catch(e => console.log(e));
  }, []);

  function isAuthorized(permission) {
    if (state.profile && state.roles) {
      const role = state.roles[state.profile.role];
      if (role) {
        return role.permissions.includes(permission);
      }
      return false;
    }
    return false;
  }

  function handleCloseAlert() {
    setAlert(null);
  }

  function addAlert(message) {
    setAlert(message);
  }

  return (
    <IntlProvider
      messages={state.profile && state.profile.language==='ru'?RuTranslations:EnTranslations}
      locale={state.profile && state.profile.language}
      defaultLocale="en">
      <AppContext.Provider value={{state, dispatch, isAuthorized, addAlert}}>
        <Snackbar
          open={Boolean(alert)}
          autoHideDuration={6000}
          message={alert}
          onClose={handleCloseAlert}
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        />
        <Switch>
          <Route exact path={'/'}>
            <Login/>
          </Route>
          <PrivateRoute isAuthorize={isAuthorized(PermissionKeys.employee)} exact path={'/employee'}>
            <Employee/>
          </PrivateRoute>
          <PrivateRoute isAuthorize={isAuthorized(PermissionKeys.roles)} exact path={'/roles'}>
            <Roles/>
          </PrivateRoute>
          <PrivateRoute isAuthorize={isAuthorized(PermissionKeys.user)} exact path={'/user'}>
            <User/>
          </PrivateRoute>
          <PrivateRoute isAuthorize={state.profile} exact path={'/profile'}>
            <Profile/>
          </PrivateRoute>
          <PrivateRoute isAuthorize={isAuthorized(PermissionKeys.positions)} exact path={'/positions'}>
            <Positions/>
          </PrivateRoute>
          <PrivateRoute isAuthorize={isAuthorized(PermissionKeys.scheduler)} exact path={'/scheduler'}>
            <Scheduler/>
          </PrivateRoute>
          <PrivateRoute isAuthorize={isAuthorized(PermissionKeys.unit)} exact path={'/unit'}>
            <Unit/>
          </PrivateRoute>
          <PrivateRoute isAuthorize={isAuthorized(PermissionKeys.unit)} exact path={'/staffingTable'}>
            <StaffingTable/>
          </PrivateRoute>
        </Switch>
      </AppContext.Provider>
    </IntlProvider>
  );
}

export default App;
