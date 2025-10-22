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
  if (date) {
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
  } else {
    return showFormat;
  }
}

export function getDaysInMonth(year: number, month: number): number {
  const isLeap = new Date(Number(year), 1, 29).getMonth() === 1;
  if ([1, 3, 5, 7, 8, 10, 12].includes(Number(month))) return 31;
  if ([4, 6, 9, 11].includes(Number(month))) return 30;
  return isLeap ? 29 : 28;
}

export function parseDateFromInput(
  showFormat: string,
  input: string,
  type: 'full' | 'month',
): Date | null {
  const trimmed = String(input || '').trim();
  if (!trimmed) return null;
  const tokenMatches = Array.from(showFormat.matchAll(/(DD|MM|YYYY)/g)).map(
    (m) => m[0],
  );
  if (tokenMatches.length === 0) return null;
  const sepPattern = '[\\.\\/\\-\\s]';
  const pattern = showFormat
    .replace(/DD|MM|YYYY/g, (m) => {
      switch (m) {
        case 'DD':
          return '(\\d{1,2})';
        case 'MM':
          return '(\\d{1,2})';
        case 'YYYY':
          return '(\\d{4})';
        default:
          return '';
      }
    })
    .replace(/[^DMY]/g, sepPattern);
  const regex = new RegExp('^' + pattern + '$');
  const match = trimmed.match(regex);
  if (!match) return null;
  const groups = match.slice(1);
  let day = 1;
  let month = 1;
  let year = new Date().getFullYear();
  tokenMatches.forEach((token, idx) => {
    const value = Number(groups[idx]);
    if (token === 'DD') day = value;
    if (token === 'MM') month = value;
    if (token === 'YYYY') year = value;
  });
  if (type === 'month') {
    day = 1;
  }
  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
    return null;
  }
  if (month < 1 || month > 12) return null;
  const maxDay = getDaysInMonth(year, month);
  if (day < 1 || day > maxDay) return null;
  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export function validateDateInRange(
  date: Date,
  min?: string,
  max?: string,
): { valid: boolean; reason?: 'min' | 'max' } {
  if (min) {
    const minDate = new Date(min);
    if (date < minDate) {
      return { valid: false, reason: 'min' };
    }
  }
  if (max) {
    const maxDate = new Date(max);
    if (date > maxDate) {
      return { valid: false, reason: 'max' };
    }
  }
  return { valid: true };
}

type Token = 'DD' | 'MM' | 'YYYY';

function tokenLength(token: Token): number {
  switch (token) {
    case 'DD':
    case 'MM':
      return 2;
    case 'YYYY':
      return 4;
  }
}

export function describeShowFormat(showFormat: string): {
  tokens: Token[];
  seps: string[]; // seps.length === tokens.length - 1
  digitsTotal: number;
  maskLength: number; // full length including separators when fully filled
} {
  const matches = Array.from(showFormat.matchAll(/(YYYY|DD|MM)/g));
  const tokens = matches.map((m) => m[0] as Token);
  const seps: string[] = [];
  for (let i = 0; i < matches.length - 1; i++) {
    const curr = matches[i];
    const next = matches[i + 1];
    const currEnd = (curr.index ?? 0) + curr[0].length;
    const sep = showFormat.slice(currEnd, next.index);
    seps.push(sep);
  }
  const digitsTotal = tokens.reduce((s, t) => s + tokenLength(t), 0);
  const sepsTotalLen = seps.reduce((s, x) => s + x.length, 0);
  const maskLength = digitsTotal + sepsTotalLen;
  return { tokens, seps, digitsTotal, maskLength };
}

export function formatInputByShowFormat(
  showFormat: string,
  input: string,
): string {
  const { tokens, seps, digitsTotal } = describeShowFormat(showFormat);
  const digitsOnly = String(input || '').replace(/\D/g, '').slice(0, digitsTotal);
  let out = '';
  let pos = 0;

  function produceForToken(token: Token): { produced: string; consumed: number } {
    if (token === 'YYYY') {
      const chunk = digitsOnly.slice(pos, pos + 4);
      return { produced: chunk, consumed: chunk.length };
    }
    // Day/Month rules
    const rem = digitsOnly.slice(pos);
    if (rem.length === 0) return { produced: '', consumed: 0 };
    const d1 = rem.charAt(0);
    if (token === 'MM') {
      // If first digit > 1, auto-pad with leading zero
      if (Number(d1) > 1) {
        return { produced: '0' + d1, consumed: 1 };
      }
      if (rem.length >= 2) {
        let d2 = rem.charAt(1);
        if (d1 === '1' && Number(d2) > 2) d2 = '2';
        if (d1 === '0' && d2 === '0') d2 = '1';
        return { produced: d1 + d2, consumed: 2 };
      }
      return { produced: d1, consumed: 1 };
    }
    // 'DD'
    if (Number(d1) > 3) {
      return { produced: '0' + d1, consumed: 1 };
    }
    if (rem.length >= 2) {
      let d2 = rem.charAt(1);
      if (d1 === '3' && Number(d2) > 1) d2 = '1';
      if (d1 === '0' && d2 === '0') d2 = '1';
      return { produced: d1 + d2, consumed: 2 };
    }
    return { produced: d1, consumed: 1 };
  }

  for (let i = 0; i < tokens.length; i++) {
    const { produced, consumed } = produceForToken(tokens[i]);
    out += produced;
    pos += consumed;
    const need = tokenLength(tokens[i]);
    if (produced.length === need && i < seps.length) {
      out += seps[i];
    }
    if (pos >= digitsOnly.length) break;
  }
  return out;
}

export function getMaskMaxLength(showFormat: string): number {
  return describeShowFormat(showFormat).maskLength;
}
