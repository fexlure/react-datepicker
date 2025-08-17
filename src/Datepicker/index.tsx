import { IDatePicker, TVisibleCalendar } from './interfaces.ts';
import './calendar.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from './hooks/useTranslation.ts';
import calendarSvg from '../assets/calendar.svg';
import { useOnClickOutside } from './hooks/useClickOutside.ts';
import { currentDate, calendar, dateToShowFormat } from './utils.ts';
import { Days } from './components/days.tsx';
import { Months } from './components/months.tsx';
import { Years } from './components/years.tsx';

const Datepicker = (props: IDatePicker) => {
  const {
    value,
    calendarStyles,
    globalStyles,
    locale = 'en',
    max,
    min,
    onChange,
    type = 'full',
    showFormat = type === 'full' ? 'DD/MM/YYYY' : 'MM/YYYY',
    placeholder = showFormat,
    mainColor = '#2F8DB3',
    hideResetButton,
    alwaysOpened,
  } = props;
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.month);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.year);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value) {
      const date = typeof value === 'object' ? value : new Date(value);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      setSelectedYear(year);
      setSelectedMonth(month);
    }
  }, [value]);
  const [visibleCalendar, setVisibleCalendar] = useState<TVisibleCalendar>(
    alwaysOpened ? 'days' : null,
  );
  const displayData = useMemo(() => {
    return calendar(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);
  const { t } = useTranslation(locale);
  //
  const label = useMemo(() => {
    return value ? dateToShowFormat(showFormat, value) : placeholder;
  }, [placeholder, value]);
  const changeVisible = () => {
    if (!alwaysOpened) {
      setVisibleCalendar((prevState) => {
        if (!prevState) {
          return type === 'month' ? 'months' : 'days';
        } else {
          return null;
        }
      });
    }
  };
  const selectDay = (
    day: number,
    year: number = selectedYear,
    month: number = selectedMonth - 1,
  ) => {
    const selected = new Date(year, month, day);
    onChange(selected);
    if (!alwaysOpened) setVisibleCalendar(null);
  };
  const closeCalendar = () => {
    if (!alwaysOpened) {
      setVisibleCalendar(null);
    }
  };
  useOnClickOutside(calendarRef, closeCalendar, alwaysOpened);
  function selectToday() {
    const date = new Date();
    if (min) {
      if (date > new Date(min)) {
        onChange(date);
      }
    } else if (max) {
      if (date < new Date(max)) {
        onChange(date);
      }
    } else {
      onChange(date);
    }
  }
  function resetDate() {
    onChange(undefined);
  }
  const toLeft = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prevState) => prevState - 1);
    } else {
      setSelectedMonth((prevState) => prevState - 1);
    }
  };

  const toRight = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prevState) => Number(prevState) + 1);
    } else {
      setSelectedMonth((prevState) => Number(prevState) + 1);
    }
  };
  const showYears = () => setVisibleCalendar('years');
  const showMonths = () => setVisibleCalendar('months');
  const CurrentShow = () => {
    switch (visibleCalendar) {
      case 'years':
        return (
          <Years
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            setVisibleCalendar={setVisibleCalendar}
            mainColor={mainColor}
          />
        );
      case 'months':
        return (
          <Months
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
            setVisibleCalendar={setVisibleCalendar}
            onChange={onChange}
            mainColor={mainColor}
            lang={locale}
            type={type}
          />
        );
      case 'days':
        return (
          <Days
            locale={locale}
            mainColor={mainColor}
            selectDay={selectDay}
            toLeft={toLeft}
            toRight={toRight}
            selectedMonth={selectedMonth}
            showYears={showYears}
            showMonths={showMonths}
            selectedYear={selectedYear}
            displayData={displayData}
            value={value}
            min={min}
            max={max}
          />
        );
    }
  };
  return (
    <div
      className={'calendar-container'}
      ref={calendarRef}
      style={{
        background: alwaysOpened ? 'none' : '#edf2f7',
        height: alwaysOpened ? 0 : '#edf2f7',
        padding: alwaysOpened ? 0 : '10px 12px',
        ...globalStyles,
      }}
    >
      {!alwaysOpened && (
        <div onClick={changeVisible} className={'panel-container'}>
          <label style={{ color: value ? '#2E2E36' : '#7E7E7E' }}>
            {String(label)}
          </label>
          <img src={calendarSvg} alt={'calendar'} />
        </div>
      )}
      {visibleCalendar && (
        <div className={'data-container'} style={{ ...calendarStyles }}>
          <CurrentShow />
          <div className={'action-buttons'}>
            {hideResetButton ? (
              <span></span>
            ) : (
              <button
                onClick={resetDate}
                type={'button'}
                style={{ color: mainColor }}
              >
                {t('reset')}
              </button>
            )}
            <button
              onClick={selectToday}
              type={'button'}
              style={{ color: mainColor }}
            >
              {t('today')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Datepicker;
