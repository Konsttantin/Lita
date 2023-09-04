import cn from 'classnames';
import cl from './Navigation.module.css';

const Navigation = () => {
  return (
    <ul className={cl.navigation}>
      <li className={cn(cl.item, { [cl.active]: false })}>
        <img src="svg/menu.SVG" alt="Menu" />
      </li>
      <li className={cn(cl.item, { [cl.active]: false })}>
        <img src="svg/home.SVG" alt="Home" />
      </li>
      <li className={cn(cl.item, { [cl.active]: true })}>
        <img src="svg/calendar.SVG" alt="Calendar" />
      </li>
    </ul>
  );
};

export default Navigation;