import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import {
  Filter,
  FilterDate,
  FilterList,
  FilterNumber,
  FilterString,
  Payment,
  State,
} from './app.types';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly LSK_STATE = 'my-expenses-stats-state';

  constructor() {
    const state = localStorage.getItem(this.LSK_STATE);
    if (state) this._state$.next(JSON.parse(state));
  }

  private _state$ = new BehaviorSubject<State>({
    paymentList: [],
    filterList: {},
  });

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

function filterDate(value: Date, filter: FilterDate): boolean {
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
