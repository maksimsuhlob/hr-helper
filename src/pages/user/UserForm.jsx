import React, {useEffect, useState} from 'react';
import {
  FormControl,
  InputLabel,
  makeStyles, MenuItem, Select,
  TextField
} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/database';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    padding: 30,
    justifyContent: 'space-between'
  },
  userList: {
    width: '100%',
    maxWidth: '29%',
    borderWidth: 1,
    borderBlockColor: 'primary',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  userForm: {
    display: 'flex',
    flexDirection: 'column',
    flex: "1 1 auto",
    maxWidth: '69%',
  },
  input: {
    marginBottom: 20
  },
  controls: {
    display: 'flex'
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
  useEffect(() => {
    firebase.database().ref(`/roles`)
      .on('value', data => {
        const roles = [];
        const rolesData = data.val();
        for (let key in data.val()) {
          roles.push({
            id: key,
            value: rolesData[key]
          });
        }
        setRoleList(roles);
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
      label={'User login'}
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('nickname')}
    />
    <TextField
      value={userProfile.value.password}
      label={'User password'}
      error={isInvalid}
      className={classes.input}
      onChange={handleChange('password')}
    />
    {
      <FormControl
        variant="outlined"
        className={classes.input}
      >
        <InputLabel id="demo-simple-select-outlined-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          value={userProfile.value.role}
          onChange={handleChange('role')}
          label="Role"
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
