import React, {useState} from 'react';
import {IconButton, makeStyles} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EducationForm from './EducationForm';

const useStyles = makeStyles((theme) => ({
  item: {
    margin: '20px 0'
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    margin: 0
  },
  subtitle: {
    margin: 0

  },
}));
export default function EducationItem(
  {
    model,
    onChange,
    onRemove
  }) {
  const classes = useStyles();
  const [isEdit, setIsEdit] = useState(false);

  function handleSave(data) {
    setIsEdit(false);
    onChange && onChange(data);
  }

  function handleCancel() {
    setIsEdit(false);
  }

  function handleClickEdit() {
    setIsEdit(true);
  }

  function handleRemove() {
    onRemove && onRemove(model);
  }

  return <div className={classes.item}>
    {
      isEdit
        ? <EducationForm
          model={model}
          onCancel={handleCancel}
          onChange={handleSave}
        />
        : <div className={classes.wrapper}>
          <div>
            <p className={classes.title}>{model.name} {model.type}</p>
            <p className={classes.subtitle}>{model.enrollmentYear || ''} - {model.finishYear || 'Current time'}</p>
          </div>
          <div>
            <IconButton
              aria-label="delete"
              onClick={handleRemove}
            >
              <DeleteIcon/>
            </IconButton>
            <IconButton
              aria-label="edit"
              onClick={handleClickEdit}
            >
              <EditIcon/>
            </IconButton>
          </div>
        </div>
    }
  </div>;
}
