import {
  ChartHistoryConfig,
  ChartStandardConfig,
  HistoryChartData,
  Payment,
} from './app.types';
import { DateTime } from 'luxon';
import { unixToFormat } from './utils';
import { ChartConfiguration } from 'chart.js';

export function createChartStandardData(
  paymentList: Payment[],
  config: ChartStandardConfig,
  theme: 'dark' | 'light',
): ChartConfiguration {
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

  return {
    type: config.type,
    data: { labels, datasets: [{ data }] },
    options: getChartOptions(theme, config.type),
  };
}

export function createChartHistoryData(
  paymentList: Payment[],
  config: ChartHistoryConfig,
  theme: 'dark' | 'light',
): ChartConfiguration {
  const labels: (number | string)[] = [];
  const data: number[] = [];
  const paymentsByPeriod = splitByPeriod(paymentList);

  Object.keys(paymentsByPeriod[config.period]).forEach((unix) => {
    const payments = paymentsByPeriod[config.period][parseInt(unix)];
    const sum = payments.reduce((acc, p) => acc + p.expense, 0);
    // labels.push(parseInt(unix) * 1000); //unixToFormat(parseInt(unix), 'dd MMM yyyy'));
    labels.push(unixToFormat(parseInt(unix), config.dateFormat));
    data.push(sum);
  });

  return {
    type: 'line',
    data: { labels, datasets: [{ data }] },
    options: getChartOptions(theme),
  };
}

function getChartOptions(
  theme: 'dark' | 'light',
  type?: ChartConfiguration['type'],
): ChartConfiguration['options'] {
  const fontColor = theme === 'dark' ? '#ffffff' : '#333333';
  const color = theme === 'dark' ? '#ffffff' : '#2962FF';
  return {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales:
      type === 'pie' || type === 'doughnut'
        ? undefined
        : {
            x: { ticks: { color: fontColor, maxRotation: 25 } },
            y: { ticks: { color: fontColor, maxRotation: 0 } },
          },
    elements: {
      line: { tension: 0.2, borderColor: color },
      bar: { backgroundColor: color },
      point: { radius: 0 },
    },
    datasets: {
      // pie: {  },
    },
  };
}

function splitByPeriod(paymentList: Payment[]): HistoryChartData {
  const result: HistoryChartData = {
    daily: {},
    weekly: {},
    monthly: {},
    yearly: {},
  };

  for (let i = 0; i < paymentList.length; i++) {
    const payment = paymentList[i];
    const dt = DateTime.fromSeconds(payment.date, { zone: 'utc' });
    const day = payment.date;
    const week = dt.startOf('week').toUnixInteger();
    const month = dt.startOf('month').toUnixInteger();
    const year = dt.startOf('year').toUnixInteger();
    result['daily'][day] = [...(result['daily'][day] ?? []), payment];
    result['weekly'][week] = [...(result['weekly'][week] ?? []), payment];
    result['monthly'][month] = [...(result['monthly'][month] ?? []), payment];
    result['yearly'][year] = [...(result['yearly'][year] ?? []), payment];
  }

  return result;
}

function valueToString(value: string | Date | number): string {
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  return `${value}`;
}

function getValue(payment: Payment, config: ChartStandardConfig): number {
  if (config.op === 'expense') return payment.expense;
  if (config.op === 'income') return payment.income;
  return 1;
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

const a: ChartConfiguration = {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  },
};
