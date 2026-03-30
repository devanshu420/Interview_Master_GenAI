import { createContext, useState } from "react";

export const InterviewContext = createContext();

const InterviewContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [allReports, setAllReports] = useState([]);

  return (
    <InterviewContext.Provider value={{ loading, setLoading, report, setReport, allReports, setAllReports }}>
      {children}
    </InterviewContext.Provider>
  );
};

export default InterviewContextProvider;
