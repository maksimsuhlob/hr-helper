import React, {useEffect, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import Layout from '../../components/layout/Layout';
import UserForm from './UserForm';
import ReferenceBookLayout from '../../components/reference-book-layout/ReferenceBookLayout';
import {modifyData} from '../../utils/modifyData';

export default function User() {
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    firebase.database().ref(`/users`)
      .on('value', data => {
        setUsersList(modifyData(data));
      });

    return () => {
      firebase.database().ref(`/users`).off();
    };
  }, []);


  function isValid(model) {
    return Object.values(model.value).reduce((result, item) => result && Boolean(item), true);
  }

  function handleAddUser(model) {
    firebase.database().ref('/users').push(model.value)
      .catch((e) => console.log(e));
  }


  function handleRemoveUser(model) {
    firebase.database().ref(`/users/${model.id}`).remove()
      .catch((e) => {
        console.log(e);
      });
  }

  function handleUpdateUser(model) {
    firebase.database().ref(`/users/${model.id}`).update(model.value)
      .catch((e) => {
        console.log(e);
      });
  }

  return <Layout title={'User manager'}>
    <ReferenceBookLayout
      dataList={usersList}
      addButtonText={'Add user'}
      newButtonText={'New User'}
      updateButtonText={'Update user'}
      dataViewParam={['nickname']}
      validator={isValid}
      onAdd={handleAddUser}
      onUpdate={handleUpdateUser}
      onRemove={handleRemoveUser}
      FormComponent={UserForm}
      sortParam={'nickname'}
    />
  </Layout>;
}
