import React from 'react';
import {Container, makeStyles} from '@material-ui/core';
import 'firebase/database';
import Header from '../../components/header/Header';

const useStyles = makeStyles((theme) => ({
  main: {
    height: '100vh',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 30
  },
  input: {
    marginBottom: '20px',
    fontSize: '36px'
  },
  pageTitle: {
    fontSize: 24
  }
}));
export default function Layout(
  {
    title,
    children
  }) {
  const classes = useStyles();

  return <div className={classes.main}>
    <Header title={title}/>
    <Container className={classes.container} maxWidth={'lg'}>
      {children}
    </Container>
  </div>;
}
