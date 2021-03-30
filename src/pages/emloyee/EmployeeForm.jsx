import React, {useEffect, useState} from 'react';
import {IconButton, makeStyles, TextField} from '@material-ui/core';
import EducationForm from './EducationForm';
import PlusIcon from '@material-ui/icons/Add';
import EducationItem from './EducationItem';

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
//todo add position, unit, work experience
export default function EmployeeForm({model = employeeInitialValue, isInvalid, onChange}) {
  const classes = useStyles();
  const [employee, setEmployee] = useState(employeeInitialValue);
  const [isAddInstitution, setIsAddInstitution] = useState(false);
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
