import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import { ToastProvider } from "./components/shared/Toast";
import { ScopeProvider } from "./hooks/useScope";
import App from "./App";
import i18n from "./i18n";
import "./styles/globals.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <ToastProvider>
            <BrowserRouter>
              <ScopeProvider>
                <App />
              </ScopeProvider>
            </BrowserRouter>
          </ToastProvider>
        </I18nextProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
