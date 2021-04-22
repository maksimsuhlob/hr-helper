import React, {useEffect, useState} from 'react';
import {makeStyles, TextField} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: 20
  }
}));
const positionInitialValue = {
  id: null,
  value: {
    name: '',
    description: ''
  }
};
export default function PositionForm({model = positionInitialValue, isInvalid, onChange}) {
  const classes = useStyles();
  const [position, setPosition] = useState(positionInitialValue);
  useEffect(() => {
    setPosition(model);
  }, [model]);

  function handleChange(type) {
    return e => {
      const newUnit = {...position, value: {...position.value, [type]: e.target.value}};
      setPosition(newUnit);
      onChange && onChange(newUnit);
    };
  }

  return <>
    <TextField
      value={position.value.name}
      label={'Position name'}
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('name')}
    />
    <TextField
      value={position.value.description}
      label={'Description'}
      multiline
      className={classes.input}
      error={isInvalid}
      onChange={handleChange('description')}
    />
  </>;
}
