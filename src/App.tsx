import "./App.css";
import { useState } from "react";
import Board from "./component/game";
import Panel from "./component/panel";

function App() {
  const [stats, setStats] = useState<number[]>([]);

  return (
    <div id="app-div">
      <Panel stats={stats} />
      <Board onstatsChange={setStats} />
    </div>
  );
}

export default App;
