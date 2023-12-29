import { useContext, useEffect, useState } from 'react';
import './App.css'
import Navigation from './components/Navigation/Navigation';
import Survey from './components/Survey/Survey';
import { get, post } from './utils/api';
import HomePage from './components/HomePage/HomePage';
import Results from './components/Results/Results';
import Modal from './components/Modal/Modal';
import OfferPage from './components/OfferPage/OfferPage';
import { OfferPageContext } from './context/OfferPageContext';

function App() {
  // const [isLoading, setIsLoading] = useState(true);
  const [allContext, setAllContext] = useState([]);
  const [requires, setRequires] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTestCategory, setSelectedTestCategory] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [navigationState, setNavigationState] = useState('Home');
  const [showModal, setShowModal] = useState(false);

  const { showOfferPage, setShowOfferPage } = useContext(OfferPageContext);

  const backHomeHandler = () => {
    setNavigationState('Home');
    setSelectedTestCategory(null);
  };

  const closeModalHandler = () => {
    backHomeHandler();
    setShowModal(false);
  }

  const closeOfferPage = () => {
    setShowOfferPage(false);
  }

  useEffect(() => {
    (async() => {
      let categories = await get('test-category/index?-all=1');
      const requires = await get('test-question-requires/index?-all=1');
      const allContext = await get('test-answer-context/index?-all=1');

      categories = categories.filter(category => category.is_disabled !== 1);

      setCategories(categories);
      setRequires(requires);
      setAllContext(allContext);
      // setIsLoading(false);
    })()
  }, []); // load test categories, requires and context

  useEffect(() => {
    const localUser = localStorage.getItem('userID');

    (async () => {
      if (localUser) {
        try {
          const userResponse = await fetch(`https://api-lita.ingello.com/v1/patient/view?id=${localUser}`);

          if (userResponse.ok) {
            return;
          }

          throw new Error('Local user doesn\'t exist');
        } catch (error) {
          console.log(error);
        }
      }

      localStorage.setItem('userID', await post('patient/create', {user_id: 2}).then(resp => resp.id));
    })()

  }, []); // set userID

  return (
    <div className="container">
      {showModal && (
        <Modal
          message={'Вибачте, 1 версія тесту в доступі тільки для жінок'}
          onClose={closeModalHandler}
        />
      )}

      {showOfferPage && (
        <OfferPage onClose={closeOfferPage} />
      )}

      {navigationState === 'Home' && (
        <HomePage
          categories={categories}
          onCategoryChange={(value) => {
            setSelectedTestCategory(value);
            setNavigationState(null);
          }}
          onResults={() => {
            setShowResults(true);
            setNavigationState(null);
          }}
        />
      )}

      {selectedTestCategory && (
        <Survey
          requires={requires}
          allContext={allContext}
          selectedCategory={selectedTestCategory}
          onBackHome={backHomeHandler}
          onShowModal={setShowModal}
        />
      )}

      {showResults && (
        <Results
          categories={categories}
        />
      )}

      <Navigation
        navigationState={navigationState}
        onNavigationChange={(value) => {
          setNavigationState(value);
          setSelectedTestCategory(null);
          setShowResults(false);
          closeOfferPage();
          console.log('DOMIK!!!');
        }}
      />
    </div>
  );
}

export default App
