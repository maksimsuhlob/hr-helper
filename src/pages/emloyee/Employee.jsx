import React, {useEffect, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import Layout from '../../components/layout/Layout';
import ReferenceBookLayout from '../../components/reference-book-layout/ReferenceBookLayout';
import EmployeeForm from './EmployeeForm';

export default function Positions() {
  const [employeesList, setEmployeesList] = useState([]);

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

  return <Layout title={'Employee manager'}>
    <ReferenceBookLayout
      dataList={employeesList}
      addButtonText={'Add employee'}
      newButtonText={'New employee'}
      updateButtonText={'Update employee'}
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
