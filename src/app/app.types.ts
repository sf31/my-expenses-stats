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
};

export type Payment = {
  id: string;
  date: Date;
  payee: string;
  expense: number;
  income: number;
  category: string;
  subcategory: string;
  notes: string;
  paymentMethod: string;
};

export type Filter = FilterDate | FilterString | FilterNumber | FilterList;
export type FilterDate = { from: Date; to: Date };
export type FilterString = { value: string };
export type FilterNumber = { min: number; max: number };
export type FilterList = { values: string[] };
