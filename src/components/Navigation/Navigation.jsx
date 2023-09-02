import cn from 'classnames';
import cl from './Navigation.module.css';

const Navigation = () => {
  return (
    <ul className={cl.navigation}>
      <li className={cn(cl.item, { [cl.active]: false })}>
        <img src="public/svg/menu.svg" alt="Menu" />
      </li>
      <li className={cn(cl.item, { [cl.active]: false })}>
        <img src="public/svg/home.svg" alt="Home" />
      </li>
      <li className={cn(cl.item, { [cl.active]: true })}>
        <img src="public/svg/calendar.svg" alt="Calendar" />
      </li>
    </ul>
  );
};

export default Navigation;