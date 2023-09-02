import { Payment } from './Payment';
import {
  FilterDate,
  FilterList,
  FilterNumber,
  FilterString,
} from './PaymentFilter';

export type State = {
  paymentList: Payment[];
  filterList: {
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
