import React, {useEffect, useState} from 'react';
import {makeStyles, TextField} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: 20
  },
  userForm: {
    display: 'flex',
    flexDirection: 'column',
    flex: "1 1 auto",
    maxWidth: '69%',
  },
}));
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

export default function EmployeeForm({model = employeeInitialValue, isInvalid, onChange}) {
  const classes = useStyles();
  const [employee, setEmployee] = useState(employeeInitialValue);
  useEffect(() => {
    setEmployee(model);
  }, [model]);

  function handleChange(type) {
    return e => {
      const newUnit = {...employee, value: {...employee.value, [type]: e.target.value}};
      setEmployee(newUnit);
      onChange && onChange(newUnit);
    };
  }

  return<div className={classes.userForm}>
      <TextField
        value={employee.value.firstName}
        label={'First name'}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('firstName')}
      />
      <TextField
        value={employee.value.lastName}
        label={'Last name'}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('lastName')}
      />
      <TextField
        value={employee.value.patronymicName}
        label={'Patronymic name'}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('patronymicName')}
      />
      <TextField
        label="Birthday"
        type="date"
        error={isInvalid}
        className={classes.input}
        value={employee.value.birthDate}
        onChange={handleChange('birthDate')}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        value={employee.value.address}
        label={'Address'}
        error={isInvalid}
        className={classes.input}
        onChange={handleChange('address')}
      />
      <TextField
        value={employee.value.homePhone}
        label={'Home phone'}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('homePhone')}
      />
      <TextField
        value={employee.value.mobilePhone}
        label={'Mobile phone'}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('mobilePhone')}
      />
      <TextField
        value={employee.value.personalId}
        label={'Personal ID'}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('personalId')}
      />
      <TextField
        value={employee.value.passportNumber}
        label={'Passport number'}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('passportNumber')}
      />
      <TextField
        label="Passport date"
        type="date"
        className={classes.input}
        error={isInvalid}
        value={employee.value.passportDate}
        onChange={handleChange('passportDate')}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Passport expiration date"
        type="date"
        className={classes.input}
        error={isInvalid}
        value={employee.value.passportExpirationDate}
        onChange={handleChange('passportExpirationDate')}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        value={employee.value.passportAgency}
        label={'Passport agency'}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('passportAgency')}
      />
    </div>;
}
