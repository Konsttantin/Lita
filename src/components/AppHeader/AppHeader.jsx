import cl from './AppHeader.module.css';

const AppHeader = () => {
  return (
    <header className={cl.header}>
      <button className={cl.notification}>
        <img src="svg/notification.SVG" alt="Notifications" />
      </button>

      <img src="svg/menu-logo.SVG" alt="Lita logo" />

      <button>
        <img src="svg/user-icon.SVG" alt="User" />
      </button>
    </header>
  );
};

export default AppHeader;