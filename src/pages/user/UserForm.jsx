import React, {useEffect, useState} from 'react';
import {
  FormControl,
  InputLabel,
  makeStyles, MenuItem, Select,
  TextField
} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/database';
import {modifyData} from '../../utils/modifyData';
import {useIntl} from 'react-intl';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: 20
  }
}));
const userInitialValue = {
  id: null,
  value: {
    nickname: '',
    password: '',
    role: ''
  }
};
export default function UserForm({model = userInitialValue, isInvalid, onChange}) {
  const classes = useStyles();
  const [roleList, setRoleList] = useState([]);
  const [userProfile, setUserProfile] = useState(userInitialValue);
  const intl = useIntl();
  useEffect(() => {
    firebase.database().ref(`/roles`)
      .on('value', data => {
        setRoleList(modifyData(data));
      });

    return () => {
      firebase.database().ref(`/roles`).off();
    };
  }, []);
  useEffect(() => {
    setUserProfile(model);
  }, [model]);

  function handleChange(type) {
    return e => {
      const newProfile = {...userProfile, value: {...userProfile.value, [type]: e.target.value}};
      setUserProfile(newProfile);
      onChange && onChange(newProfile);
    };
  }

  return <>
    <TextField
      value={userProfile.value.nickname}
      label={intl.formatMessage({
        id: 'user.form.nickname',
        defaultMessage: 'User login'
      })}
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('nickname')}
    />
    <TextField
      value={userProfile.value.password}
      label={intl.formatMessage({
        id: 'user.form.password',
        defaultMessage: 'User password'
      })}
      error={isInvalid}
      className={classes.input}
      onChange={handleChange('password')}
    />
    {
      <FormControl
        variant="outlined"
        className={classes.input}
      >
        <InputLabel id="demo-simple-select-outlined-label">
          {intl.formatMessage({
            id: 'user.form.role',
            defaultMessage: 'Role'
          })}
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          value={userProfile.value.role}
          onChange={handleChange('role')}
          label={intl.formatMessage({
            id: 'user.form.role',
            defaultMessage: 'Role'
          })}
          error={isInvalid}
        >
          {
            roleList.map(role => {
              return <MenuItem key={role.id} value={role.value.name}>{role.value.name}</MenuItem>;
            })
          }
        </Select>
      </FormControl>
    }
  </>;
};
