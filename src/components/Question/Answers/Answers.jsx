import { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import Picker from 'react-mobile-picker';
import cl from './Answers.module.css';

const unitStartValues = {
  'кг': 60,
  'см': 170,
};

const getMonth = () => {
  // const month = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];

  return new Date().getMonth();
};

const getDay = () => {
  return new Date().getDate();
};

const getYear = () => {
  return new Date().getFullYear();
};

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const Answers = ({ type, answers }) => {
  // const [answer, setAnswer] = useState(null);

  switch (type) {
    case 'radio': {
      return (
        <ul className={cl.radioList}>
          {!!answers.options && answers.options.map(el => (
            <label key={el.value} htmlFor={el.value} className={cl.radioItem}>
              <input type="radio" name={type} id={el.value} value={el.value}/>
              <span className={cl.checkmark}></span>
              {el.title}
            </label>
          ))}
        </ul>
      );
    }

    case 'count': {
      return (
        <NumberPicker
          type={type}
          answers={answers}
          startValue={unitStartValues[answers.unit] || 2}
        />
      );
    }

    case 'date': {
      return (
        <DatePicker />
      );
    }

    case 'input': {
      return (
        <>
          {answers.options.map(({ title, unit }) => (
            <CustomInput
              key={title}
              title={title}
              unit={unit}
            />
          ))}
        </>
      );
    }

    case 'check': {
      return (
        <Checkboxes answers={answers} />
      );
    }
  }
};

const NumberPicker = ({ type, answers: { unit }, startValue }) => {
  const [value, setValue] = useState({ [type]: startValue });

  useEffect(() => setValue({ [type]: startValue }), [startValue, type]);

  const range = [];

  for (let i = 1; i < 250; i++) {
    range.push(i);
  }

  return (
  <Picker
    value={value}
    onChange={setValue}
    height={100}
    itemHeight={33}
    className={cl.picker}
  >
    <Picker.Column name={type} className={cl.column}>
      {range.map(el => (
        <Picker.Item value={el} key={el}>
          {el}
        </Picker.Item>
      ))}
    </Picker.Column>
    <div className={cl.mask}>
      {unit && <span className={cl.unit}>{unit}</span>}
    </div>
  </Picker>
  )
};

const DatePicker = () => {
  const [value, setValue] = useState({
    month: getMonth(),
    day: getDay(),
    year: getYear()
  });

  const years = useMemo(() => {
    const result = [];

    for (let i = 1900; i <= +getYear(); i++) {
      result.push(i);
    }

    return result;
  }, []);

  const months = useMemo(() => {
    const allMonths = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];

    if (value.year === getYear()) {
      return allMonths.slice(0, getMonth() + 1);
    }

    return allMonths;
  }, [value]);

  const days = useMemo(() => {
    const result = [];
    let limit = getDaysInMonth(value.month + 1, value.year);

    if (value.month === getMonth() && value.year === getYear()) {
      limit = getDay();
    }

    for (let i = 1; i <= limit; i++) {
      result.push(i);
    }

    return result;
  }, [value]);

  const changeHandler = useCallback((newValue) => {
    let result = {...newValue};

    if (result.year === getYear() && result.month >= getMonth()) {
      result = {...result, month: getMonth()};

      if (result.day > getDay()) {
        result = {...result, day: getDay()};
      }
    }

    if (result.day > getDaysInMonth(result.month + 1, result.year)) {
      result = {...result, day: getDaysInMonth(result.month + 1, result.year)};
    }

    setValue(result);
  }, [])

  return (
  <Picker
    value={value}
    onChange={changeHandler}
    height={100}
    itemHeight={33}
    className={cl.picker + ' ' + cl.datePicker}
  >
    <Picker.Column name={'month'} className={cl.column}>
      {months.map((el, i) => (
        <Picker.Item value={i} key={el}>
          {el}
        </Picker.Item>
      ))}
    </Picker.Column>

    <Picker.Column name={'day'} className={cl.column}>
      {days.map(el => (
        <Picker.Item value={el} key={el}>
          {el}
        </Picker.Item>
      ))}
    </Picker.Column>

    <Picker.Column name={'year'} className={cl.column}>
      {years.map(el => (
        <Picker.Item value={el} key={el}>
          {el}
        </Picker.Item>
      ))}
    </Picker.Column>
    <div className={cl.mask} />
  </Picker>
  )
};

const CustomInput = ({ title, unit }) => {
  const [value, setValue] = useState('');
  const [isUnknown, setIsUnknown] = useState(false);

  const inputHandler = (e) => {
    setIsUnknown(false);
    setValue(e.target.value);
  };

  const clearHandler = () => {
    setIsUnknown(true);
    setValue('');
  };

  return (
    <>
      <div className={cl.inputContainer}>
        <span className={cl.inputTitle}>{title}</span>
        <input
          type="number"
          placeholder='ввести'
          className={cl.input}
          value={value}
          onChange={inputHandler}
          name={title}
        />
        <span className={cl.unit}>
          {unit}
        </span>
        <div className={cl.clearIndicator}>
          <div className={cn(cl.marker, { [cl.hidden]: !isUnknown })}></div>
        </div>
      </div>
      <button
        className={cl.clearButton}
        onClick={clearHandler}
      >
        я не знаю
      </button>
    </>
  );
};

const Checkboxes = ({ answers }) => {
  const [values, setValues] = useState(Object.fromEntries(
    [...answers.options].map(el => [el, false])
  ));

  const checkboxHandler = useCallback((e) => {
    if (e.target.value === 'нічого з перерахованого') {
      return setValues(current => ({
        ...values,
        [e.target.value]: !current[e.target.value]
      }));
    }

    setValues(current => ({
      ...current,
      [e.target.value]: !current[e.target.value],
      'нічого з перерахованого': false
    }));
  }, [])

  return (
    <ul className={cl.checkList}>
      {answers.options.map(el => (
        <label
          key={el}
          htmlFor={el}
          className={cl.checkItem}
        >
          <input
            type="checkbox"
            value={el}
            id={el}
            className={cl.checkInput}
            checked={values[el]}
            onChange={checkboxHandler}
          />
          <span className={cl.checkmark}></span>
          {el}
        </label>
      ))}
    </ul>
  );
};

export default Answers;
