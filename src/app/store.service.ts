import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
} from 'rxjs';
import {
  ChartConfig,
  ChartData,
  Filter,
  FilterDate,
  FilterList,
  FilterNumber,
  FilterString,
  Payment,
  State,
} from './app.types';
import * as uuid from 'uuid';
import { createChartConfig, historicalChart } from './utils/chart.utils';
import { parseDateToUnix } from './pages/upload-csv.component';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly LSK_STATE = 'my-expenses-stats-state';
  private readonly INITIAL_STATE: State = {
    paymentList: [],
    filterList: {},
    chartList: [],
    theme: 'dark',
  };

  constructor() {
    const state = localStorage.getItem(this.LSK_STATE);
    if (!state) return;
    this._state$.next({
      ...this.INITIAL_STATE,
      ...JSON.parse(state),
      // chartList: [],
    });
    parseDateToUnix('10/10/2020');
    historicalChart(this._state$.value.paymentList);
    applyTheme(this._state$.value.theme);
  }

  private _state$ = new BehaviorSubject<State>(this.INITIAL_STATE);

  private patchState(patch: Partial<State>) {
    this._state$.next({ ...this._state$.value, ...patch });
    localStorage.setItem(this.LSK_STATE, JSON.stringify(this._state$.value));
  }

  select<T extends keyof State>(
    field: T,
    distinctFn?: (a: State[T], b: State[T]) => boolean,
  ): Observable<State[typeof field]> {
    const defaultFn = (a: State[T], b: State[T]) => a === b;
    return this._state$.pipe(
      map((state) => state[field]),
      distinctUntilChanged(distinctFn ?? defaultFn),
    );
  }

  selectFilter<T extends keyof State['filterList']>(
    field: T,
  ): Observable<State['filterList'][typeof field]> {
    return this.select('filterList').pipe(
      map((filterList) => filterList[field]),
      distinctUntilChanged(),
    );
  }

  setPaymentList(paymentList: Payment[]): void {
    this.patchState({ paymentList: paymentList });
  }

  setFilter(field: keyof Payment, filter: Filter | null): void {
    const filterList = this._state$.getValue().filterList;
    if (filter === null) {
      const { [field]: _, ...rest } = filterList;
      this.patchState({ filterList: rest });
    } else {
      this.patchState({ filterList: { ...filterList, [field]: filter } });
    }
  }

  resetFilters(): void {
    this.patchState({ filterList: {} });
  }

  getFilteredPaymentList(): Observable<Payment[]> {
    return this._state$.pipe(
      map(({ paymentList }) =>
        paymentList.filter((payment) => this.applyFilter(payment)),
      ),
    );
  }

  getCategoryList(): Observable<string[]> {
    return this._state$.pipe(
      map(({ paymentList }) => {
        const categories = paymentList.map((p) => p.category);
        return [...new Set(categories)];
      }),
    );
  }

  getSubcategoryList(): Observable<string[]> {
    return this._state$.pipe(
      map(({ paymentList }) => {
        const subcategories = paymentList.map((p) => p.subcategory);
        return [...new Set(subcategories)];
      }),
    );
  }

  getChartData(chartId: string): Observable<ChartData | null> {
    return combineLatest([
      this.getFilteredPaymentList(),
      this.select('chartList'),
    ]).pipe(
      map(([paymentList, chartList]) => {
        const config = chartList.find((c) => c.chartId === chartId);
        if (!config) return null;
        return createChartConfig(paymentList, config);
      }),
    );
  }

  createChart(config: Pick<ChartConfig, 'type' | 'field' | 'op'>): void {
    this.patchState({
      chartList: [
        ...this._state$.value.chartList,
        { ...config, chartId: uuid.v4() },
      ],
    });
  }

  removeChart(chartId: string): void {
    this.patchState({
      chartList: this._state$.value.chartList.filter(
        (chart) => chart.chartId !== chartId,
      ),
    });
  }

  setTheme(theme: 'dark' | 'light'): void {
    this.patchState({ theme });
    applyTheme(theme);
  }

  private applyFilter(payment: Payment): boolean {
    const filterList = this._state$.getValue().filterList;
    // const fieldsToFilter = Object.keys(filterList) as (keyof Payment)[];

    const idPassed = filterList.id
      ? filterString(payment.id, filterList.id)
      : true;
    const datePassed = filterList.date
      ? filterDate(payment.date, filterList.date)
      : true;
    const payeePassed = filterList.payee
      ? filterString(payment.payee, filterList.payee)
      : true;
    const expensePassed = filterList.expense
      ? filterNumber(payment.expense, filterList.expense)
      : true;
    const incomePassed = filterList.income
      ? filterNumber(payment.income, filterList.income)
      : true;
    const categoryPassed = filterList.category
      ? filterListString(payment.category, filterList.category)
      : true;
    const subcategoryPassed = filterList.subcategory
      ? filterListString(payment.subcategory, filterList.subcategory)
      : true;
    const notesPassed = filterList.notes
      ? filterString(payment.notes, filterList.notes)
      : true;
    const paymentMethodPassed = filterList.paymentMethod
      ? filterString(payment.paymentMethod, filterList.paymentMethod)
      : true;

    return (
      idPassed &&
      datePassed &&
      payeePassed &&
      expensePassed &&
      incomePassed &&
      categoryPassed &&
      subcategoryPassed &&
      notesPassed &&
      paymentMethodPassed
    );

    // return fieldsToFilter.every((field) => {
    //   switch (field) {
    //     case 'id':
    //     case 'payee':
    //     case 'notes':
    //     case 'paymentMethod': {
    //       const filter = filterList[field];
    //       return filter ? filterString(payment[field], filter) : true;
    //     }
    //     case 'date': {
    //       const filter = filterList[field];
    //       return filter ? filterDate(payment[field], filter) : true;
    //     }
    //     case 'expense':
    //     case 'income': {
    //       const filter = filterList[field];
    //       return filter ? filterNumber(payment[field], filter) : true;
    //     }
    //     case 'category':
    //     case 'subcategory': {
    //       const filter = filterList[field];
    //       return filter ? filterListString(payment[field], filter) : true;
    //     }
    //     default:
    //       return true;
    //   }
    // });
  }
}

function filterDate(value: number, filter: FilterDate): boolean {
  console.log(value, filter);
  return value >= filter.from && value <= filter.to;
}

function filterListString(value: string, filter: FilterList): boolean {
  return filter.values.includes(value);
}

function filterString(value: string, filter: FilterString): boolean {
  return value.toLowerCase().includes(filter.value.toLowerCase());
}

function filterNumber(value: number, filter: FilterNumber): boolean {
  return value >= filter.min && value <= filter.max;
}

function applyTheme(theme: 'dark' | 'light'): void {
  if (theme === 'dark') {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  }
}
