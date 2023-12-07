import cl from './ContactsBox.module.css';

const ContactsBox = () => {
  return (
    <div className={cl.contacts}>
      <span>
        Адреса: м.Бориспіль, Україна
      </span>
      <span>
        З будь-яких питань: <a href="mailto:longilita@gmail.com">longilita@gmail.com</a>
      </span>
      <span>
        Офіційний сайт: <a href="https://litaapp.co">litaapp.co</a>
      </span>
      <a
        className={cl.contractOffer}
        href="https://drive.google.com/file/d/1Pqtq5Lct4CmJxstwo-abcKMgXyAfHpmf/view?usp=sharing"
        target="_blank"
        rel="noreferrer"
      >
        Договір оферти
        <img
          src="svg/download-file.SVG"
          alt="Back"
        />
      </a>
      <div className={cl.billingIcons}>
        <img src="svg/mastercard.SVG" alt="mastercard" />
        <img src="svg/visa.SVG" alt="visa" />
      </div>
    </div>
  );
};

export default ContactsBox;
