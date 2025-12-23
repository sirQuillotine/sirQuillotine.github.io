import "./game.css";

interface PanelProps {
  stats?: number[];
  onHint?: (hint: string) => void;
  seed?: string;
}

var seedNumber = "0";
const PanelL = ({
  stats = [1, 100, 1, 100],
  onHint,
  seed = "0",
}: PanelProps) => {
  function setHint() {
    onHint?.(Math.random().toString());
  }

  if (seedNumber === "0") {
    seedNumber = seed;
  }

  return (
    <div>
      <div id="points-and-bar-container">
        <div className="display-container">
          <span className="points-points">{stats[0]}</span>
          <span className="points-header"> PISTETTÄ</span>
          <div id="progress-bar-points" className="progress-bar">
            <div className="progress-bar-background progress-bar-item"></div>
            <div
              className="progress-bar-bar progress-bar-item"
              style={{ width: `${(stats[0] / stats[1]) * 100}%` }}
            ></div>
            <span className="progress-bar-text progress-bar-item">
              {((stats[0] / stats[1]) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="display-container">
          <span className="points-points">{stats[2]}</span>
          <span className="points-header"> RATKAISUA</span>
          <div id="progress-bar-words" className="progress-bar">
            <div className="progress-bar-background progress-bar-item"></div>
            <div
              className="progress-bar-bar progress-bar-item"
              style={{ width: `${(stats[2] / stats[3]) * 100}%` }}
            ></div>
            <span className="progress-bar-text progress-bar-item">
              {((stats[2] / stats[3]) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      <div
        id="side-panel-button-hint"
        className="side-panel-button"
        onClick={setHint}
      ></div>
      <div
        id="side-panel-button-share"
        className="side-panel-button"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href + seedNumber);
        }}
      ></div>
      <div
        id="side-panel-button-restart"
        className="side-panel-button"
        onClick={() => {
          window.location.reload();
        }}
      ></div>
    </div>
  );
};

export default PanelL;
