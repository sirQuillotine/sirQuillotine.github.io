import "./App.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Board from "./component/game";
import PanelL from "./component/panel_l";
import PanelR from "./component/panel_r";
import PanelT from "./component/panel_t";
import PanelB from "./component/panel_b";

const Sanapeli = () => {
  const getCookie = (name: any) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const popped = parts.pop();
      return popped?.split(";").shift();
    }
    return null;
  };

  const [stats, setStats] = useState<number[]>([]);
  const [hint, setHint] = useState<string>();
  const location = useLocation();
  const [solutions, setSolutions] = useState<any[]>([]);

  const navigate = useNavigate();

  const seedFromState = (location.state as { seed?: string } | null)?.seed;

  const [seed, setSeed] = useState<string>(
    () =>
      seedFromState ??
      getCookie("seed") ??
      Math.floor(Math.random() * 1000000).toString()
  );

  useEffect(() => {
    if (seedFromState) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [seedFromState, location.pathname, navigate]);

  const s = seed;

  function OnSeed(seed: string) {
    setStats([0, 0, 0, 0]);
    setSolutions([]);
    setSeed(seed);
  }

  return (
    <div id="app-div">
      <PanelT stats={stats} onHint={setHint} seed={s} onReload={OnSeed} />
      <PanelL stats={stats} onHint={setHint} seed={s} onReload={OnSeed} />
      <Board
        onstatsChange={setStats}
        seed={s}
        onSolutionsChange={setSolutions}
        hint={hint}
      />
      <PanelB solutions={solutions} />
      <PanelR solutions={solutions} />
    </div>
  );
};

export default Sanapeli;
