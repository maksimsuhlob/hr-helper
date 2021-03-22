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
const employeeInitialValue = {
  id: null,
  value: {
    firstName: '',
    lastName: '',
    patronymicName: '',
    birthDate: '',
    address: '',
    homePhone: '',
    mobilePhone: '',
    personalId: '',
    passportNumber: '',
    passportDate: '',
    passportExpirationDate: '',
    passportAgency: '',
    education: [],
    workExperience: []
  }
};
export default function Positions() {
  const classes = useStyles();
  const [mode, setMode] = useState(Modes.read);
  const [employeesList, setEmployeesList] = useState([]);
  const [employee, setEmployee] = useState(employeeInitialValue);
  const [isActiveSave, setIsActiveSave] = useState(true);

  useEffect(() => {
    firebase.database().ref(`/employees`)
      .on('value', data => {
        const users = [];
        const usersData = data.val();
        for (let key in data.val()) {
          users.push({
            id: key,
            value: usersData[key]
          });
        }
        setEmployeesList(users);
      });

    return () => {
      firebase.database().ref(`/employees`).off();
    };
  }, []);

  function handleAddNewEmployee() {
    setMode(Modes.add);
  }

  function handleAddEmployee() {
    firebase.database().ref('/employees').push(employee.value)
      .then(() => {
        setMode(Modes.read);
        setEmployee(employeeInitialValue);
        setIsActiveSave(true);
      })
      .catch((e) => console.log(e));
  }

  function handleChange(type) {
    return e => {
      if (mode === Modes.edit) {
        setIsActiveSave(false);
      }
      setEmployee({...employee, value: {...employee.value, [type]: e.target.value}});
    };
  }

  function handleCancel() {
    setMode(Modes.read);
    setEmployee(employeeInitialValue);
    setIsActiveSave(true);
  }

  function handleSelectEmployee(user) {
    return () => {
      setMode(Modes.edit);
      setEmployee(user);
    };
  }

  function handleRemoveUser() {
    firebase.database().ref(`/employees/${employee.id}`).remove()
      .then(() => {
        setMode(Modes.read);
        setEmployee(employeeInitialValue);
        setIsActiveSave(true);
      });
  }

  function handleUpdateEmployee() {
    firebase.database().ref(`/employees/${employee.id}`).update(employee.value)
      .then(() => {
        setMode(Modes.read);
        setEmployee(employeeInitialValue);
        setIsActiveSave(true);
      });
  }

  function renderEmployeeForm() {
    return <div className={classes.userForm}>
      <TextField
        value={employee.value.firstName}
        label={'First name'}
        className={classes.input}
        onChange={handleChange('firstName')}
      />
      <TextField
        value={employee.value.lastName}
        label={'Last name'}
        className={classes.input}
        onChange={handleChange('lastName')}
      />
      <TextField
        value={employee.value.patronymicName}
        label={'Patronymic name'}
        className={classes.input}
        onChange={handleChange('patronymicName')}
      />
      <TextField
        label="Birthday"
        type="date"
        className={classes.input}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        value={employee.value.address}
        label={'Address'}
        className={classes.input}
        onChange={handleChange('address')}
      />
      <TextField
        value={employee.value.homePhone}
        label={'Home phone'}
        className={classes.input}
        onChange={handleChange('homePhone')}
      />
      <TextField
        value={employee.value.mobilePhone}
        label={'Mobile phone'}
        className={classes.input}
        onChange={handleChange('mobilePhone')}
      />
      <TextField
        value={employee.value.personalId}
        label={'Personal ID'}
        className={classes.input}
        onChange={handleChange('personalId')}
      />
      <TextField
        value={employee.value.passportNumber}
        label={'Passport number'}
        className={classes.input}
        onChange={handleChange('passportNumber')}
      />
      <TextField
        label="Passport date"
        type="date"
        className={classes.input}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Passport expiration date"
        type="date"
        className={classes.input}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        value={employee.value.passportAgency}
        label={'Passport agency'}
        className={classes.input}
        onChange={handleChange('passportAgency')}
      />
    </div>;
  }

  return <div className="roles">
    <Header title={'Employee manager'}/>
    <Container className={classes.container} maxWidth={'lg'}>
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={handleAddNewEmployee}
      >
        New employee
      </Button>
    </Container>
    {
      mode !== Modes.add
        ? <Container className={classes.container} maxWidth={'lg'}>
          <div className={classes.userList}>
            {
              employeesList.map((employee) => {
                return <div
                  key={employee.id}
                  onClick={handleSelectEmployee(employee)}
                >
                  {`${employee.value.firstName} ${employee.value.lastName}`}
                </div>;
              })
            }
          </div>
          <div className={classes.userForm}>
            {
              employee.id && <>
                {renderEmployeeForm()}

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
                    onClick={handleUpdateEmployee}
                    disabled={isActiveSave}
                  >
                    Update employee
                  </Button>
                </div>

              </>
            }
          </div>

        </Container>
        : <Container className={classes.container} maxWidth={'lg'}>
          {renderEmployeeForm()}

          <Button
            variant={'contained'}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            color={'primary'}
            variant={'contained'}
            onClick={handleAddEmployee}
            disabled={mode === Modes.read}
          >
            Add employee
          </Button>
        </Container>
    }

  </div>;
};
