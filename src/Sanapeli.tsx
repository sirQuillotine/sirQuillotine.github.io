import "./App.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Board from "./component/game";
import PanelL from "./component/panel_l";
import PanelR from "./component/panel_r";
import PanelT from "./component/panel_t";
import PanelB from "./component/panel_b";

var getCookieTime = true;

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

  const setCookie = (name: any, value: any, days: any) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
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
    setTime(0);
    setCookie("time", 0, 7);
  }

  const [time, setTime] = useState(0);
  if (getCookieTime) {
    var cookieTime = getCookie("time");
    if (cookieTime) {
      getCookieTime = false;
      setTime(parseFloat(cookieTime));
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        setCookie("time", prev + 1000, 7);
        return prev + 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="app-div">
      <PanelT stats={stats} time={time} />
      <PanelL
        stats={stats}
        onHint={setHint}
        seed={s}
        onReload={OnSeed}
        time={time}
      />
      <Board
        onstatsChange={setStats}
        seed={s}
        onSolutionsChange={setSolutions}
        hint={hint}
      />
      <PanelB
        solutions={solutions}
        onHint={setHint}
        seed={s}
        onReload={OnSeed}
      />
      <PanelR solutions={solutions} />
    </div>
  );
};

export default Sanapeli;
