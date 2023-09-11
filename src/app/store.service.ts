import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
} from 'rxjs';
import {
  ChartData,
  ChartHistoryConfig,
  ChartStandardConfig,
  Filter,
  FilterDate,
  FilterList,
  FilterNumber,
  FilterString,
  Payment,
  State,
} from './app.types';
import {
  createChartHistoryData,
  createChartStandardData,
} from './utils/chart.utils';
import { getLocalStorageState } from './utils/utils';
import { INITIAL_APP_STATE, LOCAL_STORAGE_KEY } from './app.const';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private _state$: BehaviorSubject<State>;

  constructor() {
    this._state$ = new BehaviorSubject<State>(INITIAL_APP_STATE);
    this._state$.next(getLocalStorageState(LOCAL_STORAGE_KEY));
    applyTheme(this._state$.value.theme);
  }

  private patchState(patch: Partial<State>) {
    this._state$.next({ ...this._state$.value, ...patch });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this._state$.value));
  }

  resetChartState(): void {
    this.patchState({ chartList: INITIAL_APP_STATE.chartList });
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
        const findFn = (c: ChartStandardConfig | ChartHistoryConfig) =>
          c.chartId === chartId;
        const stdConfig = chartList.standard.find(findFn);
        const historyConfig = chartList.history.find(findFn);
        if (stdConfig) return createChartStandardData(paymentList, stdConfig);
        if (historyConfig)
          return createChartHistoryData(paymentList, historyConfig);
        return null;
      }),
    );
  }

  createStandardChart(
    config: Pick<ChartStandardConfig, 'type' | 'field' | 'op'>,
  ): void {
    const stdChartList = this._state$.value.chartList.standard;
    const historyChartList = this._state$.value.chartList.history;

    this.patchState({
      chartList: {
        standard: [
          ...stdChartList,
          { ...config, chartId: uuid.v4(), configType: 'standard' },
        ],
        history: historyChartList,
      },
    });
  }

  createHistoryChart(
    config: Pick<ChartHistoryConfig, 'period' | 'op' | 'dateFormat'>,
  ): void {
    const stdChartList = this._state$.value.chartList.standard;
    const historyChartList = this._state$.value.chartList.history;

    this.patchState({
      chartList: {
        standard: stdChartList,
        history: [
          ...historyChartList,
          { ...config, chartId: uuid.v4(), configType: 'history' },
        ],
      },
    });
  }

  removeChart(chartId: string): void {
    const filterFn = (c: ChartStandardConfig | ChartHistoryConfig) =>
      c.chartId !== chartId;
    const history = this._state$.value.chartList.history.filter(filterFn);
    const standard = this._state$.value.chartList.standard.filter(filterFn);
    this.patchState({
      chartList: { history, standard },
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
