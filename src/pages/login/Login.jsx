import React, {useContext, useState} from 'react';
import {Button, makeStyles, TextField} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import './style.scss';
import firebase from 'firebase/app';
import 'firebase/database';
import {AppContext} from '../../utils/appContext';

const useStyles = makeStyles(theme => ({
  login: {},
  input: {
    marginBottom: '20px',
    fontSize: '36px'
  }
}));

export default function Login() {
  const classes = useStyles();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const {dispatch} = useContext(AppContext);

  function handleLogin() {
    firebase.database().ref(`/users/${login}`).get()
      .then(data => {
        const userData = data.val();
        if (userData && userData.password === password) {
          dispatch({
            type: 'SET_PROFILE',
            payload: {...userData, nickname: login}
          })
          history.push('/profile');
        }
      })
      .catch(e => console.log(e));
  }

  function handleChangeInput(type) {
    return (e) => {
      if (type === 'userName') {
        setLogin(e.target.value);
      }
      if (type === 'userPassword') {
        setPassword(e.target.value);
      }
    };
  }

  return <div className="login">
    <div className="login__form">
      <TextField
        label={'Login'}
        className={classes.input}
        onChange={handleChangeInput('userName')}
      />
      <TextField
        label={'Password'}
        className={classes.input}
        onChange={handleChangeInput('userPassword')}
        type={'password'}
      />
      <Button variant={'contained'} color={'primary'} onClick={handleLogin}>Login</Button>
    </div>
  </div>;
}
