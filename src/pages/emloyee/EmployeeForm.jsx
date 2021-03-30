import React, {useEffect, useState} from 'react';
import {FormControl, IconButton, InputLabel, makeStyles, MenuItem, Select, TextField} from '@material-ui/core';
import EducationForm from './EducationForm';
import PlusIcon from '@material-ui/icons/Add';
import EducationItem from './EducationItem';
import firebase from 'firebase';
import {modifyData} from '../../utils/modifyData';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: 20
  },
  userForm: {
    display: 'flex',
    flexDirection: 'column',
    flex: "1 1 auto",
    maxWidth: '69%',
    marginBottom: 20
  },
  educationHeader: {
    display: 'flex',
    justifyContent: 'space-between'
  }
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
//todo add  work experience
export default function EmployeeForm({model = employeeInitialValue, isInvalid, onChange}) {
  const classes = useStyles();
  const [employee, setEmployee] = useState(employeeInitialValue);
  const [isAddInstitution, setIsAddInstitution] = useState(false);
  const [positionList, setPositionList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  useEffect(() => {
    firebase.database().ref(`/positions`)
      .on('value', data => {
        setPositionList(modifyData(data));
      });
    firebase.database().ref(`/units`)
      .on('value', data => {
        setUnitList(modifyData(data));
      });
    return () => {
      firebase.database().ref(`/positions`).off();
      firebase.database().ref(`/units`).off();
    };
  }, []);
  useEffect(() => {
    setEmployee(model);
  }, [model]);

  function handleChange(type) {
    return e => {
      const newEmployee = {...employee, value: {...employee.value, [type]: e.target.value}};
      setEmployee(newEmployee);
      onChange && onChange(newEmployee);
    };
  }

  function handleAddInstitution() {
    setIsAddInstitution(true);
  }

  function handleRemoveInstitution(remInst) {
    const newInstitutionList = employee.value.education.filter(item => item.id !== remInst.id);
    onChange && onChange({
      ...employee,
      value: {
        ...employee.value,
        education: newInstitutionList
      }
    });
  }

  function handleChangeInstitution(isNew) {
    return model => {
      const education = employee.value.education || [];
      if (isNew) {
        education.push(model);
        const newEmployee = {
          ...employee,
          value: {
            ...employee.value,
            education: education
          }
        };
        setEmployee(newEmployee);
        onChange && onChange(newEmployee);

        setIsAddInstitution(false);
      } else {
        const newInstitutionList = employee.value.education.reduce((acc, item) => {
          if (item.id !== model.id) {
            acc.push(item);
            return acc;
          }
          acc.push(model);
          return acc;
        }, []);
        const newEmployee = {
          ...employee,
          value: {
            ...employee.value,
            education: newInstitutionList
          }
        };
        setEmployee(newEmployee);
        onChange && onChange(newEmployee);
      }
    };
  }

  function handleCancelAddInstitution() {
    setIsAddInstitution(false);
  }

  return <div className={classes.userForm}>
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
    <FormControl
      variant="outlined"
      className={classes.input}
    >
      <InputLabel id="demo-simple-select-outlined-label">Position</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        value={employee.value.position || ''}
        onChange={handleChange('position')}
        label="Position"
        error={isInvalid}
      >
        {
          positionList.map(position => {
            return <MenuItem key={position.id} value={position.id}>{position.value.name}</MenuItem>;
          })
        }
      </Select>
    </FormControl>
    <FormControl
      variant="outlined"
      className={classes.input}
    >
      <InputLabel id="unit-label">Unit</InputLabel>
      <Select
        labelId="unit-label"
        value={employee.value.unit || ''}
        onChange={handleChange('unit')}
        label="Unit"
        error={isInvalid}
      >
        {
          unitList.map(unit => {
            return <MenuItem key={unit.id} value={unit.id}>{unit.value.name}</MenuItem>;
          })
        }
      </Select>
    </FormControl>
    <div>
      <div className={classes.educationHeader}>
        <p>Education</p>

        <IconButton
          aria-label="Add institution"
          onClick={handleAddInstitution}
        >
          <PlusIcon/>
        </IconButton>
      </div>

      {
        isAddInstitution && <EducationForm
          onChange={handleChangeInstitution(true)}
          onCancel={handleCancelAddInstitution}
        />
      }
      {
        employee.value.education && employee.value.education.map((item) => {
          return <EducationItem
            key={item.id}
            model={item}
            onChange={handleChangeInstitution(false)}
            onRemove={handleRemoveInstitution}
          />;
        })
      }
    </div>
  </div>;
}
