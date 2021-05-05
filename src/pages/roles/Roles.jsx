import React, {useEffect, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import Layout from '../../components/layout/Layout';
import ReferenceBookLayout from '../../components/reference-book-layout/ReferenceBookLayout';
import RolesForm from './RolesForm';
import {modifyData} from '../../utils/modifyData';
import {useIntl} from 'react-intl';

export default function Roles() {
  const [roleList, setRoleList] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    firebase.database().ref(`/roles`)
      .on('value', data => {
        setRoleList(modifyData(data));
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

  return <Layout title={intl.formatMessage({
        id: 'roles.title',
        defaultMessage: 'Roles manager'
      })}>
    <ReferenceBookLayout
      dataList={roleList}
      addButtonText={intl.formatMessage({
        id: 'roles.addButtonText',
        defaultMessage: 'Add role'
      })}
      newButtonText={intl.formatMessage({
        id: 'roles.newButtonText',
        defaultMessage: 'New role'
      })}
      updateButtonText={intl.formatMessage({
        id: 'roles.updateButtonText',
        defaultMessage: 'Update role'
      })}
      validator={isValid}
      onAdd={handleAddRole}
      onUpdate={handleUpdateRole}
      onRemove={handleRemoveRole}
      FormComponent={RolesForm}
      sortParam={'name'}
    />
  </Layout>;
};
