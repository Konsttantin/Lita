import cl from './Question.module.css';

const Question = ({ header }) => {
  return (
    <h1 className={cl.header}>
      {header}
    </h1>
  );
};

export default Question;