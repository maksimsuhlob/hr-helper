import React, {useEffect, useState} from 'react';
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  makeStyles, MenuItem, Select,
  TextField
} from '@material-ui/core';
import './style.scss';
import firebase from 'firebase/app';
import 'firebase/database';
import Header from '../../components/header/Header';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    padding: 30
  },
  userList: {
    width: '100%',
    maxWidth: '30%'
  },
  userForm: {
    display: 'flex',
    flexDirection: 'column',
    flex: "1 1 auto"
  },
  input: {
    marginBottom: 20
  },
  controls: {
    display: 'flex'
  }
}));
const Modes = {
  read: 'read',
  add: 'add',
  edit: 'edit',
};
const userInitialValue = {
  id: null,
  value: {
    nickname: '',
    password: '',
    role: ''
  }
};
export default function User() {
  const classes = useStyles();
  const [mode, setMode] = useState(Modes.read);
  const [roleList, setRoleList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [userProfile, setUserProfile] = useState(userInitialValue);
  const [isActiveSave, setIsActiveSave] = useState(true);
  useEffect(() => {
    firebase.database().ref(`/roles`)
      .on('value', data => {
        setRoleList(Object.values(data.val()));
      });
    firebase.database().ref(`/users`)
      .on('value', data => {
        const users = [];
        const usersData = data.val();
        for (let key in data.val()) {
          users.push({
            id: key,
            value: usersData[key]
          });
        }
        setUsersList(users);
      });

    return () => {
      firebase.database().ref(`/roles`).off();
      firebase.database().ref(`/users`).off();
    };
  }, []);

  function handleAddNewUser() {
    setMode(Modes.add);
  }

  function handleAddUser() {
    firebase.database().ref('/users').push(userProfile.value)
      .then(() => {
        setMode(Modes.read);
        setUserProfile(userInitialValue);
        setIsActiveSave(true);
      })
      .catch((e) => console.log(e));
  }

  function handleChange(type) {
    return e => {
      if (mode === Modes.edit) {
        setIsActiveSave(false);
      }
      setUserProfile({...userProfile, value: {...userProfile.value, [type]: e.target.value}});
    };
  }

  function handleCancel() {
    setMode(Modes.read);
    setUserProfile(userInitialValue);
    setIsActiveSave(true);
  }

  function handleSelectUser(user) {
    return () => {
      setMode(Modes.edit);
      setUserProfile(user);
    };
  }

  function handleRemoveUser() {
    firebase.database().ref(`/users/${userProfile.id}`).remove()
      .then(() => {
        setMode(Modes.read);
        setUserProfile(userInitialValue);
        setIsActiveSave(true);
      });
  }
  function handleUpdateUser() {
    firebase.database().ref(`/users/${userProfile.id}`).update(userProfile.value)
      .then(() => {
        setMode(Modes.read);
        setUserProfile(userInitialValue);
        setIsActiveSave(true);
      });
  }

  return <div className="roles">
    <Header title={'User manager'}/>
    <Container className={classes.container} maxWidth={'lg'}>
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={handleAddNewUser}
      >
        New user
      </Button>
    </Container>
    {
      mode !== Modes.add
        ? <Container className={classes.container} maxWidth={'lg'}>
          <div className={classes.userList}>
            {
              usersList.map((user) => {
                return <div key={user.id} onClick={handleSelectUser(user)}>{user.value.nickname}</div>;
              })
            }
          </div>
          <div className={classes.userForm}>
            {
              userProfile.id && <>
                <TextField
                  value={userProfile.value.nickname}
                  label={'User login'}
                  className={classes.input}
                  onChange={handleChange('nickname')}
                />
                <TextField
                  value={userProfile.value.password}
                  label={'User password'}
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
                    >
                      {
                        roleList.map(role => {
                          return <MenuItem value={role.name}>{role.name}</MenuItem>;
                        })
                      }
                    </Select>
                  </FormControl>
                }

                <div>
                  <Button
                    variant={'contained'}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={'contained'}
                    onClick={handleRemoveUser}
                    color={'secondary'}
                  >
                    Remove
                  </Button>
                  <Button
                    color={'primary'}
                    variant={'contained'}
                    onClick={handleUpdateUser}
                    disabled={isActiveSave}
                  >
                    Update user
                  </Button>
                </div>

              </>
            }
          </div>

        </Container>
        : <Container className={classes.container} maxWidth={'lg'}>
          <div className={classes.userForm}>
            <TextField
              value={userProfile.value.nickname}
              label={'User login'}
              className={classes.input}
              onChange={handleChange('nickname')}
            />
            <TextField
              value={userProfile.value.password}
              label={'User password'}
              className={classes.input}
              onChange={handleChange('password')}
            />
            {
              <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={userProfile.value.role}
                  onChange={handleChange('role')}
                  label="Role"
                >
                  {
                    roleList.map(role => {
                      return <MenuItem value={role.name}>{role.name}</MenuItem>;
                    })
                  }
                </Select>
              </FormControl>
            }

            <Button
              variant={'contained'}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              color={'primary'}
              variant={'contained'}
              onClick={handleAddUser}
              disabled={mode === Modes.read}
            >
              Add user
            </Button>
          </div>
        </Container>
    }

  </div>;
};
