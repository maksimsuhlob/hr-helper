import React, {useEffect, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import Layout from '../../components/layout/Layout';
import ReferenceBookLayout from '../../components/reference-book-layout/ReferenceBookLayout';
import EmployeeForm from './EmployeeForm';
import {modifyData} from '../../utils/modifyData';
import {useIntl} from 'react-intl';

export default function Positions() {
  const [employeesList, setEmployeesList] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    firebase.database().ref(`/employees`)
      .on('value', data => {
        setEmployeesList(modifyData(data));
      });

    return () => {
      firebase.database().ref(`/employees`).off();
    };
  }, []);

  function handleAddEmployee(model) {
    firebase.database().ref('/employees').push(model.value)
      .catch((e) => console.log(e));
  }

  function handleRemoveEmployee(model) {
    firebase.database().ref(`/employees/${model.id}`).remove()
      .catch((e) => console.log(e));
  }

  function handleUpdateEmployee(model) {
    firebase.database().ref(`/employees/${model.id}`).update(model.value)
      .catch((e) => console.log(e));
  }

  function isValid(model) {
    return Object.values(model.value).reduce((result, item) => result && Boolean(item), true);
  }

  return <Layout title={intl.formatMessage({
    id: 'employee.title',
    defaultMessage: 'Employee manager'
  })}>
    <ReferenceBookLayout
      dataList={employeesList}
      addButtonText={intl.formatMessage({
        id: 'employee.addButtonText',
        defaultMessage: 'Add employee'
      })}
      newButtonText={intl.formatMessage({
        id: 'employee.newButtonText',
        defaultMessage: 'New employee'
      })}
      updateButtonText={intl.formatMessage({
        id: 'employee.updateButtonText',
        defaultMessage: 'Update employee'
      })}
      dataViewParam={['lastName', 'firstName']}
      validator={isValid}
      onAdd={handleAddEmployee}
      onUpdate={handleUpdateEmployee}
      onRemove={handleRemoveEmployee}
      FormComponent={EmployeeForm}
      sortParam={'lastName'}
    />
  </Layout>;
};
