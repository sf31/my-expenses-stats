import { State } from './app.types';
import { isMobile } from './utils/utils';

export const INITIAL_APP_STATE: State = {
  paymentList: [],
  filterList: {},
  chartList: {
    standard: [],
    history: [],
  },
  theme: 'dark',
  restoreError: null,
  isMobile: isMobile(),
};

export const LOCAL_STORAGE_KEY = 'my-expenses-stats-state';
