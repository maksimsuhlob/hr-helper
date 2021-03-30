import React, {useEffect, useState} from 'react';
import {
  Button,
  Container,
  makeStyles
} from '@material-ui/core';
import 'firebase/database';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    padding: 30,
    justifyContent: 'space-between'
  },
  dataList: {
    width: '100%',
    maxWidth: '29%',
    height: '70vh',
    overflowY: 'auto',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  dataItem: {
    borderWidth: 1,
    borderBlockColor: 'primary',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    cursor: 'pointer'
  },
  dataItemSelected: {
    backgroundColor: '#eee'
  },
  userForm: {
    display: 'flex',
    flexDirection: 'column',
    flex: "1 1 auto",
    maxWidth: '69%',
  },
  input: {
    marginBottom: 20
  },
  button: {
    marginRight: 20
  },
  controls: {
    display: 'flex'
  }
}));
const Modes = {
  read: 'read',
  add: 'add',
  edit: 'edit',
};

export default function ReferenceBookLayout(
  {
    dataList,
    dataViewParam = ['name'],
    newButtonText,
    updateButtonText,
    onUpdate,
    addButtonText,
    onAdd,
    onRemove,
    validator,
    sortParam,
    FormComponent,
  }) {
  const classes = useStyles();
  const [mode, setMode] = useState(Modes.read);
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [isChangedModel, setIsChangedModel] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  useEffect(() => {
    if (sortParam) {
      setData(dataList.sort((a, b) => {
        return a.value[sortParam].localeCompare(b.value[sortParam]);
      }));
    } else {
      setData(dataList);
    }
  }, [dataList, sortParam]);

  function handleAddNewItem() {
    setMode(Modes.add);
    setIsInvalid(false);
    setSelectedData(null);
  }

  function handleCancel() {
    setMode(Modes.read);
    setIsInvalid(false);
    setSelectedData(null);
  }

  function handleSelectItem(item) {
    return () => {
      setMode(Modes.edit);
      setIsInvalid(false);
      setSelectedData(item);
      setIsChangedModel(false);
    };
  }

  function handleRemoveItem() {
    setSelectedData(null);
    setIsInvalid(false);
    onRemove && onRemove(selectedData);
  }

  function handleUpdateItem() {
    if (validator(selectedData)) {
      setIsChangedModel(false);
      onUpdate && onUpdate(selectedData);
    } else {
      setIsInvalid(true);
    }
  }

  function handleAddItem() {
    if (selectedData && validator(selectedData)) {
      onAdd && onAdd(selectedData);
      setMode(Modes.read);
    } else {
      setIsInvalid(true);
    }
  }

  function handleChangeModel(model) {
    setIsChangedModel(true);
    setIsInvalid(false);
    setSelectedData(model);
  }

  const renderNewButton = () => <Container className={classes.container} maxWidth={'lg'}>
    <Button
      color={'primary'}
      variant={'contained'}
      onClick={handleAddNewItem}
    >
      {newButtonText}
    </Button>
  </Container>;

  if (mode === Modes.add) {
    return <>
      {renderNewButton()}
      <Container className={classes.container} maxWidth={'lg'}>
        <div className={classes.userForm}>
          <FormComponent
            isInvalid={isInvalid}
            onChange={handleChangeModel}
          />
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
              onClick={handleAddItem}
              disabled={!isChangedModel}
            >
              {addButtonText}
            </Button>
          </div>
        </div>
      </Container>
    </>;
  }

  return <>
    {renderNewButton()}
    <Container className={classes.container} maxWidth={'lg'}>
      <div className={classes.dataList}>
        {
          data.map((data) => {
            return <div
              className={`${classes.dataItem} ${selectedData && selectedData.id === data.id && classes.dataItemSelected}`}
              key={data.id}
              onClick={handleSelectItem(data)}
            >
              {dataViewParam.map(param=>data.value[param]).join(' ')}
            </div>;
          })
        }
      </div>
      <div className={classes.userForm}>
        {
          selectedData && selectedData.id && <>
            <FormComponent
              isInvalid={isInvalid}
              model={selectedData}
              onChange={handleChangeModel}
            />

            <div>
              <Button
                variant={'contained'}
                className={classes.button}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant={'contained'}
                className={classes.button}
                onClick={handleRemoveItem}
                color={'secondary'}
              >
                Remove
              </Button>
              <Button
                color={'primary'}
                variant={'contained'}
                className={classes.button}
                onClick={handleUpdateItem}
                disabled={!isChangedModel}
              >
                {updateButtonText}
              </Button>
            </div>

          </>
        }
      </div>
    </Container>
  </>;
};
