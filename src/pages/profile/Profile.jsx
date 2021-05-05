import React, {useContext, useState} from 'react';
import {Button, Container, makeStyles, TextField,} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/database';
import {AppContext} from '../../utils/appContext';
import Layout from '../../components/layout/Layout';
import {FormattedMessage, useIntl} from 'react-intl';

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
  const {state: {profile}, addAlert, dispatch} = useContext(AppContext);
  const [password, setPassword] = useState(profile.password);
  const [isSavePassword, setIsSavePassword] = useState(false);
  const intl = useIntl();

  function handleChangePassword(e) {
    setIsSavePassword(true);
    setPassword(e.target.value);
  }

  function handleSavePassword() {
    if (!password.length) {
      addAlert(intl.formatMessage({
        id: 'profile.notification.incorrect',
        defaultMessage: 'Incorrect password'
      }));
      return;
    }
    firebase.database().ref(`/users/${profile.nickname}`).set({...profile, password})
      .then(() => {
        setIsSavePassword(false);
        addAlert(intl.formatMessage({
          id: 'profile.notification',
          defaultMessage: 'Password updated'
        }));
      })
      .catch(e => console.log(e));
  }

  function handleSaveLang(language) {
    return () =>
      firebase.database().ref(`/users/${profile.nickname}`).set({...profile, language})
        .then(() => {
          dispatch({
            type: 'SET_PROFILE',
            payload: {...profile, language}
          });
        })
        .catch(e => console.log(e));
  }

  return <Layout title={intl.formatMessage({
    id: 'profile.title',
    defaultMessage: 'Profile'
  })}>
    <Container className={classes.container} maxWidth={'sm'}>
      <TextField
        value={profile.nickname}
        disabled
        label={intl.formatMessage({
          id: 'profile.nickname',
          defaultMessage: 'Nickname'
        })}
        className={classes.input}
      />
      <TextField
        value={profile.role}
        disabled
        label={intl.formatMessage({
          id: 'profile.role',
          defaultMessage: 'Role'
        })}
        className={classes.input}
      />
      <div>
        <Button
          color={profile.language === 'ru' ? 'primary' : 'default'}
          variant={'contained'}
          onClick={handleSaveLang('ru')}
        >
          ru
        </Button>
        <Button
          color={profile.language === 'en' ? 'primary' : 'default'}
          variant={'contained'}
          onClick={handleSaveLang('en')}
        >
          en
        </Button>
      </div>
      <TextField
        value={password}
        type={'password'}
        label={intl.formatMessage({
          id: 'profile.password',
          defaultMessage: 'Password'
        })}
        onChange={handleChangePassword}
        className={classes.input}
      />
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={handleSavePassword}
        disabled={!isSavePassword}
      >
        <FormattedMessage
          id={"profile.upd-password"}
          defaultMessage={"Update Password"}
        />
      </Button>
    </Container>
  </Layout>;
}
