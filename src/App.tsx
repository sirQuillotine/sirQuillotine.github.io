import "./App.css";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  Navigate,
} from "react-router-dom";
import Board from "./component/game";
import Panel from "./component/panel_l";
import Sanapeli from "./Sanapeli";

const SeedRedirect = () => {
  const { seed } = useParams();
  return <Navigate to="/" state={{ seed }} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sanapeli />} />
        <Route path="/:seed" element={<SeedRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
