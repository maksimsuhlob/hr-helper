import React, {useContext, useState} from 'react';
import {Button, Container, makeStyles, TextField,} from '@material-ui/core';
import './style.scss';
import firebase from 'firebase/app';
import 'firebase/database';
import {AppContext} from '../../utils/appContext';
import Header from '../../components/header/Header';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    marginBottom: '20px',
    fontSize: '36px'
  },
  pageTitle: {
    fontSize: 24
  }
}));
export default function Profile() {
  const classes = useStyles();
  const {state: {profile}} = useContext(AppContext);
  const [password, setPassword] = useState(profile.password);
  const [isSavePassword, setIsSavePassword] = useState(false);

  function handleChangePassword(e) {
    setIsSavePassword(true);
    setPassword(e.target.value);
  }

  function handleSavePassword() {
    firebase.database().ref(`/users/${profile.nickname}`).set({...profile, password})
      .then(data => {
        console.log(data);
      })
      .catch(e => console.log(e));
  }

  return <div className="profile">
    <Header title={'Profile'}/>
    <Container className={classes.container} maxWidth={'sm'}>
      <TextField
        value={profile.nickname}
        disabled
        label={'Nickname'}
        className={classes.input}
      />
      <TextField
        value={profile.role}
        disabled
        label={'Role'}
        className={classes.input}
      />
      <TextField
        value={password}
        type={'password'}
        label={'Password'}
        onChange={handleChangePassword}
        className={classes.input}
      />
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={handleSavePassword}
        disabled={!isSavePassword}
      >
        Update Password
      </Button>
    </Container>
  </div>;
}
