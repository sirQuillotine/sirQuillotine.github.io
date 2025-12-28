import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";
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
