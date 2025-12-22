import "./game.css";

interface PanelProps {
  totalScore: number;
}

const Panel = ({ totalScore }: PanelProps) => {
  return (
    <div id="points-and-bar-container">
      <div className="display-container">
        <span className="points-points">{totalScore}</span>
        <span className="points-header"> PISTETTÄ</span>
        <div id="progress-bar-points" className="progress-bar">
          <div className="progress-bar-background progress-bar-item"></div>
          <div className="progress-bar-bar progress-bar-item"></div>
          <span className="progress-bar-text progress-bar-item">15 %</span>
        </div>
      </div>
      <div className="display-container">
        <span className="points-points">{totalScore}</span>
        <span className="points-header"> SANAA</span>
        <div id="progress-bar-words" className="progress-bar">
          <div className="progress-bar-background progress-bar-item"></div>
          <div className="progress-bar-bar progress-bar-item"></div>
          <span className="progress-bar-text progress-bar-item">25 %</span>
        </div>
      </div>
    </div>
  );
};

export default Panel;
