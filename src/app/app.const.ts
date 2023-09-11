import { State } from './app.types';

export const INITIAL_APP_STATE: State = {
  paymentList: [],
  filterList: {},
  chartList: {
    standard: [],
    history: [],
  },
  theme: 'dark',
  restoreError: null,
};

export const LOCAL_STORAGE_KEY = 'my-expenses-stats-state';
