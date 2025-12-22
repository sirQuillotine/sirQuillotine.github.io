import "./game.css";

interface PanelProps {
  totalScore: number;
}
const maxScore = 256; //ESIMERKKIARVOT
const maxWords = 256;

const Panel = ({ totalScore }: PanelProps) => {
  return (
    <div id="points-and-bar-container">
      <div className="display-container">
        <span className="points-points">{totalScore}</span>
        <span className="points-header"> PISTETTÄ</span>
        <div id="progress-bar-points" className="progress-bar">
          <div className="progress-bar-background progress-bar-item"></div>
          <div
            className="progress-bar-bar progress-bar-item"
            style={{ width: `${(totalScore / maxScore) * 100}%` }}
          ></div>
          <span className="progress-bar-text progress-bar-item">
            {((totalScore / maxScore) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="display-container">
        <span className="points-points">{totalScore}</span>
        <span className="points-header"> SANAA</span>
        <div id="progress-bar-words" className="progress-bar">
          <div className="progress-bar-background progress-bar-item"></div>
          <div
            className="progress-bar-bar progress-bar-item"
            style={{ width: `${(totalScore / maxScore) * 100}%` }}
          ></div>
          <span className="progress-bar-text progress-bar-item">
            {((totalScore / maxScore) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default Panel;
