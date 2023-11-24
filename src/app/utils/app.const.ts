import { State } from './app.types';
import { isMobile } from './utils';

export const INITIAL_APP_STATE: State = {
  paymentList: [],
  filterList: {},
  stdChartList: {},
  historyChartList: {},
  theme: 'dark',
  restoreError: null,
  isMobile: isMobile(),
  desktopView: 'tabs',
};

export const LOCAL_STORAGE_KEY = 'my-expenses-stats-state';
