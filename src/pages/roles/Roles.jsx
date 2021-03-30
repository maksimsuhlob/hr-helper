import React, {useEffect, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import Layout from '../../components/layout/Layout';
import ReferenceBookLayout from '../../components/reference-book-layout/ReferenceBookLayout';
import RolesForm from './RolesForm';

export default function Roles() {
  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    firebase.database().ref(`/roles`)
      .on('value', data => {
        const users = [];
        const usersData = data.val();
        for (let key in data.val()) {
          users.push({
            id: key,
            value: usersData[key]
          });
        }
        setRoleList(users);
      });
    return () => firebase.database().ref(`/roles`).off();
  }, []);

  function handleRemoveRole(model) {
    firebase.database().ref(`/roles/${model.id}`).remove()
      .catch(e => console.log(e));
  }

  function handleUpdateRole(model) {
    firebase.database().ref(`/roles/${model.id}`).update(model.value)
      .catch(e => console.log(e));
  }


  function handleAddRole(model) {
    firebase.database().ref(`/roles`).push(model.value)
      .catch(e => console.log(e));
  }

  function isValid(model) {
    return !!(model.value.name && model.value.permissions.length);
  }

  return <Layout title={'Roles manager'}>
    <ReferenceBookLayout
      dataList={roleList}
      addButtonText={'Add role'}
      newButtonText={'New role'}
      updateButtonText={'Update role'}
      validator={isValid}
      onAdd={handleAddRole}
      onUpdate={handleUpdateRole}
      onRemove={handleRemoveRole}
      FormComponent={RolesForm}
      sortParam={'name'}
    />
  </Layout>;
};
