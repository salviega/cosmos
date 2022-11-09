import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "bootstrap";
import "bootstrap/js/dist/util";
import "bootstrap/js/dist/dropdown";
import "./styles/index.scss";
import { HashRouter } from "react-router-dom";
import { CosmosProvider } from "./hooks/context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <CosmosProvider>
        <App />
      </CosmosProvider>
    </HashRouter>
  </React.StrictMode>
);
