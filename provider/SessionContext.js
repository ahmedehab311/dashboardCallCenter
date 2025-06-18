import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [showSessionDialog, setShowSessionDialog] = useState(false);

  const handleInvalidToken = () => {
    setShowSessionDialog(true);
  };
  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;

  const logout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    window.location.replace(`/${language}/login`);
  };

  return (
    <SessionContext.Provider value={{ handleInvalidToken }}>
      {children}

      {showSessionDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowSessionDialog(false)} //  المفترض يقفل هنا
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center"
            onClick={(e) => e.stopPropagation()} // يمنع قفل الديالوج لو ضغط جوه
          >
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Session Expired
            </h2>
            <p className="mb-6">
              Your session has expired. Please login again.
            </p>
            <Button
              onClick={logout}
              className=" text-[#000] dark:text-[#fff] px-4 py-2 rounded"
            >
              Go to Login
            </Button>
          </div>
        </div>
      )}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
