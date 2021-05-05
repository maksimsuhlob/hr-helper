import React, {useEffect, useState} from 'react';
import {makeStyles, TextField} from '@material-ui/core';
import {useIntl} from 'react-intl';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: 20
  }
}));
const unitInitialValue = {
  id: null,
  value: {
    name: '',
    description: ''
  }
};
export default function UnitForm({model = unitInitialValue, isInvalid, onChange}) {
  const classes = useStyles();
  const [unit, setUnit] = useState(unitInitialValue);
  const intl = useIntl();
  useEffect(() => {
    setUnit(model);
  }, [model]);

  function handleChange(type) {
    return e => {
      const newUnit = {...unit, value: {...unit.value, [type]: e.target.value}};
      setUnit(newUnit);
      onChange && onChange(newUnit);
    };
  }

  return <>
    <TextField
      value={unit.value.name}
      label={intl.formatMessage({
        id: 'unit.form.name',
        defaultMessage: 'Unit name'
      })}
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('name')}
    />
    <TextField
      value={unit.value.description}
      label={intl.formatMessage({
        id: 'unit.form.description',
        defaultMessage: 'Description'
      })}
      multiline
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('description')}
    />
  </>;
}
