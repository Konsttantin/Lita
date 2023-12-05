import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import Picker from 'react-mobile-picker';
import cl from './Answers.module.css';

const unitStartValues = {
  'кг': 60,
  'см': 170,
};

const getMonth = () => {
  return new Date().getMonth() + 1;
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

const Answers = ({ type, answers, setAnswer }) => {
  // const [answer, setAnswer] = useState(null);

  switch (type) {
    case 'radio': {
      return (
        <RadioButtons
          answers={answers}
          setAnswer={setAnswer}
        />
      );
    }

    case 'count': {
      return (
        <NumberPicker
          type={type}
          answers={answers}
          startValue={unitStartValues[answers.unit] || 2}
          setAnswer={setAnswer}
        />
      );
    }

    case 'date': {
      return (
        <DatePicker
          setAnswer={setAnswer}
        />
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
      if (answers.options) {
        return (
          <Checkboxes
            answers={answers}
            setAnswer={setAnswer}
          />
        );
      }
    }
  }
};

const NumberPicker = ({ type, answers, startValue, setAnswer }) => {
  const [value, setValue] = useState({ [type]: startValue });

  useEffect(() => setValue({ [type]: startValue }), [startValue, type, answers]);

  useEffect(() => {
    setAnswer(answer => ({ ...answer, test_answer_text: String(value.count) }))
  }, [setAnswer, value])

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
      {answers.unit && <span className={cl.unit}>{answers.unit}</span>}
    </div>
  </Picker>
  )
};

const DatePicker = ({ setAnswer }) => {
  const [value, setValue] = useState({
    month: getMonth(),
    day: getDay(),
    year: getYear()
  });

  useEffect(() => {
    setAnswer(answer => ({
      ...answer,
      test_answer_text: `${value.day}.${value.month}.${value.year}`}));
  }, [setAnswer, value])

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
      return allMonths.slice(0, getMonth());
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
        <Picker.Item value={i + 1} key={el}>
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

const Checkboxes = ({ answers, setAnswer }) => {
  const [values, setValues] = useState(Object.fromEntries(
    [...answers.options].map(el => [el.id, false])
  ));

  const list = useRef(null);

  useEffect(() => {
    list.current.scrollTo(0, 0);
  }, [answers])

  useEffect(() => {
    const resultArr = [];

    for (const key in values) {
      if (values[key]) {
        resultArr.push(key)
      }
    }

    setAnswer(answer => ({ ...answer, test_answer_id: resultArr }));
  }, [setAnswer, values])

  const checkboxHandler = useCallback((e) => {
    setValues(current => ({
      ...current,
      [e.target.value]: !current[e.target.value],
    }));
  }, [])

  return (
    <ul className={cl.checkList} ref={list}>
      {answers.options.map((el) => (
        <label
          key={el.value}
          htmlFor={el.value}
          className={cl.checkItem}
        >
          <input
            type="checkbox"
            value={el.id}
            id={el.value}
            className={cl.checkInput}
            checked={values[el.id]}
            onChange={(e) => checkboxHandler(e)}
          />
          <span className={cl.checkmark}></span>
          {el.title}
        </label>
      ))}
    </ul>
  );
};

const RadioButtons = ({ answers, setAnswer }) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const list = useRef(null);

  useEffect(() => {
    list.current.scrollTo(0, 0);
    setSelectedValue(null);
  }, [answers])

  useEffect(() => {
    if (selectedValue) {
      setAnswer(answer => ({ ...answer, test_answer_id: [selectedValue] }))
    }
  }, [selectedValue, setAnswer])

  return (
    <ul
      className={cl.radioList}
      onChange={(e) => setSelectedValue(e.target.value)}
      ref={list}
    >
      {!!answers.options && answers.options.map(el => (
        <label key={el.value} htmlFor={el.id} className={cl.radioItem}>
          <input type="radio" name="radio" id={el.id} value={el.id}/>
          <span className={cl.checkmark}></span>
          {el.title}
        </label>
      ))}
    </ul>
  );
}

export default Answers;
