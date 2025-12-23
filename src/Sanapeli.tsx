import "./App.css";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  Navigate,
  useLocation,
} from "react-router-dom";
import Board from "./component/game";
import PanelL from "./component/panel_l";

interface Props {
  seedProp?: string;
}

const Sanapeli = ({ seedProp }: Props) => {
  const [stats, setStats] = useState<number[]>([]);
  const [hint, setHint] = useState<string>();
  const location = useLocation();
  const seedFromState = (location.state as { seed?: string } | null)?.seed;

  const s = seedProp ?? seedFromState ?? "0";

  return (
    <div id="app-div">
      <PanelL stats={stats} onHint={setHint} />
      <Board onstatsChange={setStats} seed={s} hint={hint} />
    </div>
  );
};

export default Sanapeli;
