import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Board from "./component/game";
import PanelL from "./component/panel_l";
import PanelR from "./component/panel_r";

interface Props {
  seedProp?: string;
}

const Sanapeli = ({ seedProp }: Props) => {
  const [stats, setStats] = useState<number[]>([]);
  const [hint, setHint] = useState<string>();
  const location = useLocation();
  const [solutions, setSolutions] = useState<any[]>([]);

  const navigate = useNavigate();

  const seedFromState = (location.state as { seed?: string } | null)?.seed;

  const [sessionSeed, setSessionSeed] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (seedFromState) {
      setSessionSeed(seedFromState);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [seedFromState, location.pathname, navigate]);

  const s =
    seedProp ?? sessionSeed ?? Math.floor(Math.random() * 1000000).toString();

  return (
    <div id="app-div">
      <PanelL stats={stats} onHint={setHint} seed={s} />
      <Board
        onstatsChange={setStats}
        seed={s}
        onSolutionsChange={setSolutions}
        hint={hint}
      />
      <PanelR solutions={solutions} />
    </div>
  );
};

export default Sanapeli;
