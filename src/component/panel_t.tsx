import "./game.css";

interface PanelProps {
  stats: number[];
  time: number;
}

const PanelT = ({ stats = [1, 100, 1, 100], time }: PanelProps) => {
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
      id="panel-t-parent"
      className={stats[1] > 0 ? "master-appear-animation" : "master"}
    >
      <div id="points-and-bar-container">
        <div id="timer">
          <img src="/graphics/timer_icon.svg" />
          <span className="points-header">{getFormattedTime(time)}</span>
        </div>
        <div className="display-row">
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
      </div>
    </div>
  );
};

export default PanelT;
