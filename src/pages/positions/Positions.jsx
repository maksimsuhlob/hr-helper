import React, {useEffect, useState} from 'react';
import {
  Button,
  Container,
  makeStyles,
  TextField
} from '@material-ui/core';
import './style.scss';
import firebase from 'firebase/app';
import 'firebase/database';
import Header from '../../components/header/Header';

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
const positionInitialValue = {
  id: null,
  value: {
    name: '',
    description: ''
  }
};
export default function Positions() {
  const classes = useStyles();
  const [mode, setMode] = useState(Modes.read);
  const [positionsList, setPositionsList] = useState([]);
  const [position, setPosition] = useState(positionInitialValue);
  const [isActiveSave, setIsActiveSave] = useState(true);
  useEffect(() => {
    firebase.database().ref(`/positions`)
      .on('value', data => {
        const users = [];
        const usersData = data.val();
        for (let key in data.val()) {
          users.push({
            id: key,
            value: usersData[key]
          });
        }
        setPositionsList(users);
      });

    return () => {
      firebase.database().ref(`/positions`).off();
    };
  }, []);

  function handleAddNewUser() {
    setMode(Modes.add);
  }

  function handleAddPosition() {
    firebase.database().ref('/positions').push(position.value)
      .then(() => {
        setMode(Modes.read);
        setPosition(positionInitialValue);
        setIsActiveSave(true);
      })
      .catch((e) => console.log(e));
  }

  function handleChange(type) {
    return e => {
      if (mode === Modes.edit) {
        setIsActiveSave(false);
      }
      setPosition({...position, value: {...position.value, [type]: e.target.value}});
    };
  }

  function handleCancel() {
    setMode(Modes.read);
    setPosition(positionInitialValue);
    setIsActiveSave(true);
  }

  function handleSelectPosition(user) {
    return () => {
      setMode(Modes.edit);
      setPosition(user);
    };
  }

  function handleRemoveUser() {
    firebase.database().ref(`/positions/${position.id}`).remove()
      .then(() => {
        setMode(Modes.read);
        setPosition(positionInitialValue);
        setIsActiveSave(true);
      });
  }
  function handleUpdateUser() {
    firebase.database().ref(`/positions/${position.id}`).update(position.value)
      .then(() => {
        setMode(Modes.read);
        setPosition(positionInitialValue);
        setIsActiveSave(true);
      });
  }

  return <div className="roles">
    <Header title={'Position manager'}/>
    <Container className={classes.container} maxWidth={'lg'}>
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={handleAddNewUser}
      >
        New position
      </Button>
    </Container>
    {
      mode !== Modes.add
        ? <Container className={classes.container} maxWidth={'lg'}>
          <div className={classes.userList}>
            {
              positionsList.map((position) => {
                return <div key={position.id} onClick={handleSelectPosition(position)}>{position.value.name}</div>;
              })
            }
          </div>
          <div className={classes.userForm}>
            {
              position.id && <>
                <TextField
                  value={position.value.name}
                  label={'Position'}
                  className={classes.input}
                  onChange={handleChange('name')}
                />
                <TextField
                  value={position.value.description}
                  label={'Description'}
                  className={classes.input}
                  onChange={handleChange('description')}
                />

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
              value={position.value.name}
              label={'Position'}
              className={classes.input}
              onChange={handleChange('name')}
            />
            <TextField
              value={position.value.description}
              label={'Description'}
              className={classes.input}
              onChange={handleChange('description')}
            />

            <Button
              variant={'contained'}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              color={'primary'}
              variant={'contained'}
              onClick={handleAddPosition}
              disabled={mode === Modes.read}
            >
              Add position
            </Button>
          </div>
        </Container>
    }

  </div>;
};
