import React, {useEffect, useState} from 'react';
import {Button, makeStyles, TextField} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: 20
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  button: {
    marginRight: 20
  },
}));
const workExpInitialValue = {
  id: null,
  name: '',
  position: '',
  enrollmentYear: '',
  finishYear: ''
};
export default function WorkExpForm(
  {
    model = workExpInitialValue,
    isInvalid,
    onChange,
    onCancel
  }) {
  const classes = useStyles();
  const [experience, setExperience] = useState(workExpInitialValue);
  const [isChangedModel, setIsChangedModel] = useState(false);
  useEffect(() => {
    setExperience(model);
  }, [model]);

  function handleChange(type) {
    return e => {
      const newExperience = {...experience, [type]: e.target.value};
      setIsChangedModel(true);
      setExperience(newExperience);
    };
  }

  function handleSave() {
    setIsChangedModel(false);
    onChange && onChange({
      ...experience,
      id: experience.id || Date.now()
    });
  }

  function handleCancel() {
    setIsChangedModel(false);
    onCancel && onCancel(experience);
  }

  return <>
    <div className={classes.wrapper}>
      <TextField
        value={experience.name}
        label={'Work Place'}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('name')}
      />
      <TextField
        value={experience.position}
        label={'Work position'}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('position')}
      />
    </div>
    <div className={classes.wrapper}>
      <TextField
        label="Enrollment year"
        type="month"
        error={isInvalid}
        className={classes.input}
        value={experience.enrollmentYear}
        onChange={handleChange('enrollmentYear')}

        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Finish year"
        type="month"
        error={isInvalid}
        className={classes.input}
        value={experience.finishYear}
        onChange={handleChange('finishYear')}

        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
    <div>
      <Button
        variant={'contained'}
        className={classes.button}
        onClick={handleCancel}
      >
        Cancel
      </Button>
      <Button
        color={'primary'}
        variant={'contained'}
        className={classes.button}
        onClick={handleSave}
        disabled={!isChangedModel}
      >
        Save
      </Button>
    </div>
  </>;
}
