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
  const intl = useIntl();
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
    if (experience.name) {
      setIsChangedModel(false);
      onChange && onChange({
        ...experience,
        id: experience.id || Date.now()
      });
    }
  }

  function handleCancel() {
    setIsChangedModel(false);
    onCancel && onCancel(experience);
  }

  return <>
    <div className={classes.wrapper}>
      <TextField
        value={experience.name}
        label={intl.formatMessage({
          id: 'employee.form.workExp.name',
          defaultMessage: 'Work Place'
        })}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('name')}
      />
      <TextField
        value={experience.position}
        label={intl.formatMessage({
          id: 'employee.form.workExp.position',
          defaultMessage: 'Work position'
        })}
        className={classes.input}
        error={isInvalid}
        onChange={handleChange('position')}
      />
    </div>
    <div className={classes.wrapper}>
      <TextField
        label={intl.formatMessage({
          id: 'employee.form.workExp.enrollmentYear',
          defaultMessage: 'Enrollment year'
        })}
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
        label={intl.formatMessage({
          id: 'employee.form.workExp.finishYear',
          defaultMessage: 'Finish year'
        })}
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
