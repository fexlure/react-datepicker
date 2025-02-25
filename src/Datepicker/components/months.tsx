import { IMonths } from '../interfaces.ts';
import { currentDate, shortlyMonths } from '../utils.ts';
import { useTranslation } from '../hooks/useTranslation.ts';
import toRightSvg from '../../assets/to_right.svg';
import toLeftSvg from '../../assets/to_left.svg';

export const Months = (props: IMonths) => {
  const {
    selectedYear,
    lang,
    setSelectedMonth,
    selectedMonth,
    mainColor,
    setSelectedYear,
    type,
    setVisibleCalendar,
    onChange,
  } = props;
  const { t } = useTranslation(lang);

  const toLeft = () => {
    if (selectedYear > currentDate.year - 100) {
      setSelectedYear((prevState) => Number(prevState) - 1);
    }
  };
  const toRight = () => {
    if (selectedYear < currentDate.year + 100) {
      setSelectedYear((prevState) => Number(prevState) + 1);
    }
  };

  const selectMonth = (month: number) => {
    const selected = new Date(selectedYear, month - 1);
    onChange(selected);
    setSelectedMonth(month);
    setVisibleCalendar(type === 'month' ? null : 'days');
  };

  const closeBlock = () => setVisibleCalendar(type === 'month' ? null : 'days');
  return (
    <>
      <div className={'top-panel'}>
        <button type={'button'} onClick={toLeft}>
          <img src={toLeftSvg} alt={'left'} />
        </button>
        <label onClick={closeBlock} style={{ cursor: 'pointer' }}>
          {selectedYear}
        </label>
        <button type={'button'} onClick={toRight}>
          <img src={toRightSvg} alt={'right'} />
        </button>
      </div>
      <div className={'years-data'}>
        {shortlyMonths.map((item) => {
          return (
            <button
              onClick={() => selectMonth(item.value)}
              key={item.value}
              type={'button'}
              style={{
                background:
                  Number(item.value) === selectedMonth ? mainColor : 'none',
                color:
                  Number(item.value) === selectedMonth ? 'white' : '#2E2E36',
              }}
            >
              {t(item.label)}
            </button>
          );
        })}
      </div>
    </>
  );
};
