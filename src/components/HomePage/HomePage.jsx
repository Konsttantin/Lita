import AppHeader from '../AppHeader/AppHeader';
import cl from './HomePage.module.css';

const HomePage = ({ categories, onCategoryChange, onResults }) => {
  return (
    <>
      <AppHeader />

      <main className={cl.container}>
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
        </ul>

        <button
          className={cl.results}
          onClick={onResults}
        >
          {'Переглянути результати тестів'}
          <img src="svg/category-arrow.SVG" alt="arrow" />
        </button>
      </main>
    </>
  );
};

export default HomePage;
