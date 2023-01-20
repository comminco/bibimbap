import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";

ReactDOM.createRoot(document.getElementById("_bibimbap") as HTMLElement).render(
  <RecoilRoot>
    <Router>
      <App />
    </Router>
  </RecoilRoot>
);
