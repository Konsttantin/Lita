import { useMemo, useState } from 'react';
import cn from 'classnames';
import Question from '../Question/Question';
import cl from './Survey.module.css';
import fakeData from '../../api/fake-questions.json';

const Survey = () => {
  const [questionIndex, setQuestionIndex] = useState(null);
  const [showFinish, setShowFinish] = useState(false);

  const quesions = useMemo(() => fakeData, []);
  const currentQuestion = useMemo(() => quesions[questionIndex], [questionIndex, quesions]);

  return (
    <div className={cl.survey}>
      {(showFinish || questionIndex !== null) && (
        <button
          className={cl.backArrow}
          onClick={() => {
            if (showFinish) {
              return setShowFinish(false);
            }

            return setQuestionIndex(i => i - 1 >= 0 ? i - 1 : null);
          }}
        >
          <img
            src="svg/back-arrow.SVG"
            alt="Back"
          />
        </button>
      )}

      <div className={cl.wrapper}>
        {questionIndex === null || showFinish ? (
          <>
            <h1 className={cn(cl.header, { [cl.finished]: showFinish })}>
              {showFinish ? "Ми дізналися про вас трішки, а тепер хочемо познайомити вас з нашим функціоналом та можливостями." : "Розпочнемо з простого опитувальника"}
            </h1>
            <button
              className={cn(cl.startButton, { [cl.finished]: showFinish })}
              onClick={() => setQuestionIndex(0)}
            >
              {showFinish ? (
                <img src="svg/lita-text-logo.SVG"/>
              ) : (
                <>
                  <img src="svg/lita.SVG" alt="Logo" />
                  <span>Визначити ризики</span>
                </>
              )}
            </button>
          </>
        ) : (
          <Question
            header={currentQuestion.title}
          />
        )}
      </div>

      <button
        className={cn(
          cl.skipButton,
          { [cl.active]: questionIndex !== null && !showFinish },
        )}
        onClick={() => {
          if (questionIndex === quesions.length - 1) {
            return setShowFinish(true)
          }

          if (questionIndex !== null) {
            return setQuestionIndex(i => i + 1);
          }

          return setShowFinish(true);
        }}
      >
        {(questionIndex === null || showFinish) ? 'пропустити' : 'продовжити'}
      </button>
    </div>
  );
};

export default Survey;