import { useContext } from 'react';
import cl from './ContactsBox.module.css';
import { OfferPageContext } from '../../context/OfferPageContext';

const ContactsBox = () => {
  const { setShowOfferPage } = useContext(OfferPageContext)

  return (
    <div className={cl.contacts}>
      <span>
        Адреса: м.Бориспіль, Україна
      </span>
      <span>
        Контактний номер телефону: <a href="tel:+380937619712">+380937619712</a>
      </span>
      <span>
        З будь-яких питань: <a href="mailto:longilita@gmail.com">longilita@gmail.com</a>
      </span>
      <span>
        Про нас: <a href="https://litaapp.co">litaapp.co</a>
      </span>
      <button
        className={cl.contractOffer}
        onClick={() => setShowOfferPage(true)}
        // href="https://drive.google.com/file/d/1pMbivt5QENn07Kzag_GuHXEqWtjxOXvg/view?usp=sharing"
      >
        Договір оферти
        <img
          src="svg/download-file.SVG"
          alt="Back"
        />
      </button>
      <div className={cl.billingIcons}>
        <img src="svg/mastercard.SVG" alt="mastercard" />
        <img src="svg/visa.SVG" alt="visa" />
      </div>
    </div>
  );
};

export default ContactsBox;
