import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { State } from './types/State';
import { Payment } from './types/Payment';
import { removeElementFromArray, upsertElementInArray } from './utils/utils';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor() {
    const state = localStorage.getItem('state');
    if (state) this._state$.next(JSON.parse(state));
  }

  private _state$ = new BehaviorSubject<State>({
    paymentList: [],
  });

  private patchState(patch: Partial<State>) {
    this._state$.next({ ...this._state$.value, ...patch });
    localStorage.setItem('state', JSON.stringify(this._state$.value));
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

  upsertPayment(payment: Payment) {
    const paymentList = upsertElementInArray<Payment>(
      this._state$.getValue().paymentList,
      payment,
      'id',
    );
    this.patchState({ paymentList });
  }

  setPaymentList(paymentList: Payment[]) {
    this.patchState({ paymentList });
  }

  deletePayment(payment: Payment) {
    const paymentList = removeElementFromArray<Payment>(
      this._state$.getValue().paymentList,
      payment,
      'id',
    );
  }
}
