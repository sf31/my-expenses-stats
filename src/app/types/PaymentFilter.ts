export type FilterDate = { from: Date; to: Date };
export type FilterString = { value: string };
export type FilterNumber = { min: number; max: number };
export type FilterList = { values: string[] };
export type PaymentFilter =
  | FilterDate
  | FilterString
  | FilterNumber
  | FilterList;
