import { useState } from 'react';
import Picker from 'react-mobile-picker';
import cl from './Answers.module.css';

const Answers = ({ type, answers }) => {
  // const [answer, setAnswer] = useState(null);

  switch (type) {
    case 'radio': {
      return (
        <ul className={cl.radioList}>
          {answers.options.map(el => (
            <label key={el} htmlFor={el} className={cl.radioItem}>
              <input type="radio" name={type} id={el}/>
              <span className={cl.checkmark}></span>
              {el}
            </label>
          ))}
        </ul>
      )
    }

    case 'count': {
      return (
        <NumberPicker
          type={type}
          answers={answers}
        />
      )
    }
  }
};

const NumberPicker = ({ type, answers: { unit } }) => {
  const [value, setValue] = useState(10);

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
    <Picker.Column name={type}>
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
}

export default Answers;
