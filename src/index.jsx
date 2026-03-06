import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../style.css";

document.addEventListener("DOMContentLoaded", () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
});
