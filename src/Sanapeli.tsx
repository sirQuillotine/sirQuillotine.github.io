import "./App.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Board from "./component/game";
import Panel from "./component/panel";

interface Props {
  seedProp?: string;
}

const Sanapeli = ({ seedProp }: Props) => {
  const [stats, setStats] = useState<number[]>([]);
  const [hint, setHint] = useState<string>();
  const location = useLocation();
  const navigate = useNavigate();

  const seedFromState = (location.state as { seed?: string } | null)?.seed;

  const [sessionSeed, setSessionSeed] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (seedFromState) {
      setSessionSeed(seedFromState);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [seedFromState, location.pathname, navigate]);

  const s = seedProp ?? sessionSeed ?? "0";

  return (
    <div id="app-div">
      <Panel stats={stats} onHint={setHint} />
      <Board onstatsChange={setStats} seed={s} hint={hint} />
    </div>
  );
};

export default Sanapeli;
