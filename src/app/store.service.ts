import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
} from 'rxjs';
import {
  ChartHistoryConfig,
  ChartStandardConfig,
  Filter,
  FilterDate,
  FilterList,
  FilterNumber,
  FilterString,
  Payment,
  State,
} from './utils/app.types';
import {
  createChartHistoryData,
  createChartStandardData,
} from './utils/chart.utils';
import {
  getInitialState,
  isMobile,
  sortNumber,
  sortString,
} from './utils/utils';
import { INITIAL_APP_STATE, LOCAL_STORAGE_KEY } from './utils/app.const';
import * as uuid from 'uuid';
import { ChartConfiguration } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private _state$: BehaviorSubject<State>;

  constructor() {
    this._state$ = new BehaviorSubject<State>(getInitialState());
    applyTheme(this._state$.value.theme);
    fromEvent(window, 'resize')
      .pipe(debounceTime(10))
      .subscribe(() => {
        if (this._state$.getValue().isMobile !== isMobile())
          this.patchState({ isMobile: isMobile() });
      });

    console.log('initial state', this._state$.value);
  }

  private patchState(patch: Partial<State>) {
    this._state$.next({ ...this._state$.value, ...patch });
    console.log(this._state$.value);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this._state$.value));
  }

  reset(target: keyof State): void {
    this.patchState({ [target]: INITIAL_APP_STATE[target] });
  }

  resetState(): void {
    this.patchState(INITIAL_APP_STATE);
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

  addPaymentList(pList: Payment[], mode: 'append' | 'replace'): void {
    const paymentList =
      mode === 'append' ? [...this._state$.value.paymentList, ...pList] : pList;
    paymentList.sort((a, b) => b.date - a.date);
    this.patchState({ paymentList });
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

  setSortBy(field: keyof Payment, order: 'asc' | 'desc'): void {
    this.patchState({ sortBy: { field, order } });
  }

  getFilteredPaymentList(): Observable<Payment[]> {
    return this._state$.pipe(
      map(({ paymentList, sortBy }) =>
        paymentList
          .filter((payment) => this.applyFilter(payment))
          .sort((a, b) => {
            const { field, order } = sortBy;
            if (field === 'date') return sortNumber(a.date, b.date, order);
            if (field === 'payee') return sortString(a.payee, b.payee, order);
            if (field === 'expense')
              return sortNumber(a.expense, b.expense, order);
            if (field === 'income')
              return sortNumber(a.income, b.income, order);
            if (field === 'category')
              return sortString(a.category, b.category, order);
            if (field === 'subcategory')
              return sortString(a.subcategory, b.subcategory, order);
            return 0;
          }),
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

  createChartConfig(type: 'standard' | 'history'): void {
    const feature = type === 'standard' ? 'stdChartList' : 'historyChartList';
    const chartId = uuid.v4();
    const stdChart: ChartStandardConfig = {
      chartId,
      configType: 'standard',
      type: null,
      field: null,
      op: null,
    };
    const historyChart: ChartHistoryConfig = {
      chartId,
      configType: 'history',
      period: null,
      op: null,
      dateFormat: null,
    };

    this.patchState({
      [feature]: {
        ...this._state$.value[feature],
        [chartId]: type === 'standard' ? stdChart : historyChart,
      },
    });
  }

  updateStandardChartConfig(
    chartId: string,
    config: Partial<ChartStandardConfig>,
  ): void {
    const chart = this._state$.value.stdChartList[chartId];
    if (!chart) return;
    this.patchState({
      stdChartList: {
        ...this._state$.value.stdChartList,
        [chartId]: { ...chart, ...config, chartId },
      },
    });
  }

  updateHistoryChartConfig(
    chartId: string,
    config: Partial<ChartHistoryConfig>,
  ): void {
    const chart = this._state$.value.historyChartList[chartId];
    if (!chart) return;
    this.patchState({
      historyChartList: {
        ...this._state$.value.historyChartList,
        [chartId]: { ...chart, ...config, chartId },
      },
    });
  }

  getChartData(chartId: string): Observable<ChartConfiguration | null> {
    return combineLatest([
      this.getFilteredPaymentList(),
      this.select('stdChartList'),
      this.select('historyChartList'),
      this.select('theme'),
    ]).pipe(
      map(([paymentList, stdChartList, historyChartList, theme]) => {
        const stdConfig = stdChartList[chartId];
        const historyConfig = historyChartList[chartId];
        if (stdConfig)
          return createChartStandardData(paymentList, stdConfig, theme);
        if (historyConfig)
          return createChartHistoryData(paymentList, historyConfig, theme);
        return null;
      }),
    );
  }

  removeChart(chartId: string): void {
    const stdChartList = this._state$.value.stdChartList;
    const historyChartList = this._state$.value.historyChartList;
    delete stdChartList[chartId];
    delete historyChartList[chartId];
    this.patchState({ stdChartList, historyChartList });
  }

  setTheme(theme: 'dark' | 'light'): void {
    this.patchState({ theme });
    applyTheme(theme);
  }

  toggleDesktopView(): void {
    const desktopView = this._state$.value.desktopView;
    this.patchState({ desktopView: desktopView === 'tabs' ? 'split' : 'tabs' });
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
  const from = filter.from ?? -Infinity;
  const to = filter.to ?? Infinity;
  return value >= from && value <= to;
}

function filterListString(value: string, filter: FilterList): boolean {
  return filter.values.includes(value);
}

function filterString(value: string, filter: FilterString): boolean {
  return value.toLowerCase().includes(filter.value.toLowerCase());
}

function filterNumber(value: number, filter: FilterNumber): boolean {
  const min = filter.min ?? -Infinity;
  const max = filter.max ?? Infinity;
  // if (filter.min === null || filter.max === null) return true;
  return value >= min && value <= max;
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
