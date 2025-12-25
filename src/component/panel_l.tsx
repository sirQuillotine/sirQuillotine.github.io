import { useState, useEffect } from "react";
import "./game.css";

interface PanelProps {
  stats?: number[];
  onHint?: (hint: string) => void;
  onReload?: (hint: string) => void;
  seed?: string;
}

var seedNumber = "0";
var startTime = 0;
var oldTime = 0;

const PanelL = ({
  stats = [1, 100, 1, 100],
  onHint,
  onReload,
  seed = "0",
}: PanelProps) => {
  const [showPopup, setShowPopup] = useState(false);

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

  if (startTime === 0) {
    var o = getCookie("time");
    if (o) {
      oldTime = parseFloat(o);
    }
    startTime = new Date().getTime();
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href + seedNumber);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };
  function setHint() {
    onHint?.(Math.random().toString());
  }
  function setReload() {
    console.log("Refresh...");
    startTime = new Date().getTime();
    oldTime = 0;
    setCookie("time", 0, 7);

    onReload?.(Math.floor(Math.random() * 1000000).toString());
  }

  const [time, setTime] = useState(new Date().getTime() - startTime);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().getTime() - startTime);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (time !== null) setCookie("time", time + oldTime, 7);
  }, [time]);

  //if (seedNumber === "0") {
  seedNumber = seed;
  //}

  const getFormattedTime = (milliseconds: number) => {
    const totalSeconds = Math.floor((milliseconds + oldTime) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className={stats[1] > 0 ? "master-appear-animation" : "master"}>
      <div className={`popup-toast ${showPopup ? "show" : ""}`}>
        Linkki kopioitu leikepöydälle!
      </div>
      <div id="points-and-bar-container">
        <div id="timer">
          <img src="/graphics/timer_icon.svg" />
          <span className="points-header">{getFormattedTime(time)}</span>
        </div>
        <div className="display-container">
          <span className="points-points">{stats[0]}</span>
          <span className="points-header"> PISTETTÄ ({stats[1]})</span>
          <div id="progress-bar-points" className="progress-bar">
            <div className="progress-bar-background progress-bar-item"></div>
            <div
              className="progress-bar-bar progress-bar-item"
              style={{
                clipPath: `inset(0 ${
                  stats[1] === 0 ? 100 : 100 - (stats[0] / stats[1]) * 100
                }% 0 0)`,
              }}
            ></div>
            <span className="progress-bar-text progress-bar-item">
              {stats[1] === 0 ? 0 : ((stats[0] / stats[1]) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="display-container">
          <span className="points-points">{stats[2]}</span>
          <span className="points-header">RATKAISUA ({stats[3]})</span>
          <div id="progress-bar-words" className="progress-bar">
            <div className="progress-bar-background progress-bar-item"></div>
            <div
              className="progress-bar-bar progress-bar-item"
              style={{
                clipPath: `inset(0 ${
                  stats[1] === 0 ? 100 : 100 - (stats[2] / stats[3]) * 100
                }% 0 0)`,
              }}
            ></div>
            <span className="progress-bar-text progress-bar-item">
              {stats[3] === 0 ? 0 : ((stats[2] / stats[3]) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      <div
        id="side-panel-button-info"
        className="side-panel-button"
        onClick={setHint}
      ></div>
      <div
        id="side-panel-button-hint"
        className="side-panel-button"
        onClick={setHint}
      ></div>
      <div
        id="side-panel-button-share"
        className="side-panel-button"
        onClick={() => {
          handleShare();
        }}
      ></div>
      <div
        id="side-panel-button-restart"
        className="side-panel-button"
        onClick={setReload}
      ></div>
    </div>
  );
};

export default PanelL;
