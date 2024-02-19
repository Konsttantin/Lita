import { useCallback, useEffect, useMemo, useState } from 'react';
import { get, post, put } from '../../utils/api';
import cn from 'classnames';
import cl from './Survey.module.css';
import Question from '../Question/Question';
import AppHeader from '../AppHeader/AppHeader';
import TestResults from '../Results/TestResults/TestResults';

const questionTypes = {
  radio: 'radio',
  dropdown: 'radio',
  integer: 'count',
  checkbox: 'check',
  date: 'date'
};

const Survey = ({
  requires,
  allContext,
  selectedCategory,
  onBackHome,
  onShowModal
}) => {
  const [questionIndex, setQuestionIndex] = useState(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [optionalQuestions, setOptionalQuestions] = useState([]);
  const [savedAnswers, setSavedAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState({
    patient_test_id: null,
    test_question_id: null,
    test_answer_id: [],
    test_answer_text: ''
  });

  const isAnswerEmpty = useMemo(() => !currentAnswer.test_answer_id.length && !currentAnswer.test_answer_text, [currentAnswer]);
  const isRiskHigh = useMemo(() => {
    const importantAnswersID = allAnswers.filter(el => el.is_disabled === 1).map(el => el.id)

    return savedAnswers.some(el => importantAnswersID.includes(+el));
  }, [allAnswers, savedAnswers])

  const optionalIDs = useMemo(() => requires.map(req => req.test_question_id).concat(allContext.map(con => con.test_question_id)), [allContext, requires]);
  const requiresAnswers = useMemo(() => requires.map(req => req.test_answer_id), [requires]);
  const contextAnswers = useMemo(() => allContext.map(con => con.test_answer_id), [allContext])

  const setTestQuestions = useCallback(async function (category, answers) {
    try {
      const questionResponse = await fetch(`https://api-lita.ingello.com/v1/test-question/index?test_category_id=${category}&sort=order&-join=testQuestionInput&-all=1`);

      if (!questionResponse.ok) {
        throw new Error('Ошибка при получении вопросов');
      }

      const questions = await questionResponse.json();

      let results = questions.map(q => {
        const result = {
          id: q.id,
          title: q.title,
          type: questionTypes[q['testQuestionInput[name]']],
          tooltip: q.description,
          isFinal: q.is_final,
          isDisabled: q.is_disabled
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

      results = results.filter(el => el.isDisabled !== 1); // filter disabled questions

      setOptionalQuestions(results.filter(res => optionalIDs.includes(res.id)));
      results = results.filter(res => !optionalIDs.includes(res.id));

      setQuestions(results);
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
  }, [optionalIDs]);

  const currentQuestion = useMemo(() => questions[questionIndex], [questionIndex, questions]);
  const showResults = useMemo(() => questionIndex === questions.length, [questionIndex, questions.length]) // update finish state

  useEffect(() => {
    if (currentQuestion?.isFinal) {
      setQuestions(questions => questions.slice(0, questionIndex + 1));
    }
  }, [currentQuestion, questionIndex]) // check if question is final and make it last in current test

  useEffect(() => {
    (async () => {
      const allUserTests = await get(`patient-test/index?patient_id=${localStorage.getItem('userID')}&-all=1`);
      const allPatientTestAnswers = await get('patient-test-answer/index?-all=1');
      const allAnswers = await get('test-answer/index?-all=1');

      await setTestQuestions(selectedCategory, allAnswers);

      const allUserTestIDs = allUserTests?.map(test => test.id) || [];
      const allUserAnswers = allPatientTestAnswers?.filter(answer => allUserTestIDs.includes(answer.patient_test_id)) || [];

      setAllAnswers(allAnswers);
      setUserAnswers(allUserAnswers);
      setIsLoading(false);
    })()
  }, []) // get current category questions, all old user answers and all kind of answers

  useEffect(() => {
    setCurrentAnswer(answer => ({ ...answer, test_question_id: currentQuestion?.id || null }))
  }, [currentQuestion]); // update question_id in currentAnswer

  useEffect(() => {
    if (questionIndex === questions.length) {
      put(`patient-test/update?id=${currentAnswer.patient_test_id}`, {
        status: 'end'
      });
    }
  }, [currentAnswer, questionIndex, questions]); // put status "end" to current test if it's done

  const createPatientTest = useCallback(async() => {
    setIsLoading(true);
    const test = await post('patient-test/create', {
      patient_id: localStorage.getItem('userID'),
      status: 'start'
    });

    setCurrentAnswer(answer => ({ ...answer, patient_test_id: test.id }));
    setIsLoading(false);
  }, []); // create test session

  const sendTestAnswer = useCallback(async() => {
    setIsLoading(true);

    // const existingAnswer = await get(`patient-test-answer/index?patient_test_id=${currentAnswer.patient_test_id}&test_question_id=${currentAnswer.test_question_id}`);

    const addNextQuestion = (nextQuestion) => {
      setQuestions(current => {
        const newQuestions = [...current];

        if (optionalIDs.includes(questions[questionIndex + 1]?.id)) {
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
    };

    // if (!existingAnswer) {
      setSavedAnswers(answers => [...answers, ...currentAnswer.test_answer_id]);

      if (currentAnswer.test_answer_id.length) {
        currentAnswer.test_answer_id.forEach(id => {
          post('patient-test-answer/create', {
            ...currentAnswer,
            test_answer_id: +id
          });

          setUserAnswers(answers => [...answers, {
            ...currentAnswer,
            test_answer_id: +id
          }]);

          if (contextAnswers.includes(+id)) {
            const allMatchingContexts = allContext.filter(con => +con.test_answer_id === +id);

            const matchingContext = allMatchingContexts.find(context => {
              const requiredAnswer = allAnswers.find(answer => answer[context.table_field] === context.table_value);
              const lastUserRequiredAnswer = userAnswers.findLast(answer => answer.test_question_id === requiredAnswer.test_question_id);

              return lastUserRequiredAnswer.test_answer_id === requiredAnswer.id;
            })

            if (matchingContext) {
              const nextQuestion = optionalQuestions.find(question => question.id === matchingContext.test_question_id);

              addNextQuestion(nextQuestion);
            }
          } else if (requiresAnswers.includes(+id)) {
            const nextQuestion = optionalQuestions.find(question => {
              const questionId = requires.find(req => +req.test_answer_id === +id).test_question_id;

              return question.id === questionId;
            })

            addNextQuestion(nextQuestion);
          }
        })
      } else {
        post('patient-test-answer/create', {
          ...currentAnswer,
          test_answer_id: null,
        });

        setUserAnswers(answers => [...answers, {
          ...currentAnswer,
          test_answer_id: null,
        }]);
      }
    // }
    setIsLoading(false);
  }, [currentAnswer, optionalIDs, questions, questionIndex, allAnswers, contextAnswers, requiresAnswers, allContext, userAnswers, optionalQuestions, requires]);

  const nextButtonHandler = useCallback(async () => {
    if (isLoading) {
      return;
    }

    if (questionIndex !== null) {
      if (isAnswerEmpty) {
        return;
      }

      if (currentAnswer.test_answer_id.includes("75")) {
        return onShowModal(true);
      }

      await sendTestAnswer();

      setCurrentAnswer(answer => ({
        ...answer,
        test_answer_id: [],
        test_answer_text: ''
      }));
    }

    return setQuestionIndex(i => i + 1);
  }, [isLoading, questionIndex, isAnswerEmpty, currentAnswer, sendTestAnswer, onShowModal]);

  const backButtonHandler = useCallback(() => {
    // if (questionIndex === 0) {
    //   setCurrentAnswer(answer => ({
    //     ...answer,
    //     test_question_id: null,
    //     test_answer_id: [],
    //     test_answer_text: ''
    //   }));

    //   return setIsTestStarted(false);
    // }

    // setCurrentAnswer(answer => ({
    //   ...answer,
    //   test_answer_id: [],
    //   test_answer_text: ''
    // }));

    // return setQuestionIndex(i => i - 1);

    onBackHome();
  }, []);

  const startButtonHandler = useCallback(() => {
    if (isLoading) {
      return;
    }

    setIsTestStarted(true);
    createPatientTest();
    setQuestionIndex(0);
  }, [createPatientTest, isLoading]);

  return (
    showResults ? (
      <>
        <AppHeader />
        <TestResults isRiskHigh={isRiskHigh} />
      </>
    ) : (
      <div className={cl.survey}>
        {!isTestStarted && (
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
          {(() => {
            if (isTestStarted) {
              return (
                <Question
                  header={currentQuestion.title}
                  type={currentQuestion.type}
                  answers={currentQuestion.answers}
                  tooltip={currentQuestion.tooltip}
                  setAnswer={setCurrentAnswer}
                />
              );
            }

            return (
              <>
                {/* <h1 className={cl.header}>
                  Розпочнемо з простого опитувальника
                </h1> */}
                <button
                  className={cl.startButton}
                  onClick={startButtonHandler}
                >
                  <img src="svg/lita.SVG" alt="Logo" />
                  <span>Визначити ризики</span>
                </button>
                <p className={cl.description}>
                  Щоб результати тесту збереглися, завершіть його одномоментно, не виходячи та не повертаючись на головну сторінку<br />
                  <br />
                  Проходячи це опитування та натискаючи «Визначити ризик» ви даєте згоду на обробку даних
                </p>
              </>
            );
          })()}
        </div>

        {(isTestStarted && !showResults) && (
          <button
            className={cn(
              cl.nextButton,
              { [cl.active]: (isTestStarted && questionIndex !== null && (currentAnswer.test_answer_id.length || currentAnswer.test_answer_text)) },
            )}
            onClick={nextButtonHandler}
          >
            {isLoading ? (
              <img src="loader.png" alt="loader" />
            ) : (
              "продовжити"
            )}
          </button>
        )}
      </div>
    )
    
  );
};

export default Survey;
