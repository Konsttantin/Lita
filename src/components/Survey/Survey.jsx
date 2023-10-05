import { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import Question from '../Question/Question';
import cl from './Survey.module.css';
import CategoryPicker from '../CategoryPicker/CategoryPicker';

const questionTypes = {
  radio: 'radio',
  dropdown: 'radio',
  integer: 'count',
  checkbox: 'check',
  date: 'date'
};

const Survey = () => {
  const [questionIndex, setQuestionIndex] = useState(null);
  const [showFinish, setShowFinish] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [optionalQuestions, setOptionalQuestions] = useState([]);
  const [requires, setRequires] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState({
    patient_test_id: null,
    test_question_id: null,
    test_answer_id: [],
    test_answer_text: ''
  });

  const isAnswerEmpty = useMemo(() => !currentAnswer.test_answer_id.length && !currentAnswer.test_answer_text, [currentAnswer]);

  useEffect(() => {
    (async() => {
      const categories = await fetch('https://api-lita.ingello.com/v1/test-category/index').then(resp => resp.json());
      const requires = await fetch('https://api-lita.ingello.com/v1/test-question-requires/index').then(response => response.json());

      setCategories(categories);
      setRequires(requires);
      setSelectedCategory(categories[0].id);
      setIsLoading(false);
    })()
  }, []); // load test categories and requires

  const optionalIDs = useMemo(() => requires.map(req => req.test_question_id), [requires]);
  const requiresAnswers = useMemo(() => requires.map(req => req.test_answer_id), [requires])

  const setTestQuestions = useCallback(async function (category) {
    setIsLoading(true);

    try {
      const response = await fetch(`https://api-lita.ingello.com/v1/test-question/index?test_category_id=${category}&sort=order&-join=testQuestionInput`);

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
            id: answer.id,
            title: answer.title,
            value: answer.value,
          })),
          unit: q.units,
        };

        return result;
      });

      let results = await Promise.all(questionPromises);

      setOptionalQuestions(results.filter(res => optionalIDs.includes(res.id)));
      results = results.filter(res => !optionalIDs.includes(res.id));

      setQuestions(results);
      setIsLoading(false);
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
  }, [optionalIDs]);

  const currentQuestion = useMemo(() => questions[questionIndex], [questionIndex, questions]);
  console.log(currentQuestion, questionIndex, questions);

  useEffect(() => {
    setCurrentAnswer(answer => ({ ...answer, test_question_id: currentQuestion?.id || null }))
  }, [currentQuestion]); // update question_id in currentAnswer

  const createPatientTest = useCallback(async() => {
    const test = await fetch('https://api-lita.ingello.com/v1/patient-test/create', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({patient_id: localStorage.getItem('userID')})
    }).then(resp => resp.json());

    setCurrentAnswer(answer => ({ ...answer, patient_test_id: test.id }));
  }, []); // create test session

  const sendTestAnswer = useCallback(async() => {
    setIsLoading(true);
    const existingAnswer = await fetch(`https://api-lita.ingello.com/v1/patient-test-answer/index?patient_test_id=${currentAnswer.patient_test_id}&test_question_id=${currentAnswer.test_question_id}`).then(resp => resp.json());

    if (!existingAnswer) {
      if (currentAnswer.test_answer_id.length) {
        currentAnswer.test_answer_id.forEach(id => {
          fetch('https://api-lita.ingello.com/v1/patient-test-answer/create', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...currentAnswer,
              test_answer_id: +id
            })
          })

          if (requiresAnswers.includes(+id)) {
            const nextQuestion = optionalQuestions.find(question => {
              const questionId = requires.find(req => req.test_answer_id === +id).test_question_id;

              return question.id === questionId;
            })

            setQuestions(current => {
              const newQuestions = [...current];
              
              if (optionalIDs.includes(questions[questionIndex + 1].id)) {
                newQuestions.splice(questionIndex + 1, 1, nextQuestion);
              } else {
                newQuestions.splice(questionIndex + 1, 0, nextQuestion);
              }

              return newQuestions;
            });
          }
        })
      } else {
        fetch('https://api-lita.ingello.com/v1/patient-test-answer/create', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...currentAnswer,
            test_answer_id: null,
          })
        })
      }

      console.log('sended', existingAnswer);
    }
    setIsLoading(false);
  }, [currentAnswer, requiresAnswers, optionalQuestions, requires, questionIndex, questions, optionalIDs]);

  const skipButtonHandler = useCallback(async () => {
    if (isLoading) {
      return;
    }

    if (isTestStarted && questionIndex === null) {
      createPatientTest();
      return setQuestionIndex(0);
    }

    if (questionIndex === questions.length - 1) {
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
  }, [questionIndex, questions, isLoading, isTestStarted, createPatientTest, isAnswerEmpty, sendTestAnswer]);

  return (
    <div className={cl.survey}>
      {(showFinish || isTestStarted) && (
        <button
          className={cl.backArrow}
          onClick={() => {
            if (showFinish) {
              return setShowFinish(false);
            }

            if (questionIndex === null) {
              return setIsTestStarted(false);
            }

            setCurrentAnswer(answer => ({
              ...answer,
              test_answer_id: [],
              test_answer_text: ''
            }));

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
        {!isTestStarted || showFinish ? (
          <>
            <h1 className={cn(cl.header, { [cl.finished]: showFinish })}>
              {showFinish ? "Ми дізналися про вас трішки, а тепер хочемо познайомити вас з нашим функціоналом та можливостями." : "Розпочнемо з простого опитувальника"}
            </h1>
            <button
              className={cn(cl.startButton, { [cl.finished]: showFinish })}
              onClick={() => {
                if (showFinish || isLoading) {
                  return;
                }

                setIsTestStarted(true);
              }}
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
          <>
            {questionIndex === null ? (
              <CategoryPicker
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={(value) => setSelectedCategory(value)}
                fetchQuestions={setTestQuestions}
              />
            ) : (
              <Question
                header={currentQuestion.title}
                type={currentQuestion.type}
                answers={currentQuestion.answers}
                tooltip={currentQuestion.tooltip}
                setAnswer={setCurrentAnswer}
              />
            )}
          </>
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
