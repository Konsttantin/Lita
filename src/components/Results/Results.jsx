import { useCallback, useEffect, useState } from "react";

import cl from './Results.module.css';
import { get } from "../../utils/api";
import AppHeader from "../AppHeader/AppHeader";
import makeUniqueByProp from "../../utils/makeUniqueByProp";

const Results = ({ categories }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userTests, setUserTests] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  const getCreationTime = useCallback((timestamp) => {
    const date = new Date(+timestamp);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const mins = ('0' + date.getMinutes()).slice(-2);

    return `${day}.${month}.${year} ${hours}:${mins}`;
  }, []);

  const backButtonHandler = useCallback(() => {
    setSelectedTest(null);
  }, []);

  useEffect(() => {
    (async () => {
      const allTestAnswers = await get('patient-test-answer/index?-all=1');
      const allQuestions = await get('test-question/index?-all=1');
      const allUserTests = await get(`patient-test/index?patient_id=${localStorage.getItem('userID')}&-all=1`);
      const allAnswers = await get('test-answer/index?-all=1');

      if (!allUserTests) {
        setIsLoading(false);
        return;
      }

      const userTests = [];

      allUserTests.forEach(test => {
        const questionFromTestId = allTestAnswers.find(answer => answer.patient_test_id === test.id)?.test_question_id;
        const questionFromTest = allQuestions.find(question => question.id === questionFromTestId);
        const currentTestAnswers = allTestAnswers.filter(answer => answer.patient_test_id === test.id);
        const uniqueCurrentTestAnswers = makeUniqueByProp(currentTestAnswers, 'test_question_id');
        const getAnswerValues = (answer) => {
          return currentTestAnswers.filter(a => a.test_question_id === answer.test_question_id).map(answer => {
            return allAnswers.find(ans => ans.id === answer.test_answer_id).title;
          });
        };

        const testAnswers = uniqueCurrentTestAnswers.map(answer => ({
          id: answer.id,
          question: allQuestions.find(question => question.id === answer.test_question_id).title,
          values: answer.test_answer_text.length ? [answer.test_answer_text] : getAnswerValues(answer),
        }));

        if (!questionFromTest) {
          return;
        }

        const testObj = {
          id: test.id,
          title: categories.find(category => category.id === questionFromTest.test_category_id).title,
          date: getCreationTime(test.created_at + '000'),
          answers: testAnswers,
        };

        userTests.push(testObj);
      })

      setUserTests(userTests);
      setIsLoading(false);
    })()
  }, [categories, getCreationTime])

  return (
    <>
      <AppHeader />

      {isLoading ? (
        <div className={cl.loader}>
          <img src="big-loader.gif" alt="Loading" />
        </div>
      ) : (
        <ul className={cl.results}>
          {selectedTest ? (
            <TestResults
              answers={selectedTest.answers}
            />
          ) : (
            userTests ? (
              userTests.map(test => (
                <li
                  key={test.id}
                  className={cl.item}
                  onClick={() => setSelectedTest(userTests.find(t => t.id === test.id))}
                >
                  <p className={cl.itemContent}>
                    <span className={cl.itemTitle}>{test.title}</span>
                    <span className={cl.itemDate}>{test.date}</span>
                  </p>

                  <img src="svg/category-arrow.SVG" alt="arrow" />
                </li>
              ))
            ) : (
              <h1 className={cl.emptyMessage}>Ви не пройшли жодного тесту!</h1>
            )
          )}
        </ul>
      )}

      {selectedTest && (
        <button
          className={cl.backButton}
          onClick={backButtonHandler}
        >
          Назад
        </button>
      )}
    </>
  );
};

const TestResults = ({ answers }) => {
  return (
    <>
      {answers.map(answer => (
        <li
          key={answer.id}
          className={cl.item}
        >
          <p className={cl.answerContent}>
            <span className={cl.itemTitle}>{answer.question}</span>
            {answer.values.map(value => (
              <span key={value} className={cl.itemAnswer}>{value}</span>
            ))}
          </p>
        </li>
      ))}
    </>
  );
};

export default Results;