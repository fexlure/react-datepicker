import { CSSProperties, Dispatch, ReactNode, SetStateAction } from 'react';

export type TLang = 'en' | 'ru' | 'fr';
type TCalendarType = 'full' | 'month';
export type LangJSON = Record<string, string>;
export type TVisibleCalendar = null | 'days' | 'months' | 'years';
export interface IDatePicker {
  value?: Date | string;
  onChange: Dispatch<SetStateAction<Date | string | undefined>>;
  locale?: TLang;
  type?: TCalendarType;
  calendarStyles?: CSSProperties;
  placeholder?: string;
  globalStyles?: CSSProperties;
  min?: string;
  max?: string;
  showFormat?: string;
  mainColor?: string;
  alwaysOpened?: boolean;
  hideResetButton?: boolean;
  customIcon?: ReactNode;
  bg?: string
}

export interface IYears {
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  setVisibleCalendar: Dispatch<SetStateAction<TVisibleCalendar>>;
  mainColor: string;
}

export interface IMonths {
  onChange: (value?: Date) => void;
  type: TCalendarType;
  selectedMonth: number;
  setVisibleCalendar: Dispatch<SetStateAction<TVisibleCalendar>>;
  selectedYear: number;
  lang: TLang;
  setSelectedMonth: Dispatch<SetStateAction<number>>;
  mainColor: string;
  setSelectedYear: Dispatch<SetStateAction<number>>;
}

export interface IDays {
  locale: TLang;
  mainColor: string;
  selectDay: (day: number) => void;
  toLeft(): void;
  toRight(): void;
  selectedMonth: number;
  showYears(): void;
  selectedYear: number;
  showMonths(): void;
  value?: Date | string;
  displayData: Array<number>;
  min?: string;
  max?: string;
}

export interface IDay {
  selectDay: (day: number) => void;
  item: number;
  value?: Date | string;
  selectedYear: number;
  selectedMonth: number;
  mainColor: string;
  min?: string;
  max?: string;
}
