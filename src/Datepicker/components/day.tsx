import { IDay } from '../interfaces.ts';
import { currentDate, returnedDate } from '../utils.ts';
import { useMemo } from 'react';

export const Day = (props: IDay) => {
  const {
    selectDay,
    item,
    selectedMonth,
    selectedYear,
    max,
    min,
    mainColor,
    value,
  } = props;

  const checkMinDate = useMemo(() => {
    if (min) {
      const selectedDate = Number(
        returnedDate(selectedYear, selectedMonth - 1, item, 'unix'),
      );
      const minDate = new Date(min).getTime() / 1000;
      return selectedDate < minDate;
    }
  }, [selectedYear, selectedMonth]);

  const checkMaxDate = useMemo(() => {
    if (max) {
      const selectedDate = Number(
        returnedDate(selectedYear, selectedMonth - 1, item, 'unix'),
      );
      const maxDate = new Date(max).getTime() / 1000;
      return selectedDate < maxDate;
    }
  }, [selectedYear, selectedMonth]);
  return (
    <button
      type={'button'}
      className={`hover-class ${checkMinDate && 'inactive'} ${checkMaxDate && 'inactive'}`}
      onClick={() => !checkMinDate && !checkMaxDate && selectDay(item)}
      value={item}
      style={{
        background:
          value &&
          value.toLocaleDateString() ===
            new Date(selectedYear, selectedMonth - 1, item).toLocaleDateString()
            ? mainColor
            : new Date(
                  currentDate.year,
                  currentDate.month,
                  item,
                ).toLocaleDateString() ===
                  new Date(
                    selectedYear,
                    selectedMonth,
                    item,
                  ).toLocaleDateString() && item === currentDate.day
              ? '#D8DDED'
              : 'none',
        color:
          value &&
          value.toLocaleDateString() ===
            new Date(selectedYear, selectedMonth - 1, item).toLocaleDateString()
            ? 'white'
            : '#2E2E36',
      }}
    >
      {item}
    </button>
  );
};
