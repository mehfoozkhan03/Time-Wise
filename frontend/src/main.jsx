import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles/global.css";

import { AuthProvider } from "./context/AuthContext";

import { Provider } from "react-redux";

import store from "../src/store/store.js";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
      </BrowserRouter>
    </Provider>
  </>,
);
