import React, {useState} from 'react';
import {IconButton, makeStyles} from '@material-ui/core';
import PlusIcon from '@material-ui/icons/Add';
import OrganisationItem from './OrganisationItem';

const useStyles = makeStyles((theme) => ({
  wrapper:{
    marginBottom: 20
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 18,
    backgroundColor: '#eee',
    paddingLeft: 10,
    borderRadius: 3
  }
}));
export default function CommonOrganisationForm(
  {
    title,
    onNewSave,
    onEditSave,
    onRemove,
    value,
    addLabel,
    nameParams,
    FormComponent
  }) {
  const classes = useStyles();
  const [isAdd, setIsAdd] = useState(false);

  function handleAdd() {
    setIsAdd(true);
  }

  function handleRemove(item) {
    onRemove && onRemove(item);
  }

  function handleChange(isNew) {
    return model => {
      if (isNew) {
        onNewSave && onNewSave(model);
        setIsAdd(false);
      } else {
        onEditSave && onEditSave(model);
      }
    };
  }

  function handleCancelAdd() {
    setIsAdd(false);
  }

  return <div className={classes.wrapper}>
    <div className={classes.header}>
      <p>{title}</p>

      <IconButton
        aria-label={addLabel}
        onClick={handleAdd}
      >
        <PlusIcon/>
      </IconButton>
    </div>

    {
      isAdd && <FormComponent
        onChange={handleChange(true)}
        onCancel={handleCancelAdd}
      />
    }
    {
      value && value.map((item) => {
        return <OrganisationItem
          key={item.id}
          model={item}
          nameParams={nameParams}
          onChange={handleChange(false)}
          onRemove={handleRemove}
          FormComponent={FormComponent}
        />;
      })
    }
  </div>;
}
