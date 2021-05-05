import React, {useEffect, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import Layout from '../../components/layout/Layout';
import ReferenceBookLayout from '../../components/reference-book-layout/ReferenceBookLayout';
import PositionForm from './PositionForm';
import {modifyData} from '../../utils/modifyData';
import {useIntl} from 'react-intl';

export default function Positions() {
  const [positionsList, setPositionsList] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    firebase.database().ref(`/positions`)
      .on('value', data => {
        setPositionsList(modifyData(data));
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

  return <Layout title={intl.formatMessage({
          id: 'position.title',
          defaultMessage: 'Position manager'
        })}>
    <ReferenceBookLayout
      dataList={positionsList}
      addButtonText={intl.formatMessage({
          id: 'position.addButtonText',
          defaultMessage: 'Add position'
        })}
      newButtonText={intl.formatMessage({
          id: 'position.newButtonText',
          defaultMessage: 'New position'
        })}
      updateButtonText={intl.formatMessage({
          id: 'position.updateButtonText',
          defaultMessage: 'Update position'
        })}
      validator={isValid}
      onAdd={handleAddPosition}
      onUpdate={handleUpdatePosition}
      onRemove={handleRemovePosition}
      FormComponent={PositionForm}
      sortParam={'name'}
    />
  </Layout>;
};
