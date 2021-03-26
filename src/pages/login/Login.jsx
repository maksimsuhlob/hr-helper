import React, {useContext, useState} from 'react';
import {Button, makeStyles, TextField} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/database';
import {AppContext} from '../../utils/appContext';

const useStyles = makeStyles(theme => ({
  login: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    marginBottom: '20px',
    fontSize: '36px'
  },
  error: {
    color: 'red',
    textTransform: 'capitalize',
    height: '1.2rem'
  }
}));

export default function Login() {
  const classes = useStyles();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const history = useHistory();
  const {dispatch} = useContext(AppContext);

  function handleLogin() {
    firebase.database().ref(`/users`).orderByChild('nickname').equalTo(login).get()
      .then(data => {
        const user = data.val();
        if (user) {
          const userData = Object.values(user)[0];
          if (userData && userData.password === password) {
            dispatch({
              type: 'SET_PROFILE',
              payload: {...userData, nickname: login}
            });
            history.push('/profile');
            return;
          }
        }
        setAuthError(true);
      })
      .catch(e => console.log(e));
  }

  function handleChangeInput(type) {
    return (e) => {
      setAuthError(false);
      if (type === 'userName') {
        setLogin(e.target.value);
      }
      if (type === 'userPassword') {
        setPassword(e.target.value);
      }
    };
  }

  function handleKeyPress(e) {
    if (e.code === 'Enter') {
      handleLogin();
    }
  }

  return <div className={classes.login}>
    <div className={classes.form}>
      <TextField
        label={'Login'}
        className={classes.input}
        onChange={handleChangeInput('userName')}
        onKeyPress={handleKeyPress}
        error={authError}
      />
      <TextField
        label={'Password'}
        className={classes.input}
        onChange={handleChangeInput('userPassword')}
        type={'password'}
        onKeyPress={handleKeyPress}
        error={authError}
      />
      <Button variant={'contained'} color={'primary'} onClick={handleLogin}>Login</Button>
      <div className={classes.error}>
        {
          authError && <p>incorrect login or password</p>
        }
      </div>
    </div>
  </div>;
}
