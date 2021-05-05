import React, {useEffect, useState} from 'react';
import {FormControl, InputLabel, makeStyles, MenuItem, Select, TextField} from '@material-ui/core';
import firebase from 'firebase';
import {modifyData} from '../../utils/modifyData';
import CommonOrganisationForm from '../../components/CommonOrganisationForm/CommonOrganisationForm';
import EducationForm from './EducationForm';
import WorkExpForm from './WorkExpForm';
import {useIntl} from 'react-intl';

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

export default function EmployeeForm({model = employeeInitialValue, isInvalid, onChange}) {
  const classes = useStyles();
  const intl = useIntl();
  const [employee, setEmployee] = useState(employeeInitialValue);
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

  function handleRemoveWorkExp(wExp) {
    const newWExpList = employee.value.education.filter(item => item.id !== wExp.id);
    onChange && onChange({
      ...employee,
      value: {
        ...employee.value,
        workExperience: newWExpList
      }
    });
  }

  function handleChangeWorkExp(isNew) {
    return model => {
      const wExp = employee.value.workExperience || [];
      if (isNew) {
        wExp.push(model);
        const newEmployee = {
          ...employee,
          value: {
            ...employee.value,
            workExperience: wExp
          }
        };
        setEmployee(newEmployee);
        onChange && onChange(newEmployee);
      } else {
        const newWExpList = employee.value.education.reduce((acc, item) => {
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
            workExperience: newWExpList
          }
        };
        setEmployee(newEmployee);
        onChange && onChange(newEmployee);
      }
    };
  }


  return <div className={classes.userForm}>
    <TextField
      value={employee.value.firstName}
      label={intl.formatMessage({
        id: 'employee.form.firstName',
        defaultMessage: 'First name'
      })}
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('firstName')}
    />
    <TextField
      value={employee.value.lastName}
      label={intl.formatMessage({
        id: 'employee.form.lastName',
        defaultMessage: 'Last name'
      })}
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('lastName')}
    />
    <TextField
      value={employee.value.patronymicName}
      label={intl.formatMessage({
        id: 'employee.form.patronymicName',
        defaultMessage: 'Patronymic name'
      })}
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('patronymicName')}
    />
    <TextField
      label={intl.formatMessage({
        id: 'employee.form.birthDate',
        defaultMessage: 'Birthday'
      })}
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
      label={intl.formatMessage({
        id: 'employee.form.address',
        defaultMessage: 'Address'
      })}
      multiline
      error={isInvalid}
      className={classes.input}
      onChange={handleChange('address')}
    />
    <TextField
      value={employee.value.homePhone}
      label={intl.formatMessage({
        id: 'employee.form.homePhone',
        defaultMessage: 'Home phone'
      })}
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('homePhone')}
    />
    <TextField
      value={employee.value.mobilePhone}
      label={intl.formatMessage({
        id: 'employee.form.mobilePhone',
        defaultMessage: 'Mobile phone'
      })}
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('mobilePhone')}
    />
    <TextField
      value={employee.value.personalId}
      label={intl.formatMessage({
        id: 'employee.form.personalId',
        defaultMessage: 'Personal ID'
      })}
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('personalId')}
    />
    <TextField
      value={employee.value.passportNumber}
      label={intl.formatMessage({
        id: 'employee.form.passportNumber',
        defaultMessage: 'Passport number'
      })}
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('passportNumber')}
    />
    <TextField
      label={intl.formatMessage({
        id: 'employee.form.passportDate',
        defaultMessage: 'Passport date'
      })}
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
      label={intl.formatMessage({
        id: 'employee.form.passportExpirationDate',
        defaultMessage: 'Passport expiration date'
      })}
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
      label={intl.formatMessage({
        id: 'employee.form.passportAgency',
        defaultMessage: 'Passport agency'
      })}
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('passportAgency')}
    />
    <FormControl
      variant="outlined"
      className={classes.input}
    >
      <InputLabel id="demo-simple-select-outlined-label">
        {intl.formatMessage({
          id: 'employee.form.position',
          defaultMessage: 'Position'
        })}
      </InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        value={employee.value.position || ''}
        onChange={handleChange('position')}
        label={intl.formatMessage({
          id: 'employee.form.position',
          defaultMessage: 'Position'
        })}
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
      <InputLabel id="unit-label">
        {intl.formatMessage({
          id: 'employee.form.unit',
          defaultMessage: 'Unit'
        })}
      </InputLabel>
      <Select
        labelId="unit-label"
        value={employee.value.unit || ''}
        onChange={handleChange('unit')}
        label={intl.formatMessage({
          id: 'employee.form.unit',
          defaultMessage: 'Unit'
        })}
        error={isInvalid}
      >
        {
          unitList.map(unit => {
            return <MenuItem key={unit.id} value={unit.id}>{unit.value.name}</MenuItem>;
          })
        }
      </Select>
    </FormControl>
    <CommonOrganisationForm
      title={intl.formatMessage({
        id: 'employee.form.education',
        defaultMessage: 'Education'
      })}
      onNewSave={handleChangeInstitution(true)}
      onEditSave={handleChangeInstitution(false)}
      onRemove={handleRemoveInstitution}
      value={employee.value.education}
      addLabel={intl.formatMessage({
        id: 'employee.form.education.add',
        defaultMessage: 'Add institution'
      })}
      FormComponent={EducationForm}
      nameParams={['name', 'type']}
    />
    <CommonOrganisationForm
      title={intl.formatMessage({
        id: 'employee.form.workExperience',
        defaultMessage: 'Work experience'
      })}
      onNewSave={handleChangeWorkExp(true)}
      onEditSave={handleChangeWorkExp(false)}
      onRemove={handleRemoveWorkExp}
      value={employee.value.workExperience}
      addLabel={intl.formatMessage({
        id: 'employee.form.workExperience.add',
        defaultMessage: 'Add Work place'
      })}
      FormComponent={WorkExpForm}
      nameParams={['name', 'position']}
    />
  </div>;
}
