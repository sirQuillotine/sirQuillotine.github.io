import "./game.css";

interface PanelProps {
  totalScore: number;
}

const Panel = ({ totalScore }: PanelProps) => {
  return (
    <div className="points-and-bar-container">
      <div id="score-display">
        <span className="points-header">PISTEITÄ KERÄTTY</span>
        <span className="points-points">{totalScore}</span>
        <div id="progress-bar-points" className="progress-bar">
          <div className="progressbar-bar"></div>
          <div className="progress-bar-background"></div>
        </div>
      </div>
      <div className="points-and-bar-container">
        <span className="points-header">SANOJA LÖYDETTY</span>
        <span className="points-points">{totalScore}</span>
        <div id="progress-bar-words" className="progress-bar">
          <div className="progressbar-bar"></div>
          <div className="progress-bar-background"></div>
        </div>
      </div>
    </div>
  );
};

export default Panel;
