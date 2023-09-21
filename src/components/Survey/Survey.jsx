import { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import Question from '../Question/Question';
import cl from './Survey.module.css';

const questionTypes = {
  radio: 'radio',
  dropdown: 'radio',
  integer: 'count'
};

const Survey = () => {
  const [questionIndex, setQuestionIndex] = useState(null);
  const [showFinish, setShowFinish] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quesions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchTestQuestions() {
      try {
        const response = await fetch('https://api-lita.ingello.com/v1/test-question/index?-join=testQuestionInput');

        if (!response.ok) {
          throw new Error('Ошибка при получении вопросов');
        }

        const questions = await response.json();

        const questionPromises = questions.map(async (q) => {
          const result = {
            id: q.id,
            title: q.title,
            type: questionTypes[q['testQuestionInput[name]']],
            tooltip: q.description,
          };
          const answerResponse = await fetch(`https://api-lita.ingello.com/v1/test-answer/index?test_question_id=${q.id}`);

          if (!answerResponse.ok) {
            throw new Error('Ошибка при получении ответов');
          }

          const answers = await answerResponse.json();

          result.answers = {
            options: answers?.map(answer => ({
              title: answer.title,
              value: answer.value,
            })),
            unit: q.units,
          };

          return result;
        });

        const results = await Promise.all(questionPromises);

        setQuestions(results);
        setIsLoading(false);
      } catch (error) {
        console.error('Произошла ошибка:', error);
      }
    }

    fetchTestQuestions()
  }, [])

  const currentQuestion = useMemo(() => quesions[questionIndex], [questionIndex, quesions]);
  const skipButtonHandler = useCallback(() => {
    if (questionIndex === quesions.length - 1) {
      return setShowFinish(true)
    }

    if (questionIndex !== null) {
      return setQuestionIndex(i => i + 1);
    }

    return setShowFinish(true);
  }, [questionIndex, quesions]);

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
            type={currentQuestion.type}
            answers={currentQuestion.answers}
            tooltip={currentQuestion.tooltip}
          />
        )}
      </div>

      {isLoading ? (
        <button
          className={cl.skipButton}
        >
          <img src="loader.png" alt="loader" />
        </button>
      ) : (
        <button
          className={cn(
            cl.skipButton,
            { [cl.active]: questionIndex !== null && !showFinish },
          )}
          onClick={skipButtonHandler}
        >
          {(questionIndex === null || showFinish) ? 'пропустити' : 'продовжити'}
        </button>
      )}
    </div>
  );
};

export default Survey;
