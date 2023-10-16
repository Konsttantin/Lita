import { useEffect } from 'react';
import './App.css'
import Navigation from './components/Navigation/Navigation';
import Survey from './components/Survey/Survey';
import { post } from './utils/api';

function App() {
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

  }, []);

  return (
    <div className="container">
      <Survey />
      <Navigation />
    </div>
  );
}

export default App
