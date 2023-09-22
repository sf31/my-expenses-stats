import { ChartConfiguration } from 'chart.js';

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
  chartList: {
    standard: ChartStandardConfig[];
    history: ChartHistoryConfig[];
  };
  chartList2: { [id: string]: ChartConfiguration };
  theme: 'light' | 'dark';
  restoreError: string | null;
  isMobile: boolean;
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
export type FilterDate = { from: number; to: number };
export type FilterString = { value: string };
export type FilterNumber = { min: number; max: number };
export type FilterList = { values: string[] };

export type ChartStandardConfig = {
  chartId: string;
  configType: 'standard';
  type: 'pie' | 'bar' | 'line';
  field: keyof Payment;
  op: 'expense' | 'income' | 'count';
};

export type ChartHistoryConfig = {
  chartId: string;
  configType: 'history';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  op: 'expense' | 'income' | 'count';
  dateFormat: string;
};

export type HistoryChartData = {
  daily: { [day: number]: Payment[] };
  weekly: { [week: number]: Payment[] };
  monthly: { [month: number]: Payment[] };
  yearly: { [year: number]: Payment[] };
};
