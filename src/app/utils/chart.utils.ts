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
