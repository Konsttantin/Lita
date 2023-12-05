import cl from './Loader.module.css';

const Loader = () => {
  return (
    <div className={cl.loader}>
      <img src="big-loader.gif" alt="Loading" />
    </div>
  );
};

export default Loader;
