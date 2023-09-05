import { ChartConfig, ChartData, Payment } from '../app.types';

export function createChartConfig(
  paymentList: Payment[],
  config: ChartConfig,
): ChartData {
  const labels: string[] = [];
  const data: number[] = [];
  const partial: { [k: string]: number } = {};

  for (let i = 0; i < paymentList.length; i++) {
    const payment = paymentList[i];
    const fieldValue = valueToString(payment[config.field]);
    const value = getValue(payment, config);
    partial[fieldValue] = (partial[fieldValue] ?? 0) + value;
  }

  Object.keys(partial).forEach((key) => {
    const sum = partial[key];
    labels.push(key);
    data.push(sum);
  });

  return { labels, data, ...config };
}

export function historicalChart(paymentList: Payment[]): any {
  const sorted = [...paymentList].sort((p1, p2) =>
    p1.date >= p2.date ? 1 : -1,
  );
  const first = sorted[0].date;
  const last = sorted[sorted.length - 1].date;
  // const daily: { day: DateTime, list: Payment[]} = {}
}

function valueToString(value: string | Date | number): string {
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  return `${value}`;
}

function getValue(payment: Payment, config: ChartConfig): number {
  if (config.op === 'expense') return payment.expense;
  if (config.op === 'income') return payment.income;
  return 1;
}

function stringToHexColorCopilot(value: string): string {
  const hash = value
    .split('')
    .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const hue = hash % 360;
  return `hsl(${hue}, 50%, 50%)`;
}

export function stringToHexColor(str: string): string {
  let hash = 0;
  str
    .split('')
    .forEach((char) => (hash = char.charCodeAt(0) + ((hash << 5) - hash)));
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, '0');
  }
  return colour;
}
