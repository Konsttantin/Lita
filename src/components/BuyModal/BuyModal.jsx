import { useState } from 'react';
import cn from 'classnames';

import cl from './buyModal.module.css';

const BuyModal = ({ onClose, onAgree }) => {
  const [isAgree, setIsAgree] = useState(false);

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
          <a
            href="https://drive.google.com/file/d/1pMbivt5QENn07Kzag_GuHXEqWtjxOXvg/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            &nbsp;оферти
          </a>
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
