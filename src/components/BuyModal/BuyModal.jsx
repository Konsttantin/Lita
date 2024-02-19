import { useContext, useState } from 'react';
import cn from 'classnames';

import cl from './buyModal.module.css';
import { OfferPageContext } from '../../context/OfferPageContext';

const BuyModal = ({ onClose, onAgree }) => {
  const [isAgree, setIsAgree] = useState(false);
  const { setShowOfferPage } = useContext(OfferPageContext)


  return (
    <div className={cl.buyModal}>
      <div className={cl.modalBody}>
        <p className={cl.message}>
          Оформлення замовлення
        </p>

        <label
          htmlFor={1}
          className={cl.checkItem}
        >
          <input
            type="checkbox"
            id={1}
            className={cl.checkInput}
            checked={isAgree}
            onChange={() => setIsAgree(current => !current)}
          />
          <span className={cl.checkmark}></span>
          {'Згоден з договором'}
          <button
            onClick={() => setShowOfferPage(true)}
            className={cl.offerButton}
          >
            &nbsp;оферти
          </button>
        </label>

        <button
          className={cn(cl.okButton, { [cl.disabled]: !isAgree })}
          onClick={() => {
            onAgree();
            onClose();
          }}
          disabled={!isAgree}
        >
          Оформити
        </button>

        <button
          className={cl.closeButton}
          onClick={onClose}
        >
          <img src="svg/cross.SVG" alt="close" />
        </button>
      </div>
    </div>
  );
};

export default BuyModal;
