"use client";
import { Provider } from "react-redux";
import store from "@/store/store";
// import { useTokenValidation } from "/app/[lang]/(auth)/services/authService";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function RootLayout({ children, params: { lang } }) {
  // useTokenValidation();
  return (
    <html lang={lang}>
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
