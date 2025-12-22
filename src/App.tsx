import "./App.css";
import { useState } from "react";
import Board from "./component/game";
import Panel from "./component/panel";

function App() {
  const [totalScore, setTotalScore] = useState(0);

  return (
    <div id="app-div">
      <Panel totalScore={totalScore} />
      <Board onScoreChange={setTotalScore} />
    </div>
  );
}

export default App;
