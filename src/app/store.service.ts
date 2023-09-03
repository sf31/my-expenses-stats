import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { Payment, PaymentFilter, State } from './app.types';

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

  get state$() {
    return this._state$.asObservable();
  }

  select<T extends keyof State>(
    field: T,
    distinctFn?: (a: State[T], b: State[T]) => boolean,
  ): Observable<State[typeof field]> {
    const defaultFn = (a: State[T], b: State[T]) => a === b;
    return this.state$.pipe(
      map((state) => state[field]),
      distinctUntilChanged(distinctFn ?? defaultFn),
    );
  }

  setPaymentList(paymentList: Payment[]): void {
    this.patchState({ paymentList: paymentList });
  }

  addFilter(field: keyof State['filterList'], filter: PaymentFilter): void {
    const filterList = {
      ...this._state$.getValue().filterList,
      [field]: filter,
    };
    this.patchState({ filterList: filterList });
  }

  removeFilter(field: keyof State['filterList']): void {
    const filterList = { ...this._state$.getValue().filterList };
    delete filterList[field];
    this.patchState({ filterList: filterList });
  }

  resetFilter(): void {
    this.patchState({ filterList: {} });
  }

  getFilteredPaymentList1(): Observable<Payment[]> {
    return this.state$.pipe(
      map(({ paymentList, filterList }) => {
        return paymentList.filter((p) => {
          if (filterList.date)
            return filterDate(p.date, filterList.date.from, filterList.date.to);
          if (filterList.payee)
            return filterString(p.payee, filterList.payee.value);
          if (filterList.expense) {
            const { min, max } = filterList.expense;
            return filterNumber(p.expense, min, max);
          }
          if (filterList.income) {
            const { min, max } = filterList.income;
            return filterNumber(p.income, min, max);
          }
          if (filterList.category)
            return filterListString(p.category, filterList.category.values);
          if (filterList.subcategory)
            return filterListString(
              p.subcategory,
              filterList.subcategory.values,
            );
          return true;
        });
      }),
    );
  }

  getFilteredPaymentList(): Observable<Payment[]> {
    return this.state$.pipe(
      map(({ paymentList, filterList }) => {
        return paymentList.filter((p) => {
          const fieldToFilter = Object.keys(filterList);
          const filter = fieldToFilter.map((field) => {
            const value = p[field as keyof Payment];
            const filter = filterList[field as keyof State['filterList']];
            switch (filter.type) {
              case 'date':
                return filterDate(value, filter.from, filter.to);
            }
          });

          if (filterList.date)
            return filterDate(p.date, filterList.date.from, filterList.date.to);
          if (filterList.payee)
            return filterString(p.payee, filterList.payee.value);
          if (filterList.expense) {
            const { min, max } = filterList.expense;
            return filterNumber(p.expense, min, max);
          }
          if (filterList.income) {
            const { min, max } = filterList.income;
            return filterNumber(p.income, min, max);
          }
          if (filterList.category)
            return filterListString(p.category, filterList.category.values);
          if (filterList.subcategory)
            return filterListString(
              p.subcategory,
              filterList.subcategory.values,
            );
          return true;
        });
      }),
    );
  }

  getCategoryList(): Observable<string[]> {
    return this.state$.pipe(
      map(({ paymentList }) => {
        const categories = paymentList.map((p) => p.category);
        return [...new Set(categories)];
      }),
    );
  }

  getSubcategoryList(): Observable<string[]> {
    return this.state$.pipe(
      map(({ paymentList }) => {
        const subcategories = paymentList.map((p) => p.subcategory);
        return [...new Set(subcategories)];
      }),
    );
  }
}

function filterDate(date: Date, from: Date, to: Date): boolean {
  return date >= from && date <= to;
}

function filterListString(str: string, list: string[]): boolean {
  return list.includes(str.toLowerCase());
}

function filterString(str: string, filter: string): boolean {
  return str.toLowerCase().includes(filter.toLowerCase());
}

function filterNumber(num: number, from: number, to: number): boolean {
  return num >= from && num <= to;
}
