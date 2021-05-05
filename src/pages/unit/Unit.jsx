import React, {useEffect, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import Layout from '../../components/layout/Layout';
import ReferenceBookLayout from '../../components/reference-book-layout/ReferenceBookLayout';
import UnitForm from './UnitForm';
import {modifyData} from '../../utils/modifyData';
import {useIntl} from 'react-intl';

export default function Unit() {
  const [unitsList, setUnitsList] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    firebase.database().ref(`/units`)
      .on('value', data => {
        setUnitsList(modifyData(data));
      });

    return () => {
      firebase.database().ref(`/units`).off();
    };
  }, []);


  function handleAddUnit(model) {
    firebase.database().ref('/units').push(model.value)
      .catch((e) => console.log(e));
  }

  function handleRemoveUnit(model) {
    firebase.database().ref(`/units/${model.id}`).remove()
      .catch((e) => console.log(e));
  }

  function handleUpdateUnit(model) {
    firebase.database().ref(`/units/${model.id}`).update(model.value)
      .catch((e) => console.log(e));
  }

  function isValid(model) {
    return Object.values(model.value).reduce((result, item) => result && Boolean(item), true);
  }

  return <Layout title={intl.formatMessage({
    id: 'unit.title',
    defaultMessage: 'Unit manager'
  })}>
    <ReferenceBookLayout
      dataList={unitsList}
      addButtonText={intl.formatMessage({
        id: 'unit.addButtonText',
        defaultMessage: 'Add unit'
      })}
      newButtonText={intl.formatMessage({
        id: 'unit.newButtonText',
        defaultMessage: 'New unit'
      })}
      updateButtonText={intl.formatMessage({
        id: 'unit.updateButtonText',
        defaultMessage: 'Update unit'
      })}
      validator={isValid}
      onAdd={handleAddUnit}
      onUpdate={handleUpdateUnit}
      onRemove={handleRemoveUnit}
      FormComponent={UnitForm}
      sortParam={'name'}
    />
  </Layout>;
};
