import { State } from './app.types';
import { INITIAL_APP_STATE, LOCAL_STORAGE_KEY } from './app.const';
import { DateTime } from 'luxon';

export function notNullOrUndefined<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}

export function removeElementFromArray<T>(
  array: T[],
  element: T,
  key?: keyof T,
): T[] {
  const elementIndex = getElementIndex(array, element, key);
  return removeElementFromArrayByIndex(array, elementIndex);
}

export function removeElementFromArrayByIndex<T>(
  array: T[],
  index: number,
): T[] {
  return index !== -1
    ? [...array.slice(0, index), ...array.slice(index + 1)]
    : array;
}

export function upsertElementInArray<T>(
  array: T[],
  element: T,
  key?: keyof T,
): T[] {
  const elementIndex = getElementIndex(array, element, key);
  return elementIndex !== -1
    ? [
        ...array.slice(0, elementIndex),
        element,
        ...array.slice(elementIndex + 1),
      ]
    : [...array, element];
}

export function getElementIndex<T>(
  array: T[],
  element: T,
  key?: keyof T,
): number {
  if (key === undefined)
    return array.findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(element),
    );
  return array.findIndex((item: any) => {
    if (item[key] === undefined) return false;
    return item[key] === (element as any)[key];
  });
}

export function insertElementArrayAtIndex<T>(
  array: T[],
  elem: T,
  index: number,
): T[] {
  if (index < 0 || index > array.length - 1) throw Error('Invalid index');
  return [...array.slice(0, index), elem, ...array.slice(index + 1)];
}

export function addElementArrayAtIndex<T>(
  array: T[],
  elem: T,
  index: number,
): T[] {
  if (index < 0 || index > array.length) throw Error('Invalid index');
  const newArray = [...array];
  newArray.splice(index, 0, elem);
  return newArray;
}

export function flatArray<T>(array: T[][]): T[] {
  return Array.prototype.concat.apply([], array);
}

export function removeDuplicate<T>(array: T[], key: string | number): T[] {
  return array.filter((item: any, index: number, self: T[]) => {
    if (!item.hasOwnProperty(key)) return item;
    return self.findIndex((i: any) => i[key] === item[key]) === index;
  });
}

export function moveElement<T>(array: T[], from: number, to: number): T[] {
  if (from > array.length) throw Error('Invalid "from" index');
  if (to > array.length || to < 0) throw Error('Invalid "to" index');
  const fromElement = array[from];
  const addIndex = from < to ? to + 1 : to;
  const removeIndex = from < to ? from : from + 1;
  const newArray = addElementArrayAtIndex<T>(array, fromElement, addIndex);
  return removeElementFromArrayByIndex<T>(newArray, removeIndex);
}

/**
 * Return a random number (int) between `min` and `max` INCLUDED.
 */
export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// todo add validation from localStorage
export function getInitialState(): State {
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!local) return INITIAL_APP_STATE;
  return { ...JSON.parse(local), isMobile: isMobile() };
}

export function unixToFormat(unix: number, format: string): string {
  return DateTime.fromSeconds(unix).toFormat(format);
}

export function isMobile(): boolean {
  return window.innerWidth <= 768;
}

function isNumber(str: any): boolean {
  const regex = /^-?\d+(\.\d+)?$/;
  return regex.test(str);
}
