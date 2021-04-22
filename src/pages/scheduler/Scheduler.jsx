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

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 30
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  controlsGroup:{
    width:'48%'
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
  },
  select:{
    width: '100%'
  },
  button:{
    display: 'block',
    marginBottom: 20,
    width: '100%'
  },
  tableCell: {
    borderRight: '1px solid #eee',
    padding: 5,
    textAlign: 'center'
  },
  wDay: {
    width: 20,
    border: 'none',
    borderBottom: '1px solid #ccc',
  }
}));
const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const getDays = (schedulerModel) => new Array(new Date(schedulerModel.value.year, schedulerModel.value.month + 1, 0).getDate()).fill(0);
const schedulerInitial = {
  id: null,
  value: {
    unit: '',
    year: new Date().getFullYear(),
    month: 0,
    employees: []
  }
};
export default function Scheduler() {
  const classes = useStyles();
  const {state: {profile}, addAlert} = useContext(AppContext);
  const [employeeList, setEmployeesList] = useState([]);
  const [unitList, setUnitsList] = useState([]);
  const [schedulerList, setSchedulerList] = useState([]);
  const [schedulerModel, setSchedulerModel] = useState(schedulerInitial);

  useEffect(() => {
    firebase.database().ref(`/employees`)
      .on('value', data => {
        setEmployeesList(modifyData(data));
      });
    firebase.database().ref(`/units`)
      .on('value', data => {
        setUnitsList(modifyData(data));
      });
    firebase.database().ref(`/scheduler`)
      .on('value', data => {
        setSchedulerList(modifyData(data));
      });
    return () => {
      firebase.database().ref(`/employees`).off();
      firebase.database().ref(`/units`).off();
      firebase.database().ref(`/scheduler`).off();
    };
  }, []);
  useEffect(() => {
    const selectedScheduler = schedulerList
      .filter(scheduler => scheduler.value.unit === schedulerModel.value.unit)
      .filter(scheduler => scheduler.value.year === schedulerModel.value.year)
      .filter(scheduler => scheduler.value.month === schedulerModel.value.month);
    if (selectedScheduler.length) {
      setSchedulerModel(selectedScheduler[0]);
    }
  }, [
    schedulerModel.value.unit,
    schedulerModel.value.year,
    schedulerModel.value.month,
    schedulerList
  ]);

  function handleChange(key) {
    return e => {
      const newSchedulerModel = {
        ...schedulerModel,
        id: null,
        value: {
          ...schedulerModel.value,
          [key]: e.target.value
        }
      };
      newSchedulerModel.value.employees = employeeList
        .filter(employee => employee.value.unit === newSchedulerModel.value.unit)
        .map(employee => ({
          employeeId: employee.id,
          days: getDays(newSchedulerModel).map((day, i) => ({day: i + 1, value: null}))
        }));

      setSchedulerModel(newSchedulerModel);
    };
  }

  function getEmployeeName(id) {
    const employee = employeeList.filter(employee => employee.id === id)[0];
    if (employee) {
      return `${employee.value.lastName} ${employee.value.firstName}`;
    }
    return '';
  }

  function handleChangeWorkDay(employeeId, day) {
    return (e) => {
      const newSchedulerModel = {
        ...schedulerModel,
        value: {
          ...schedulerModel.value,
          employees: schedulerModel.value.employees
            .map(item => {
              if (item.employeeId === employeeId) {
                const days = item.days.map(itemDay => {
                  if (itemDay.day === day.day) {
                    return {
                      day: itemDay.day,
                      value: e.target.innerText
                    };
                  }
                  return itemDay;
                });
                return {...item, days};
              }
              return {...item, days: [...item.days]};
            })
        }
      };
      setSchedulerModel(newSchedulerModel);
    };
  }

  function handleSaveScheduler() {
    if (schedulerModel.id) {
      firebase.database().ref(`/scheduler/${schedulerModel.id}`).update(schedulerModel.value)
        .catch((e) => console.log(e));
      return;
    }
    firebase.database().ref('/scheduler').push(schedulerModel.value)
      .then(() => addAlert('scheduler saved'))
      .catch((e) => console.log(e));
  }

  function handleRemoveScheduler() {
    if (schedulerModel.id) {
      firebase.database().ref(`/scheduler/${schedulerModel.id}`).remove()
        .then(() => {
          setSchedulerModel(schedulerInitial);
        })
        .catch((e) => console.log(e));
    }
  }

  async function handleSaveToPdf() {
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.text(`${monthList[schedulerModel.value.month]} ${schedulerModel.value.year}`, pageWidth / 2, 10);
    doc.autoTable({html: '#table', theme: 'grid', styles: {halign: 'center'}});
    doc.save("a4.pdf");
  }

  return <Layout title={'Scheduler'}>
    <Container className={classes.container} maxWidth={'lg'}>
      <div className={classes.controls}>
        <div className={classes.controlsGroup}>
          <FormControl
            variant="outlined"
            className={classes.unit}
          >
            <InputLabel id="unit-label">Unit</InputLabel>
            <Select
              labelId="unit-label"
              value={schedulerModel.value.unit}
              onChange={handleChange('unit')}
              label="Unit"
              className={classes.select}
              // error={isInvalid}
            >
              {
                unitList.map(unit => {
                  return <MenuItem key={unit.id} value={unit.id}>{unit.value.name}</MenuItem>;
                })
              }
            </Select>
          </FormControl>
          <TextField
            value={schedulerModel.value.year}
            label={'Year'}
            className={classes.input}
            // error={isInvalid}
            onChange={handleChange('year')}
          />
          <FormControl
            variant="outlined"
            className={classes.unit}
          >
            <InputLabel id="unit-label">Month</InputLabel>
            <Select
              labelId="unit-label"
              value={schedulerModel.value.month}
              onChange={handleChange('month')}
              className={classes.select}
              label="Month"
              // error={isInvalid}
            >
              {
                monthList.map((month, i) => {
                  return <MenuItem key={i} value={i}>{month}</MenuItem>;
                })
              }
            </Select>
          </FormControl>
        </div>
        <div className={classes.controlsGroup}>

          <Button
            color={'primary'}
            variant={'contained'}
            className={classes.button}
            onClick={handleSaveScheduler}
          >
            save scheduler
          </Button>
          <Button
            color={'secondary'}
            variant={'contained'}
            className={classes.button}
            disabled={!schedulerModel.id}
            onClick={handleRemoveScheduler}
          >
            remove scheduler
          </Button>
          <Button
            color={'inherit'}
            variant={'contained'}
            className={classes.button}
            onClick={handleSaveToPdf}
          >
            save to pdf
          </Button>
        </div>

      </div>
      <TableContainer component={Paper}>
        <Table id={'table'} className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableCell}>Employee</TableCell>
              {
                getDays(schedulerModel).map((day, i) => {
                  return <TableCell key={i} className={classes.tableCell}>{i + 1}</TableCell>;
                })
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {schedulerModel.value.employees.map((row) => (
              <TableRow key={row.employeeId}>
                <TableCell component="th" scope="row" className={classes.tableCell}>
                  {getEmployeeName(row.employeeId)}
                </TableCell>
                {
                  row.days.map((day, i) => {
                    return <TableCell key={i} className={classes.tableCell}>
                      <div
                        contentEditable
                        onBlur={handleChangeWorkDay(row.employeeId, day)}
                        dangerouslySetInnerHTML={{
                          __html: day.value
                        }}
                      />
                    </TableCell>;
                  })
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  </Layout>;
}
