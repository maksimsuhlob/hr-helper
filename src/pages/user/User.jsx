import React, {useContext, useEffect, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import Layout from '../../components/layout/Layout';
import UserForm from './UserForm';
import ReferenceBookLayout from '../../components/reference-book-layout/ReferenceBookLayout';
import {modifyData} from '../../utils/modifyData';
import {AppContext} from '../../utils/appContext';
import {useIntl} from 'react-intl';

export default function User() {
  const [usersList, setUsersList] = useState([]);
  const {state: {profile}, addAlert} = useContext(AppContext);
  const intl = useIntl();

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
    firebase.database().ref(`/users`).orderByChild('nickname').equalTo(model.value.nickname).get()
      .then((data) => {
        if (data.val()) {
          addAlert(intl.formatMessage({
            id: 'user.notification',
            defaultMessage: 'User already exists'
          }));
          return;
        }
        firebase.database().ref('/users').push(model.value)
          .catch((e) => console.log(e));
      })
      .catch(() => {
        console.log('error');
      });
  }


  function handleRemoveUser(model) {
    if (model.value.nickname === profile.nickname) {
      addAlert(
        intl.formatMessage({
          id: 'user.notification.delete',
          defaultMessage: 'You cannot delete this user'
        }));
      return;
    }
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

  return <Layout title={intl.formatMessage({
    id: 'user.title',
    defaultMessage: 'User manager'
  })}>
    <ReferenceBookLayout
      dataList={usersList}
      addButtonText={intl.formatMessage({
        id: 'user.addButtonText',
        defaultMessage: 'Add user'
      })}
      newButtonText={intl.formatMessage({
        id: 'user.newButtonText',
        defaultMessage: 'New User'
      })}
      updateButtonText={intl.formatMessage({
        id: 'user.updateButtonText',
        defaultMessage: 'Update user'
      })}
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
