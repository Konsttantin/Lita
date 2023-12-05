import cl from './Question.module.css';
import Answers from './Answers/Answers';
import TipButton from '../TipButton/TipButton';

const Question = ({ header, type, answers, tooltip, setAnswer }) => {
  return (
    <div className={cl.wrapper}>
      <h1 className={cl.header}>
        {header.split(' ').slice(0, -1).join(' ') + ' '}

        <span className={cl.lastWord}>
          {header.split(' ').slice(-1).join('')}

          <TipButton tooltip={tooltip} />
        </span>
      </h1>

      <Answers
        type={type}
        answers={answers}
        setAnswer={setAnswer}
      />
    </div>
  );
};

export default Question;