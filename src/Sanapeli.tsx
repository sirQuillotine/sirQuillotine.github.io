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
import Panel from "./component/panel";

interface Props {
  seedProp?: string;
}

const Sanapeli = ({ seedProp }: Props) => {
  const [stats, setStats] = useState<number[]>([]);
  const location = useLocation();
  const seedFromState = (location.state as { seed?: string } | null)?.seed;

  const s = seedProp ?? seedFromState ?? "0";

  return (
    <div id="app-div">
      <Panel stats={stats} />
      <Board onstatsChange={setStats} seed={s} />
    </div>
  );
};

export default Sanapeli;
