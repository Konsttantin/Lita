import React, { useMemo, useState } from "react";

export const OfferPageContext = React.createContext({
  showOfferPage: false,
  setShowOfferPage() {},
});

export const OfferContextProvider = ({ children }) => {
  const [showOfferPage, setShowOfferPage] = useState(false);

  const contextValue = useMemo(() => ({
    showOfferPage,
    setShowOfferPage
  }), [showOfferPage]);

  return (
    <OfferPageContext.Provider value={contextValue}>
      {children}
    </OfferPageContext.Provider>
  )
}
