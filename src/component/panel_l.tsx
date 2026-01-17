import { useState } from "react";
import "./game.css";

interface PanelProps {
  stats: number[];
  onHint: (hint: string) => void;
  onReload: (hint: string) => void;
  seed: string;
  time: number;
}

var seedNumber = "0";

const PanelL = ({
  stats = [1, 100, 1, 100],
  onHint,
  onReload,
  seed = "0",
  time,
}: PanelProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleShare = () => {
    console.log("Kopitoitu siemen", seedNumber);
    navigator.clipboard.writeText(
      "https://sirquillotine.github.io/#/" + seedNumber
    );
    //https://sirquillotine.github.io/#/
    //window.location.href

    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  const handleInfo = () => {
    setShowInfo((prev) => !prev);
  };

  function setHint() {
    onHint?.(Math.random().toString());
  }
  function setReload() {
    console.log("Refresh...");
    onReload?.(Math.floor(Math.random() * 1000000).toString());
  }

  seedNumber = seed;

  const getFormattedTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };
  return (
    <div
      id="panel-l-parent"
      className={stats[1] > 0 ? "master-appear-animation" : "master"}
    >
      <div className={`popup-toast ${showPopup ? "show" : ""}`}>
        Linkki kopioitu leikepöydälle!
      </div>
      <div className={`popup-info ${showInfo ? "show" : ""}`}>
        <span>
          Etsi kaikki Scrabble-sääntöjen mukaiset ratkaisut laudalta. Arvatut ja
          arvaamatta olevat ratkaisut sekä niiden pistemäärät näet oikeasta
          sivupalkista.
        </span>
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
        onMouseEnter={handleInfo}
        onMouseLeave={handleInfo}
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
