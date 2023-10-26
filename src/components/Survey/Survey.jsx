import { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import Question from '../Question/Question';
import cl from './Survey.module.css';
import { post } from '../../utils/api';

const questionTypes = {
  radio: 'radio',
  dropdown: 'radio',
  integer: 'count',
  checkbox: 'check',
  date: 'date'
};

const Survey = ({ requires, selectedCategory, onBackHome }) => {
  const [questionIndex, setQuestionIndex] = useState(null);
  const [showFinish, setShowFinish] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [optionalQuestions, setOptionalQuestions] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState({
    patient_test_id: null,
    test_question_id: null,
    test_answer_id: [],
    test_answer_text: ''
  });

  const isAnswerEmpty = useMemo(() => !currentAnswer.test_answer_id.length && !currentAnswer.test_answer_text, [currentAnswer]);
  const optionalIDs = useMemo(() => requires.map(req => req.test_question_id), [requires]);
  const requiresAnswers = useMemo(() => requires.map(req => req.test_answer_id), [requires])

  const setTestQuestions = useCallback(async function (category) {
    setIsLoading(true);

    try {
      const response = await fetch(`https://api-lita.ingello.com/v1/test-question/index?test_category_id=${category}&sort=order&-join=testQuestionInput&-all=1`);
      const answerResponse = await fetch(`https://api-lita.ingello.com/v1/test-answer/index?-all=1`);

      if (!response.ok) {
        throw new Error('Ошибка при получении вопросов');
      }

      if (!answerResponse.ok) {
        throw new Error('Ошибка при получении ответов');
      }

      const questions = await response.json();
      const answers = await answerResponse.json();

      let results = questions.map(q => {
        const result = {
          id: q.id,
          title: q.title,
          type: questionTypes[q['testQuestionInput[name]']],
          tooltip: q.description,
        };

        result.answers = {
          options: answers?.filter(ans => ans.test_question_id === q.id).map(answer => ({
            id: answer.id,
            title: answer.title,
            value: answer.value,
          })),
          unit: q.units,
        };

        return result;
      });

      setOptionalQuestions(results.filter(res => optionalIDs.includes(res.id)));
      results = results.filter(res => !optionalIDs.includes(res.id));

      setQuestions(results);
      setIsLoading(false);
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
  }, [optionalIDs]);

  const currentQuestion = useMemo(() => questions[questionIndex], [questionIndex, questions]);

  useEffect(() => {
    setTestQuestions(selectedCategory)
  }, [selectedCategory, setTestQuestions]) // get current category questions

  useEffect(() => {
    setCurrentAnswer(answer => ({ ...answer, test_question_id: currentQuestion?.id || null }))
  }, [currentQuestion]); // update question_id in currentAnswer

  const createPatientTest = useCallback(async() => {
    setIsLoading(true);
    const test = await post('patient-test/create', {patient_id: localStorage.getItem('userID')});

    setCurrentAnswer(answer => ({ ...answer, patient_test_id: test.id }));
    setIsLoading(false);
  }, []); // create test session

  const sendTestAnswer = useCallback(async() => {
    setIsLoading(true);
    const existingAnswer = await fetch(`https://api-lita.ingello.com/v1/patient-test-answer/index?patient_test_id=${currentAnswer.patient_test_id}&test_question_id=${currentAnswer.test_question_id}`).then(resp => resp.json());

    if (!existingAnswer) {
      if (currentAnswer.test_answer_id.length) {
        currentAnswer.test_answer_id.forEach(id => {
          post('patient-test-answer/create', {
            ...currentAnswer,
            test_answer_id: +id
          });

          if (requiresAnswers.includes(+id)) {
            const nextQuestion = optionalQuestions.find(question => {
              const questionId = requires.find(req => req.test_answer_id === +id).test_question_id;

              return question.id === questionId;
            })

            setQuestions(current => {
              const newQuestions = [...current];

              if (optionalIDs.includes(questions[questionIndex + 1].id)) {
                let optionalCount = 0;

                for (let i = questionIndex + 1; i < questions.length; i++) {
                  if (optionalIDs.includes(questions[i].id)) {
                    optionalCount++;
                  } else {
                    break;
                  }
                }

                newQuestions.splice(questionIndex + 1, optionalCount, nextQuestion);
              } else {
                newQuestions.splice(questionIndex + 1, 0, nextQuestion);
              }

              return newQuestions;
            });
          }
        })
      } else {
        post('patient-test-answer/create', {
          ...currentAnswer,
          test_answer_id: null,
        });
      }
    }
    setIsLoading(false);
  }, [currentAnswer, requiresAnswers, optionalQuestions, requires, questionIndex, questions, optionalIDs]);

  const skipButtonHandler = useCallback(async () => {
    if (isLoading) {
      return;
    }

    if (showFinish) {
      return onBackHome();
    }

    if (questionIndex === questions.length - 1) {
      await sendTestAnswer();
      setCurrentAnswer(answer => ({
        ...answer,
        test_answer_id: [],
        test_answer_text: ''
      }));

      return setShowFinish(true)
    }

    if (questionIndex !== null) {
      if (isAnswerEmpty) {
        return;
      }

      await sendTestAnswer();

      setCurrentAnswer(answer => ({
        ...answer,
        test_answer_id: [],
        test_answer_text: ''
      }));

      return questionIndex === questions.length - 1
        ? setShowFinish(true)
        : setQuestionIndex(i => i + 1);
    }

    return setShowFinish(true);
  }, [isLoading, showFinish, questionIndex, questions.length, onBackHome, isAnswerEmpty, sendTestAnswer]);

  const backButtonHandler = useCallback(() => {
    if (showFinish) {
      return setShowFinish(false);
    }

    if (questionIndex === 0) {
      setCurrentAnswer(answer => ({
        ...answer,
        test_question_id: null,
        test_answer_id: [],
        test_answer_text: ''
      }));

      return setIsTestStarted(false);
    }

    setCurrentAnswer(answer => ({
      ...answer,
      test_answer_id: [],
      test_answer_text: ''
    }));

    return setQuestionIndex(i => i - 1 >= 0 ? i - 1 : null);
  }, [questionIndex, showFinish]);

  const startButtonHandler = useCallback(() => {
    if (showFinish || isLoading) {
      return;
    }

    setIsTestStarted(true);
    createPatientTest();
    setQuestionIndex(0);
  }, [createPatientTest, isLoading, showFinish]);

  return (
    <div className={cl.survey}>
      {(showFinish || isTestStarted) && (
        <button
          className={cl.backArrow}
          onClick={backButtonHandler}
        >
          <img
            src="svg/back-arrow.SVG"
            alt="Back"
          />
        </button>
      )}

      <div className={cl.wrapper}>
        {!isTestStarted || showFinish ? (
          <>
            <h1 className={cn(cl.header, { [cl.finished]: showFinish })}>
              {showFinish ? "Ми дізналися про вас трішки, а тепер хочемо познайомити вас з нашим функціоналом та можливостями." : "Розпочнемо з простого опитувальника"}
            </h1>
            <button
              className={cn(cl.startButton, { [cl.finished]: showFinish })}
              onClick={startButtonHandler}
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
            setAnswer={setCurrentAnswer}
          />
        )}
      </div>

      <button
        className={cn(
          cl.skipButton,
          { [cl.active]: (isTestStarted && !showFinish && questionIndex === null) || (isTestStarted && questionIndex !== null && (currentAnswer.test_answer_id.length || currentAnswer.test_answer_text)) },
        )}
        onClick={skipButtonHandler}
      >
        {isLoading ? (
          <img src="loader.png" alt="loader" />
        ) : (
          <>
            {(!isTestStarted || showFinish) ? 'пропустити' : 'продовжити'}
          </>
        )}
      </button>
    </div>
  );
};

export default Survey;
