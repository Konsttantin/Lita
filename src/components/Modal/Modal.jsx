import cl from './Modal.module.css';

const Modal = ({message, onClose}) => {
  return (
    <div className={cl.wrapper}>
      <div className={cl.modal}>
        <p className={cl.message}>
          {message}
        </p>

        <button
          className={cl.okButton}
          onClick={onClose}
        >
          Зрозуміло
        </button>
      </div>
    </div>
  );
};

export default Modal;
