import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select, TableCell,
  TableContainer, TableHead, TableRow,
  TextField,
  Paper,
  Table,
  TableBody
} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/database';
import {AppContext} from '../../utils/appContext';
import Layout from '../../components/layout/Layout';
import {modifyData} from '../../utils/modifyData';
import {jsPDF} from "jspdf";
import 'jspdf-autotable';
import PTSans from '../../assets/PTSans-Regular.ttf';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 30
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  controlsGroup: {
    width: '48%',
    display: 'flex',
    gap: '1%'
  },
  input: {
    marginBottom: '20px',
    fontSize: '36px',
    display: 'block',
    width: '100%'
  },
  unit: {
    minWidth: 300,
    display: 'block',
    marginBottom: '20px',
    margin: 10
  },
  selectUnit: {
    minWidth: 300,
    display: 'block',
    margin: '0 10px'
  },
  selectPosition: {
    minWidth: 300,
    display: 'block',
    margin: '0 10px'
  },
  unitButtons: {
    display: 'flex',
    gap: '20px',
    margin: 10
  },
  select: {
    width: '100%'
  },
  button: {
    display: 'block',
    margin: '10px 0',
    width: '100%'
  },
  tableCell: {
    borderRight: '1px solid #eee',
    textAlign: 'center',
    padding: 0
  },
  tableInnerRow: {
    display: 'block'
  },
  tableInnerCell: {
    display: 'block',
  },
  positionContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  unitContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  editModeControls: {
    display: 'flex',
    gap: 20
  },
  inputField: {
    height: 56,
    border: '1px solid #bebebe',
    borderRadius: 4,
    padding: 5
  }
}));
const unitModel = {
  unit: null,
  unitName: null,
  position: new Array(0)
};
const positionModel = {
  unitId: null,
  position: null,
  number: null,
  salary: 0,
  seniorityBonus: 0,
  difficultBonus: 0,
  contractBonus: 0,
  total: 0,
  description: null,
};
const staffingTableInitial = {
  id: null,
  value: {
    name: '',
    rows: [
      {...unitModel, position: [{...positionModel}]}
    ],
    total: {}
  }
};
const staffingTableFields = {
  unitName: 'unit',
  // unitId: 'unitId',
  positionName: 'position',
  number: 'number of employees',
  salary: 'salary',
  seniorityBonus: 'seniority bonus',
  difficultBonus: 'difficult bonus',
  contractBonus: 'contract bonus',
  total: 'total',
  description: 'description'
};
export default function StaffingTable() {
  const classes = useStyles();
  const {addAlert} = useContext(AppContext);
  const [positionsList, setPositionsList] = useState([]);
  const [unitList, setUnitsList] = useState([]);
  const [staffingTableList, setStaffingTableList] = useState([]);
  const [staffingTableModel, setStaffingTableModel] = useState(JSON.parse(JSON.stringify(staffingTableInitial)));
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    firebase.database().ref(`/positions`)
      .on('value', data => {
        setPositionsList(modifyData(data));
      });
    firebase.database().ref(`/units`)
      .on('value', data => {
        setUnitsList(modifyData(data));
      });
    firebase.database().ref(`/staffingtables`)
      .on('value', data => {
        setStaffingTableList(modifyData(data));
      });
    return () => {
      firebase.database().ref(`/positions`).off();
      firebase.database().ref(`/units`).off();
      firebase.database().ref(`/staffingtables`).off();
    };
  }, []);

  function handleChange(key, unitIdx, positionIdx) {
    return e => {
      const newModel = {
        ...staffingTableModel,
        value: {
          ...staffingTableModel.value,
          rows: [...staffingTableModel.value.rows]
        }
      };
      if (key === 'tableName') {
        newModel.value.name = e.target.value;
        setStaffingTableModel(newModel);
        return;
      }
      if (key === 'unit') {
        newModel.value.rows[unitIdx][key] = e.target.value;
        newModel.value.rows[unitIdx]['unitName'] = unitList.find(item => item.id === e.target.value).value.name;
        setStaffingTableModel(newModel);
        return;
      }

      if (key === 'positionName') {
        newModel.value.rows[unitIdx].position[positionIdx].positionId = e.target.value;
        newModel.value.rows[unitIdx].position[positionIdx].positionName = positionsList.find(item => item.id === e.target.value).value.name;
        setStaffingTableModel(newModel);
        return;
      }

      newModel.value.rows[unitIdx].position[positionIdx][key] = e.target.value;
      newModel.value.rows[unitIdx].position[positionIdx].total =
        parseInt(newModel.value.rows[unitIdx].position[positionIdx].salary) +
        parseInt(newModel.value.rows[unitIdx].position[positionIdx].seniorityBonus) +
        parseInt(newModel.value.rows[unitIdx].position[positionIdx].difficultBonus) +
        parseInt(newModel.value.rows[unitIdx].position[positionIdx].contractBonus);
      setStaffingTableModel(newModel);
    };
  }

  async function handleSaveToPdf() {
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    // const pageHeight = doc.internal.pageSize.getHeight();
    doc.addFont(PTSans, "PTSans", "normal");
    doc.setFont("PTSans"); // set font
    doc.setFontSize(10);
    doc.text(`${staffingTableModel.value.name}`, pageWidth / 2, 10);
    doc.autoTable({
      html: '#table', theme: 'grid', styles: {
        halign: 'center',
        font: 'PTSans'
      }
    });
    doc.save("a4.pdf");
  }

  function handleSelectStaffingTable(e) {
    const st = JSON.stringify(staffingTableList.find(item => item.id === e.target.value));
    setStaffingTableModel(JSON.parse(st));
    setIsEditMode(false);
  }

  function createNewTable() {
    const st = JSON.stringify(staffingTableInitial);
    setStaffingTableModel(JSON.parse(st));
    setIsEditMode(true);
  }

  function handleEditModeClick() {
    setIsEditMode(true);
  }

  function handleEditModeCancelClick() {
    setIsEditMode(false);
    if (staffingTableModel.id) {
      const prevModel = JSON.stringify(staffingTableList.find(item => item.id === staffingTableModel.id));
      setStaffingTableModel(JSON.parse(prevModel));
      return;
    }
    const prevModel = JSON.stringify(staffingTableInitial);
    setStaffingTableModel(JSON.parse(prevModel));
  }

  function handleAddUnit() {
    setStaffingTableModel({
      ...staffingTableModel,
      value: {
        ...staffingTableModel.value,
        rows: [...staffingTableModel.value.rows, {...unitModel, position: [{...positionModel}]}]
      }
    });
  }

  function handleAddPosition(unitIdx) {
    return () => {
      const updatedUnitList = [...staffingTableModel.value.rows];
      if (updatedUnitList[unitIdx].position) {
        updatedUnitList[unitIdx].position = [...updatedUnitList[unitIdx].position, {...positionModel}];
      } else {
        updatedUnitList[unitIdx].position = [{...positionModel}];
      }
      setStaffingTableModel({
        ...staffingTableModel,
        value: {
          ...staffingTableModel.value,
          rows: [...staffingTableModel.value.rows]
        }
      });
    };
  }

  function handleRemoveUnit(unitIdx) {
    return () => {
      const unitList = [...staffingTableModel.value.rows];
      unitList.slice(unitIdx, 1);
      setStaffingTableModel({
        ...staffingTableModel,
        value: {
          ...staffingTableModel.value,
          rows: [...unitList]
        }
      });
    };
  }

  function handleRemovePosition(unitIdx, positionIdx) {
    return () => {
      const updatedUnitList = [...staffingTableModel.value.rows];
      updatedUnitList[unitIdx].position.splice(positionIdx, 1);
      setStaffingTableModel({
        ...staffingTableModel,
        value: {
          ...staffingTableModel.value,
          rows: [...staffingTableModel.value.rows]
        }
      });
    };
  }

  function handleSave() {
    if (staffingTableModel.id) {
      firebase.database().ref(`/staffingtables/${staffingTableModel.id}`).update(staffingTableModel.value)
        .catch((e) => console.log(e));
      setIsEditMode(false);
      return;
    }
    firebase.database().ref('/staffingtables').push(staffingTableModel.value)
      .then(() => {
        setIsEditMode(false);
        setStaffingTableModel(staffingTableInitial);
        addAlert('staffingTableModel saved');
      })
      .catch((e) => console.log(e));
  }

  function removeTable() {
    if (staffingTableModel.id) {
      firebase.database().ref(`/staffingtables/${staffingTableModel.id}`).remove()
        .then(() => {
          setStaffingTableModel(staffingTableInitial);
        })
        .catch((e) => console.log(e));
      setIsEditMode(false);
    }
  }

  return <Layout title={'Staffing Table'}>
    <Container className={classes.container} maxWidth={'lg'}>
      <div className={classes.controls}>
        {
          isEditMode
            ? <input
              type="text"
              className={classes.inputField}
              placeholder={'table name'}
              value={staffingTableModel.value.name}
              onChange={handleChange('tableName')}
            />
            : <FormControl
              variant="outlined"
              className={classes.unit}
            >
              <InputLabel id="unit-label">Staffing Table</InputLabel>
              <Select
                labelId="unit-label"
                value={staffingTableModel.id}
                onChange={handleSelectStaffingTable}
                label="Staffing Table"
                className={classes.select}
                disabled={isEditMode}
                // error={isInvalid}
              >
                {
                  staffingTableList.map(unit => {
                    return <MenuItem key={unit.id} value={unit.id}>{unit.value.name}</MenuItem>;
                  })
                }
              </Select>
            </FormControl>
        }
        <div className={classes.controlsGroup}>
          <Button
            color={'primary'}
            variant={'contained'}
            className={classes.button}
            onClick={createNewTable}
            disabled={isEditMode}
          >
            new table
          </Button>
          <Button
            color={'secondary'}
            variant={'contained'}
            className={classes.button}
            onClick={removeTable}
            disabled={!staffingTableModel.id}
          >
            remove table
          </Button>
          <Button
            color={'inherit'}
            variant={'contained'}
            className={classes.button}
            onClick={handleSaveToPdf}
            disabled={isEditMode}
          >
            save to pdf
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table id={'table'} aria-label="a dense table">
          <TableHead>
            <TableRow>
              {
                Object.values(staffingTableFields).map((field, i) => {
                  return <TableCell
                    key={i}
                    // className={classes.tableCell}
                  >
                    {field}
                  </TableCell>;
                })
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              staffingTableModel.value.rows.map((item, unitIdx) => {
                return item.position
                  && item.position.map((position, positionIdx) => {
                    return <TableRow key={position.positionId}>
                      {
                        Object.keys(staffingTableFields)
                          .map((field, unitRowIdx) => {
                            return <TableCell
                              key={unitRowIdx}
                              scope={'row'}
                              // className={classes.tableCell}
                            >
                              {
                                unitRowIdx === 0 && positionIdx === 0
                                && <div className={classes.unitContainer}>
                                  {
                                    isEditMode
                                    && <div className={classes.unitButtons}>

                                      <Button
                                        color={'secondary'}
                                        variant={'contained'}
                                        onClick={handleRemoveUnit(unitIdx)}
                                      >
                                        remove unit
                                      </Button>
                                      <Button
                                        color={'primary'}
                                        variant={'contained'}
                                        onClick={handleAddPosition(unitIdx)}
                                      >
                                        add position
                                      </Button>
                                    </div>
                                  }
                                  {
                                    isEditMode ?
                                      <>
                                        <FormControl
                                          variant="outlined"
                                          className={classes.selectUnit}
                                        >
                                          <InputLabel id="unit-label">Unit</InputLabel>
                                          <Select
                                            labelId="unit-label"
                                            value={staffingTableModel.value.rows[unitIdx].unit}
                                            onChange={handleChange('unit', unitIdx)}
                                            label="Unit"
                                            className={classes.select}
                                            // error={isInvalid}
                                          >
                                            {
                                              unitList.map(unit => {
                                                return <MenuItem key={unit.id}
                                                                 value={unit.id}>{unit.value.name}</MenuItem>;
                                              })
                                            }
                                          </Select>
                                        </FormControl>
                                      </> :
                                      item.unitName
                                  }
                                </div>
                              }
                              <div className={classes.positionContainer}>
                                {
                                  unitRowIdx === 1
                                  && isEditMode
                                  && <Button
                                    color={'secondary'}
                                    variant={'contained'}
                                    onClick={handleRemovePosition(unitIdx, positionIdx)}
                                  >
                                    remove position
                                  </Button>
                                }
                                {
                                  isEditMode
                                  && unitRowIdx !== 0 ?
                                    <>
                                      {
                                        field === 'positionName'
                                          ? <FormControl
                                            variant="outlined"
                                            className={classes.selectPosition}
                                          >
                                            <InputLabel id="unit-label">Position</InputLabel>
                                            <Select
                                              labelId="unit-label"
                                              value={staffingTableModel.value.rows[unitIdx].position[positionIdx].positionId}
                                              onChange={handleChange('positionName', unitIdx, positionIdx)}
                                              label="Position"
                                              className={classes.select}
                                              // error={isInvalid}
                                            >
                                              {
                                                positionsList.map(position => {
                                                  return <MenuItem key={position.id}
                                                                   value={position.id}>{position.value.name}</MenuItem>;
                                                })
                                              }
                                            </Select>
                                          </FormControl> :
                                          <input
                                            className={classes.inputField}
                                            type={['salary', 'seniorityBonus', 'difficultBonus', 'contractBonus'].includes(field) ? 'number' : "text"}
                                            disabled={field === 'total'}
                                            value={position[field]}
                                            onChange={handleChange(field, unitIdx, positionIdx)}
                                          />
                                      }
                                    </> :
                                    position[field]
                                }
                              </div>

                            </TableCell>;
                          })
                      }
                    </TableRow>;
                  });
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
      {
        isEditMode && <div className={classes.editModeControls}>
          <Button
            color={'primary'}
            variant={'contained'}
            className={classes.button}
            onClick={handleAddUnit}
          >
            add unit
          </Button>
          <Button
            color={'secondary'}
            variant={'contained'}
            className={classes.button}
            onClick={handleSave}
            disabled={!staffingTableModel.value.name}
          >
            save
          </Button>
          <Button
            color={'inherit'}
            variant={'contained'}
            className={classes.button}
            onClick={handleEditModeCancelClick}
          >
            cancel
          </Button>
        </div>
      }

      {
        !isEditMode
        && <Button
          color={'primary'}
          variant={'contained'}
          className={classes.button}
          onClick={handleEditModeClick}
        >
          edit
        </Button>
      }
    </Container>
  </Layout>;
}
