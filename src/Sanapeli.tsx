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

const Sanapeli = () => {
  const setCookie = (name: any, value: any, days: any) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  };

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
    console.log("juu");
    setSeed(seed);
  }

  return (
    <div id="app-div">
      <PanelL stats={stats} onHint={setHint} seed={s} onReload={OnSeed} />
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
