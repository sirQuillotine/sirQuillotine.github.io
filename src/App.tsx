import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";
import Sanapeli from "./Sanapeli";
import SanapeliMobile from "./SanaPeliMobile";

const SeedRedirect = () => {
  const { seed } = useParams();
  return <Navigate to="/" state={{ seed }} replace />;
};

function isMobile() {
  return window.innerWidth <= 800 && window.innerHeight <= 600;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isMobile() ? <SanapeliMobile /> : <Sanapeli />}
        />
        <Route path="/:seed" element={<SeedRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
