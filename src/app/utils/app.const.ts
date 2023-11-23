import { State } from './app.types';
import { isMobile } from './utils';

export const INITIAL_APP_STATE: State = {
  paymentList: [],
  filterList: {},
  chartList: {
    standard: [],
    history: [],
  },
  chartList2: {},
  theme: 'dark',
  restoreError: null,
  isMobile: isMobile(),
};

export const LOCAL_STORAGE_KEY = 'my-expenses-stats-state';
