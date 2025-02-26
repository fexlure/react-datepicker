const numberToArray = (size: number) =>
  Array.from({ length: size }, (_, i) => i + 1);

export function years(currentYear: number) {
  const prevYears = Array.from({ length: 1 }).map(
    (_, k) => Number(currentYear) - k,
  );
  const aftYears = Array.from({ length: 11 }).map(
    (_, k) => Number(currentYear) + 1 + k,
  );
  return [...prevYears, ...aftYears].sort();
}
export function calendar(selectedMonth: number, selectedYear: number) {
  if ([1, 3, 5, 7, 8, 10, 12].includes(Number(selectedMonth))) {
    return numberToArray(31);
  } else if ([4, 6, 9, 11].includes(Number(selectedMonth))) {
    return numberToArray(30);
  } else {
    const isLeap = new Date(Number(selectedYear), 1, 29).getMonth() === 1;
    return isLeap ? numberToArray(29) : numberToArray(28);
  }
}

export const shortlyMonths: Array<{ value: number; label: string }> = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' },
];

export const monthList: Array<string> = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function returnedDate(
  year: number,
  month: number,
  item: number,
  type: string,
) {
  switch (type) {
    case 'unix':
      return Math.floor(new Date(year, month, item).getTime() / 1000);
    case 'date':
      return new Date(year, month, item);
  }
}

const date = new Date();

export const currentDate = {
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
};

export function dateToShowFormat(
  showFormat: string,
  date: Date | string,
): string {
  const newDate = typeof date === 'object' ? date : new Date(date);
  const day = String(newDate.getDate()).padStart(2, '0');
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const year = String(newDate.getFullYear());
  const shortYear = year.slice(2);
  return showFormat
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year)
    .replace('YY', shortYear);
}
