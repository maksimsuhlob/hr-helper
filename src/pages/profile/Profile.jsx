import React, {useContext, useState} from 'react';
import {Button, Container, makeStyles, TextField,} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/database';
import {AppContext} from '../../utils/appContext';
import Layout from '../../components/layout/Layout';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 30
  },
  input: {
    marginBottom: '20px',
    fontSize: '36px'
  }
}));
export default function Profile() {
  const classes = useStyles();
  const {state: {profile}, addAlert} = useContext(AppContext);
  const [password, setPassword] = useState(profile.password);
  const [isSavePassword, setIsSavePassword] = useState(false);

  function handleChangePassword(e) {
    setIsSavePassword(true);
    setPassword(e.target.value);
  }

  function handleSavePassword() {
    if (!password.length) {
      addAlert('Incorrect password');
      return;
    }
    firebase.database().ref(`/users/${profile.nickname}`).set({...profile, password})
      .then(() => {
        setIsSavePassword(false);
        addAlert('Password updated');
      })
      .catch(e => console.log(e));
  }

  return <Layout title={'Profile'}>
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
  </Layout>;
}
