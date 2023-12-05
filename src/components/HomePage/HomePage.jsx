import { useEffect, useState } from 'react';
import AppHeader from '../AppHeader/AppHeader';
import cl from './HomePage.module.css';
import { get } from '../../utils/api';
import Loader from '../Loader/Loader';

const HomePage = ({ categories, onCategoryChange, onResults }) => {
  const [hasPassedTests, setHasPassedTests] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const allUserTests = await get(`patient-test/index?patient_id=${localStorage.getItem('userID')}&-all=1`)

      setHasPassedTests(!!allUserTests?.some(el => el.status === 'end'));
      setIsLoading(false);
    })()
  }, []);

  return (
    <>
      <AppHeader />

      <main className={cl.container}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <ul className={cl.categories}>
              {categories.map(category => (
                <li
                  key={category.id}
                  className={cl.item}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <div className={cl.itemHeader}>
                    <span>{category.title}</span>
                    <img src="svg/category-arrow.SVG" alt="arrow" />
                  </div>
                  <div className={cl.itemLogo}>
                    <img src="svg/category-icon.SVG" alt="category icon" />
                  </div>
                </li>
              ))}

              {hasPassedTests && (
                <button
                  className={cl.results}
                  onClick={onResults}
                >
                  {'Переглянути результати тестів'}
                  <img src="svg/category-arrow.SVG" alt="arrow" />
                </button>
              )}

              <p className={cl.description}>
                Lita - це додаток, який допомагає визначити особистий ризик розвитку раку. Після проходження опитування ви отримаєте оцінку й поради щодо профілактики найпоширеніших видів раку. Ми розкажемо, які зміни ви можете зробити прямо зараз, щоб зменшити ризик розвитку раку і жити здоровішим життям.<br />
                <br />
                Хоча деякі фактори ризику, як-от ваш вік або сімейна історія, змінити неможливо. Ви можете зробити багато речей, щоб знизити ризик змінивши свій стиль життя.<br />
                <br />
                Щоб отримати оцінку власного ризику раку та персоналізований план дій та поради щодо профілактики раку переходьте до першого опитування.
              </p>
            </ul>

            
          </>
        )}
      </main>
    </>
  );
};

export default HomePage;
