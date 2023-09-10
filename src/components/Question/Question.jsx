import cl from './Question.module.css';
import Answers from './Answers/Answers';

const Question = ({ header, type, answers }) => {
  return (
    <div className={cl.wrapper}>
      <h1 className={cl.header}>
        {header}
      </h1>

      <Answers
        type={type}
        answers={answers}
      />
    </div>
  );
};

export default Question;