import cn from 'classnames';
import cl from './Navigation.module.css';

const Navigation = () => {
  return (
    <ul className={cl.navigation}>
      <li className={cn(cl.item, { [cl.active]: false })}>
        <img src="public/SVG/menu.svg" alt="Menu" />
      </li>
      <li className={cn(cl.item, { [cl.active]: false })}>
        <img src="public/SVG/home.svg" alt="Home" />
      </li>
      <li className={cn(cl.item, { [cl.active]: true })}>
        <img src="public/SVG/calendar.svg" alt="Calendar" />
      </li>
    </ul>
  );
};

export default Navigation;