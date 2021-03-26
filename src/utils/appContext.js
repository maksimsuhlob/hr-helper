import {createContext} from 'react';

export const AppContext = createContext({
  state: {},
  dispatch: () => {
  },
  isAuthorized: () => {
  },
  addAlert: () => {
  }
});
