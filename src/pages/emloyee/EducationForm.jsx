import React, {useEffect, useState} from 'react';
import {Button, makeStyles, TextField} from '@material-ui/core';
import {useIntl} from 'react-intl';

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
  const intl = useIntl();
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
        label={intl.formatMessage({
          id: 'employee.form.institution.name',
          defaultMessage: 'Institution'
        })}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('name')}
      />
      <TextField
        value={education.type}
        label={intl.formatMessage({
          id: 'employee.form.institution.type',
          defaultMessage: 'Institution type'
        })}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('type')}
      />
    </div>
    <div className={classes.wrapper}>
      <TextField
        label={intl.formatMessage({
          id: 'employee.form.institution.enrollmentYear',
          defaultMessage: 'Enrollment year'
        })}
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
        label={intl.formatMessage({
          id: 'employee.form.institution.finishYear',
          defaultMessage: 'Finish year'
        })}
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
        {intl.formatMessage({
          id: 'common.button.cancel',
          defaultMessage: 'Cancel'
        })}
      </Button>
      <Button
        color={'primary'}
        variant={'contained'}
        className={classes.button}
        onClick={handleSave}
        disabled={!isChangedModel}
      >
        {intl.formatMessage({
          id: 'common.button.save',
          defaultMessage: 'Save'
        })}
      </Button>
    </div>
  </>;
}
