import { useEffect } from 'react';
import './App.css'
import Navigation from './components/Navigation/Navigation';
import Survey from './components/Survey/Survey';

function App() {
  useEffect(() => {
    if (!localStorage.getItem('userID')) {
      (async () => {
        localStorage.setItem('userID', await fetch('https://api-lita.ingello.com/v1/patient/create', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({user_id: 2})
        }).then(resp => resp.json()).then(resp => resp.id));
      })()
    }
  }, []);

  return (
    <div className="container">
      <Survey />
      <Navigation />
    </div>
  );
}

export default App
