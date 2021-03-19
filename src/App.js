import './App.css';
import {Switch, Route, Redirect} from 'react-router-dom';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import {AppContext} from './utils/appContext';
import {useReducer} from 'react';

const initialState = {
  profile: {}
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
  return (
    <AppContext.Provider value={{state, dispatch}}>
      <Switch>
        <Route exact path={'/'}>
          <Login/>
        </Route>
        <PrivateRoute isAuthorize={state.profile} exact path={'/employee'}>
          employee
        </PrivateRoute>
        <PrivateRoute isAuthorize={state.profile} exact path={'/profile'}>
          <Profile/>
        </PrivateRoute>
        <PrivateRoute isAuthorize={state.profile} exact path={'/scheduler'}>
          scheduler
        </PrivateRoute>
        <PrivateRoute isAuthorize={state.profile} exact path={'/unit'}>
          unit
        </PrivateRoute>
      </Switch>
    </AppContext.Provider>
  );
}

export default App;
