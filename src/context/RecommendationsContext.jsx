import React, { useMemo, useState } from "react";

export const RecommendationsContext = React.createContext({
  showRecs: false,
  setShowRecs() {},
});

export const RecommendationsContextProvider = ({ children }) => {
  const [showRecs, setShowRecs] = useState(false);

  const contextValue = useMemo(() => ({
    showRecs,
    setShowRecs
  }), [showRecs]);

  return (
    <RecommendationsContext.Provider value={contextValue}>
      {children}
    </RecommendationsContext.Provider>
  )
}
