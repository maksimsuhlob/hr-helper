import React, {useEffect, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import Layout from '../../components/layout/Layout';
import ReferenceBookLayout from '../../components/reference-book-layout/ReferenceBookLayout';
import UnitForm from './UnitForm';

export default function Unit() {
  const [unitsList, setUnitsList] = useState([]);

  useEffect(() => {
    firebase.database().ref(`/units`)
      .on('value', data => {
        const users = [];
        const usersData = data.val();
        for (let key in data.val()) {
          users.push({
            id: key,
            value: usersData[key]
          });
        }
        setUnitsList(users);
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

  return <Layout title={'Unit manager'}>
    <ReferenceBookLayout
      dataList={unitsList}
      addButtonText={'Add unit'}
      newButtonText={'New unit'}
      updateButtonText={'Update unit'}
      validator={isValid}
      onAdd={handleAddUnit}
      onUpdate={handleUpdateUnit}
      onRemove={handleRemoveUnit}
      FormComponent={UnitForm}
    />
  </Layout>;
};
