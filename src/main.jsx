import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './fonts/fonts.css'
import { OfferContextProvider } from './context/OfferPageContext.jsx'
import { RecommendationsContextProvider } from './context/RecommendationsContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <RecommendationsContextProvider>
    <OfferContextProvider>
      <App />
    </OfferContextProvider>
  </RecommendationsContextProvider>
)
