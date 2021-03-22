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
const unitInitialValue = {
  id: null,
  value: {
    name: '',
    description: ''
  }
};
export default function Unit() {
  const classes = useStyles();
  const [mode, setMode] = useState(Modes.read);
  const [unitsList, setUnitsList] = useState([]);
  const [unit, setUnit] = useState(unitInitialValue);
  const [isActiveSave, setIsActiveSave] = useState(true);
  useEffect(() => {
    firebase.database().ref(`/units`)
      .on('value', data => {
        const users = [];
        const usersData = data.val();
        for (let key in data.val()) {
          users.push({
            id: key,
            value: usersData[key]
          });
        }
        setUnitsList(users);
      });

    return () => {
      firebase.database().ref(`/units`).off();
    };
  }, []);

  function handleAddNewUnit() {
    setMode(Modes.add);
  }

  function handleAddUnit() {
    firebase.database().ref('/units').push(unit.value)
      .then(() => {
        setMode(Modes.read);
        setUnit(unitInitialValue);
        setIsActiveSave(true);
      })
      .catch((e) => console.log(e));
  }

  function handleChange(type) {
    return e => {
      if (mode === Modes.edit) {
        setIsActiveSave(false);
      }
      setUnit({...unit, value: {...unit.value, [type]: e.target.value}});
    };
  }

  function handleCancel() {
    setMode(Modes.read);
    setUnit(unitInitialValue);
    setIsActiveSave(true);
  }

  function handleSelectUnit(user) {
    return () => {
      setMode(Modes.edit);
      setUnit(user);
    };
  }

  function handleRemoveUnit() {
    firebase.database().ref(`/units/${unit.id}`).remove()
      .then(() => {
        setMode(Modes.read);
        setUnit(unitInitialValue);
        setIsActiveSave(true);
      });
  }
  function handleUpdateUnit() {
    firebase.database().ref(`/units/${unit.id}`).update(unit.value)
      .then(() => {
        setMode(Modes.read);
        setUnit(unitInitialValue);
        setIsActiveSave(true);
      });
  }

  return <div className="roles">
    <Header title={'Unit manager'}/>
    <Container className={classes.container} maxWidth={'lg'}>
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={handleAddNewUnit}
      >
        New unit
      </Button>
    </Container>
    {
      mode !== Modes.add
        ? <Container className={classes.container} maxWidth={'lg'}>
          <div className={classes.userList}>
            {
              unitsList.map((position) => {
                return <Button
                  key={position.id}
                  variant={'outlined'}
                  onClick={handleSelectUnit(position)}
                >
                  {position.value.name}
                </Button>;
              })
            }
          </div>
          <div className={classes.userForm}>
            {
              unit.id && <>
                <TextField
                  value={unit.value.name}
                  label={'Unit name'}
                  className={classes.input}
                  onChange={handleChange('name')}
                />
                <TextField
                  value={unit.value.description}
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
                    onClick={handleRemoveUnit}
                    color={'secondary'}
                  >
                    Remove
                  </Button>
                  <Button
                    color={'primary'}
                    variant={'contained'}
                    onClick={handleUpdateUnit}
                    disabled={isActiveSave}
                  >
                    Update unit
                  </Button>
                </div>

              </>
            }
          </div>

        </Container>
        : <Container className={classes.container} maxWidth={'lg'}>
          <div className={classes.userForm}>
            <TextField
              value={unit.value.name}
              label={'Position'}
              className={classes.input}
              onChange={handleChange('name')}
            />
            <TextField
              value={unit.value.description}
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
              onClick={handleAddUnit}
              disabled={mode === Modes.read}
            >
              Add unit
            </Button>
          </div>
        </Container>
    }

  </div>;
};
