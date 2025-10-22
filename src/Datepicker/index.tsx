import { IDatePicker, TVisibleCalendar } from './interfaces.ts';
import './calendar.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from './hooks/useTranslation.ts';
import calendarSvg from '../assets/calendar.svg';
import { useOnClickOutside } from './hooks/useClickOutside.ts';
import { currentDate, calendar, dateToShowFormat, parseDateFromInput, validateDateInRange, formatInputByShowFormat, getMaskMaxLength } from './utils.ts';
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
    hideIcon,
    bg
  } = props;
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.month);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.year);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState<string>(
    value ? dateToShowFormat(showFormat, value) : '',
  );

  useEffect(() => {
    if (value) {
      const date = typeof value === 'object' ? value : new Date(value);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      setSelectedYear(year);
      setSelectedMonth(month);
    }
  }, [value]);
  useEffect(() => {
    setInputValue(value ? dateToShowFormat(showFormat, value) : '');
  }, [value, showFormat]);
  const [visibleCalendar, setVisibleCalendar] = useState<TVisibleCalendar>(
    alwaysOpened ? 'days' : null,
  );
  const displayData = useMemo(() => {
    return calendar(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);
  const { t } = useTranslation(locale);
  // input label not used anymore due to manual input
  const applyInput = () => {
    const raw = String(inputValue || '').trim();
    if (!raw) {
      onChange(undefined);
      return;
    }
    const parsed = parseDateFromInput(showFormat, raw, type);
    if (!parsed) {
      return;
    }
    const range = validateDateInRange(parsed, min, max);
    if (!range.valid) {
      return;
    }
    onChange(parsed);
    setSelectedYear(parsed.getFullYear());
    setSelectedMonth(parsed.getMonth() + 1);
  };
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
        background: alwaysOpened ? 'none' : bg || '#edf2f7',
        height: alwaysOpened ? 0 : '44px',
        padding: alwaysOpened ? 0 : '10px 12px',
        ...globalStyles,
      }}
    >
      {!alwaysOpened && (
        <div onClick={changeVisible} className={'panel-container'}>
          <input
            className={`calendar-input`}
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
              const masked = formatInputByShowFormat(showFormat, e.target.value);
              setInputValue(masked);
            }}
            onClick={(e) => e.stopPropagation()}
            onBlur={applyInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyInput();
              }
              if (e.key === 'Escape') {
                setInputValue(value ? dateToShowFormat(showFormat, value) : '');

                (e.target as HTMLInputElement).blur();
              }
              if (e.key === 'Backspace') {
                const el = e.target as HTMLInputElement;
                const start = el.selectionStart ?? inputValue.length;
                const end = el.selectionEnd ?? start;
                if (start === end && start > 0) {
                  const prevChar = inputValue.charAt(start - 1);
                  if (!/\d/.test(prevChar)) {
                    e.preventDefault();
                    const masked = inputValue;
                    // find previous digit position to the left
                    let p = start - 2;
                    while (p >= 0 && !/\d/.test(masked.charAt(p))) p--;
                    if (p < 0) return;
                    const digitIndex = masked
                      .slice(0, p + 1)
                      .replace(/\D/g, '').length - 1;
                    const digitsOnly = masked.replace(/\D/g, '');
                    const newDigits =
                      digitsOnly.slice(0, digitIndex) + digitsOnly.slice(digitIndex + 1);
                    const newMasked = formatInputByShowFormat(showFormat, newDigits);
                    setInputValue(newMasked);
                    // place caret after the position of removed digit (by digit count)
                    const targetDigitCount = digitIndex;
                    requestAnimationFrame(() => {
                      const el2 = inputRef.current;
                      if (!el2) return;
                      let count = 0;
                      let pos = 0;
                      for (; pos < newMasked.length; pos++) {
                        if (/\d/.test(newMasked.charAt(pos))) {
                          if (count === targetDigitCount) break;
                          count++;
                        }
                      }
                      el2.setSelectionRange(pos, pos);
                    });
                  }
                }
              }
            }}
            style={{ color: '#2E2E36' }}
            maxLength={getMaskMaxLength(showFormat)}
            ref={inputRef}
          />
          {!hideIcon &&  <img src={calendarSvg} alt={'calendar'} />}
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
