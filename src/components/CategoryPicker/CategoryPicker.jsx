import cn from 'classnames';

import cl from './CategoryPicker.module.css';
import { useEffect } from 'react';

const CategoryPicker = ({ categories, selectedCategory, onCategoryChange, fetchQuestions }) => {
  useEffect(() => {
    fetchQuestions(selectedCategory)
  }, [selectedCategory, fetchQuestions])

  return (
    <div className={cl.picker}>
      <h1 className={cl.header}>Оберіть категорію тесту</h1>
      <ul className={cl.categories}>
        {categories.map(category => (
          <li
            key={category.id}
            className={cn(cl.item, { [cl.picked]: category.id === selectedCategory })}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPicker;
