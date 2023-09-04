import { ChartConfig, ChartData, Payment } from '../app.types';

export function createChartConfig(
  paymentList: Payment[],
  config: ChartConfig,
): ChartData {
  const labels: string[] = [];
  const data: number[] = [];

  // contains partial count for each unique value
  // example: { 'Food': 2, 'Rent': 3, 'Bills': 1 }
  const partial: { [k: string]: number } = {};

  for (let i = 0; i < paymentList.length; i++) {
    const payment = paymentList[i];
    const value = payment[config.field];

    if (typeof value === 'string') partial[value] = (partial[value] ?? 0) + 1;

    if (value instanceof Date) {
      const iso = value.toISOString();
      partial[iso] = (partial[iso] ?? 0) + 1;
    }

    // pointless?
    if (typeof value === 'number')
      partial[`${value}`] = (partial[`${value}`] ?? 0) + 1;
  }

  Object.keys(partial).forEach((key) => {
    const sum = partial[key];
    labels.push(key);
    data.push(sum);
  });

  return { labels, data, ...config };
}
