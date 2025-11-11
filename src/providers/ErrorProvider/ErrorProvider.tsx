import {
  createContext,
  useState,
  useContext,
  FC,
  PropsWithChildren,
} from "react";

interface ErrorContextType {
  error: any;
  setError: (error: any) => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

const ErrorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [error, setError] = useState<any>(null);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }

  return context;
};

export default ErrorProvider;
