import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Container, FormControlLabel, makeStyles, TextField,} from '@material-ui/core';
import './style.scss';
import firebase from 'firebase/app';
import 'firebase/database';
import Header from '../../components/header/Header';
import {PermissionKeys} from '../../utils/constants';

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

const Modes = {
  read: 'read',
  add: 'add',
  edit: 'edit',
};

export default function Roles() {
  const classes = useStyles();
  const [roleList, setRoleList] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRole, setNewRole] = useState({name: '', permissions: []});
  const [mode, setMode] = useState(Modes.read);
  useEffect(() => {
    firebase.database().ref(`/roles`)
      .on('value', data => {
        console.log(data.val());

        setRoleList(Object.values(data.val()));
      });
    return () => firebase.database().ref(`/roles`).off();
  }, []);

  function handleSelectRole(role) {
    return () => {
      setSelectedRole(role);
    };
  }

  function handleChangePermission(permission) {
    return e => {
      let newPermissions;
      if (e.target.checked) {
        if (mode === Modes.add) {
          newPermissions = [...newRole.permissions, permission];
        } else {
          newPermissions = [...selectedRole.permissions, permission];
        }
      } else {
        if (mode === Modes.add) {
          newPermissions = newRole.permissions.filter(item => item !== permission);
        } else {
          newPermissions = selectedRole.permissions.filter(item => item !== permission);
        }
      }
      if (mode === Modes.add) {
        setNewRole({...newRole, permissions: newPermissions});
      } else {
        setSelectedRole({...selectedRole, permissions: newPermissions});
      }
      if (selectedRole) {
        setMode(Modes.edit);
      }
    };
  }

  function handleCancelEdit() {
    setSelectedRole(null);
    setMode(Modes.read);
  }

  function handleRemoveRole() {
    firebase.database().ref(`/roles/${selectedRole.name}`).remove()
      .then(() => {
        setMode(Modes.read);
        setSelectedRole(null);
      })
      .catch(e => console.log(e));
  }

  function handleUpdateRole() {
    firebase.database().ref(`/roles/${selectedRole.name}`).update(selectedRole)
      .catch(e => console.log(e));
  }

  function handleAddNewRole() {
    setMode(Modes.add);
  }

  function handleCancelAddNewRole() {
    setMode(Modes.read);
    setNewRole({name: null, permissions: []});
  }

  function handleSaveRole() {
    firebase.database().ref(`/roles/${newRole.name}`).set(newRole)
      .then(() => {
        setMode(Modes.read);
        setNewRole({name: null, permissions: []});
      })
      .catch(e => console.log(e));
  }

  function handleChangeNewRoleName(e) {
    setNewRole({...newRole, name: e.target.value});
  }

  return <div className="roles">
    <Header title={'Roles manager'}/>
    <Container className={classes.container} maxWidth={'lg'}>
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={handleAddNewRole}
      >
        New role
      </Button>
    </Container>
    {
      mode !== Modes.add
        ? <Container className={classes.container} maxWidth={'lg'}>
          <div className={classes.userList}>
            {
              roleList.map((role, i) => {
                return <div key={i} onClick={handleSelectRole(role)}>{role.name}</div>;
              })
            }
          </div>
          <div className={classes.userForm}>
            {
              selectedRole && <div>
                <TextField
                  value={selectedRole.name}
                  disabled
                  label={'name'}
                  className={classes.input}
                />
                {
                  Object.values(PermissionKeys).map(permission => {
                    return <div key={permission}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedRole.permissions.includes(permission)}
                            onChange={handleChangePermission(permission)}
                            name="checkedB"
                            color="primary"
                          />
                        }
                        label={permission}
                      />
                    </div>;
                  })
                }

                <Button
                  variant={'contained'}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  variant={'contained'}
                  onClick={handleRemoveRole}
                  color={'secondary'}
                >
                  Remove
                </Button>
                <Button
                  color={'primary'}
                  variant={'contained'}
                  onClick={handleUpdateRole}
                  disabled={mode === Modes.read}
                >
                  Update role
                </Button>
              </div>
            }
          </div>

        </Container>
        : <Container className={classes.container} maxWidth={'lg'}>
          <div className={classes.userForm}>
            <TextField
              value={newRole.name}
              label={'name'}
              className={classes.input}
              onChange={handleChangeNewRoleName}
            />
            {
              Object.values(PermissionKeys).map(permission => {
                return <div key={permission}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newRole.permissions.includes(permission)}
                        onChange={handleChangePermission(permission)}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={permission}
                  />
                </div>;
              })
            }

            <Button
              variant={'contained'}
              onClick={handleCancelAddNewRole}
            >
              Cancel
            </Button>
            <Button
              color={'primary'}
              variant={'contained'}
              onClick={handleSaveRole}
              disabled={mode === Modes.read}
            >
              Save role
            </Button>
          </div>
        </Container>
    }

  </div>;
};
