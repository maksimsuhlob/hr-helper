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
const educationInitialValue = {
  id: null,
  name: '',
  type: '',
  enrollmentYear: '',
  finishYear: ''
};
export default function EducationForm(
  {
    model = educationInitialValue,
    isInvalid,
    onChange,
    onCancel
  }) {
  const classes = useStyles();
  const [education, setEducation] = useState(educationInitialValue);
  const [isChangedModel, setIsChangedModel] = useState(false);
  useEffect(() => {
    setEducation(model);
  }, [model]);

  function handleChange(type) {
    return e => {
      const newEducation = {...education, [type]: e.target.value};
      setIsChangedModel(true);
      setEducation(newEducation);
    };
  }

  function handleSave() {
    setIsChangedModel(false);
    onChange && onChange({
      ...education,
      id: education.id || Date.now()
    });
  }

  function handleCancel() {
    setIsChangedModel(false);
    onCancel && onCancel(education);
  }

  return <>
    <div className={classes.wrapper}>
      <TextField
        value={education.name}
        label={'Institution'}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('name')}
      />
      <TextField
        value={education.type}
        label={'Institution type'}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('type')}
      />
    </div>
    <div className={classes.wrapper}>
      <TextField
        label="Enrollment year"
        type="month"
        error={isInvalid}
        className={classes.input}
        value={education.enrollmentYear}
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
        value={education.finishYear}
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
