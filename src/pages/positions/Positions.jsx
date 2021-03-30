import React, {useEffect, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import Layout from '../../components/layout/Layout';
import ReferenceBookLayout from '../../components/reference-book-layout/ReferenceBookLayout';
import PositionForm from './PositionForm';

export default function Positions() {
  const [positionsList, setPositionsList] = useState([]);

  useEffect(() => {
    firebase.database().ref(`/positions`)
      .on('value', data => {
        const users = [];
        const usersData = data.val();
        for (let key in data.val()) {
          users.push({
            id: key,
            value: usersData[key]
          });
        }
        setPositionsList(users);
      });

    return () => {
      firebase.database().ref(`/positions`).off();
    };
  }, []);

  function handleAddPosition(model) {
    firebase.database().ref('/positions').push(model.value)
      .catch((e) => console.log(e));
  }

  function handleRemovePosition(model) {
    firebase.database().ref(`/positions/${model.id}`).remove()
      .catch((e) => console.log(e));
  }

  function handleUpdatePosition(model) {
    firebase.database().ref(`/positions/${model.id}`).update(model.value)
      .catch((e) => console.log(e));
  }

  function isValid(model) {
    return Object.values(model.value).reduce((result, item) => result && Boolean(item), true);
  }

  return <Layout title={'Position manager'}>
    <ReferenceBookLayout
      dataList={positionsList}
      addButtonText={'Add role'}
      newButtonText={'New role'}
      updateButtonText={'Update role'}
      validator={isValid}
      onAdd={handleAddPosition}
      onUpdate={handleUpdatePosition}
      onRemove={handleRemovePosition}
      FormComponent={PositionForm}
      sortParam={'name'}
    />
  </Layout>;
};
