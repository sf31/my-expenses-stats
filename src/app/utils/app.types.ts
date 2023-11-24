export type State = {
  paymentList: Payment[];
  filterList: {
    id?: FilterString;
    date?: FilterDate;
    payee?: FilterString;
    expense?: FilterNumber;
    income?: FilterNumber;
    category?: FilterList;
    subcategory?: FilterList;
    notes?: FilterString;
    paymentMethod?: FilterString;
  };
  // chartList: {
  //   standard: ChartStandardConfig[];
  //   history: ChartHistoryConfig[];
  // };
  stdChartList: { [id: string]: ChartStandardConfig };
  historyChartList: { [id: string]: ChartHistoryConfig };
  theme: 'light' | 'dark';
  restoreError: string | null;
  isMobile: boolean;
  desktopView: 'tabs' | 'split';
};

export type Payment = {
  id: string;
  date: number; // unix
  payee: string;
  expense: number;
  income: number;
  category: string;
  subcategory: string;
  notes: string;
  paymentMethod: string;
};

export type Filter = FilterDate | FilterString | FilterNumber | FilterList;
export type FilterDate = { from: number | null; to: number | null };
export type FilterString = { value: string };
export type FilterNumber = { min: number | null; max: number | null };
export type FilterList = { values: string[] };

export type ChartStandardConfig = {
  chartId: string;
  op: 'expense' | 'income' | 'count' | null;
  configType: 'standard';
  type: 'pie' | 'bar' | 'line' | null;
  field: keyof Payment | null;
};

export type ChartHistoryConfig = {
  chartId: string;
  op: 'expense' | 'income' | 'count' | null;
  configType: 'history';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  dateFormat: string | null;
};

export type HistoryChartData = {
  daily: { [day: number]: Payment[] };
  weekly: { [week: number]: Payment[] };
  monthly: { [month: number]: Payment[] };
  yearly: { [year: number]: Payment[] };
};

export type StatProps = {
  name: string;
  paymentCount: number;
  expenseSum: number;
  expenseAvg: number;
};

export type PaymentStats = {
  totalExpense: number;
  totalPayment: number;
  payee: { unique: number; top: StatProps };
  category: { unique: number; top: StatProps };
  subcategory: { unique: number; top: StatProps };
  day: StatProps;
  week: StatProps;
  month: StatProps;
  year: StatProps;
  avg: {
    from: string; // date string
    to: string; // date string
    day: number;
    week: number;
    month: number;
    year: number;
  };
};
