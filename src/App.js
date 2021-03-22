import './App.css';
import {Switch, Route, Redirect} from 'react-router-dom';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import {AppContext} from './utils/appContext';
import {useEffect, useReducer} from 'react';
import Roles from './pages/roles/Roles';
import firebase from 'firebase';
import {PermissionKeys} from './utils/constants';
import Employee from './pages/emloyee/Employee';
import User from './pages/user/User';

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
      const role = Object.values(state.roles).find(role => role.name === state.profile.role);
      if (role) {
        return role.permissions.includes(permission);
      }
      return false;
    }
    return false;
  }

  return (
    <AppContext.Provider value={{state, dispatch, isAuthorized}}>
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
        <PrivateRoute isAuthorize={isAuthorized(PermissionKeys.scheduler)} exact path={'/scheduler'}>
          scheduler
        </PrivateRoute>
        <PrivateRoute isAuthorize={isAuthorized(PermissionKeys.unit)} exact path={'/unit'}>
          unit
        </PrivateRoute>
      </Switch>
    </AppContext.Provider>
  );
}

export default App;
