import { useEffect, useState } from 'react';
import './App.css'
import Navigation from './components/Navigation/Navigation';
import Survey from './components/Survey/Survey';
import { post } from './utils/api';
import HomePage from './components/HomePage/HomePage';
import Results from './components/Results/Results';

function App() {
  // const [isLoading, setIsLoading] = useState(true);
  const [requires, setRequires] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTestCategory, setSelectedTestCategory] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [navigationState, setNavigationState] = useState('Home');

  useEffect(() => {
    (async() => {
      const categories = await fetch('https://api-lita.ingello.com/v1/test-category/index?-all=1').then(resp => resp.json());
      const requires = await fetch('https://api-lita.ingello.com/v1/test-question-requires/index?-all=1').then(resp => resp.json());

      setCategories(categories);
      setRequires(requires);
      // setIsLoading(false);
    })()
  }, []); // load test categories and requires

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
          selectedCategory={selectedTestCategory}
          onBackHome={() => {
            setNavigationState('Home');
            setSelectedTestCategory(null);
          }}
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
        }}
      />
    </div>
  );
}

export default App
