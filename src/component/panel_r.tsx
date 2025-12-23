import { useEffect, useRef } from "react";
import "./game.css";

type Solution = [string, [number, number], number, "r" | "d", boolean];

interface Props {
  solutions: Solution[];
}

const SolutionRow = ({ sol }: { sol: Solution }) => {
  const [word, [i, j], points, dir, isSolved] = sol;
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (isSolved) {
      rowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isSolved]);

  return (
    <tr ref={rowRef} className={isSolved ? "row-highlight" : ""}>
      {/* 1. Sana Column */}
      <td>
        {isSolved ? (
          word.toUpperCase()
        ) : (
          <div
            style={{
              backgroundColor: "#161917ba",
              width: "12vh",
              height: "2vh",
              borderRadius: "1vh",
            }}
          />
        )}
      </td>
      {/* 2. Location Column */}
      <td>
        {isSolved ? (
          `${String.fromCharCode(64 + i + 1)}${j + 1}`
        ) : (
          <div
            style={{
              backgroundColor: "#161917ba",
              width: "3.5vh",
              height: "2vh",
              borderRadius: "1vh",
            }}
          />
        )}
      </td>
      {/* 3. Direction Column */}
      <td
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        {isSolved ? (
          dir === "r" ? (
            "→"
          ) : (
            "↓"
          )
        ) : (
          <div
            style={{
              backgroundColor: "#161917ba",
              width: "2vh",
              height: "2vh",
              borderRadius: "1vh",
            }}
          />
        )}
      </td>
      {/* 4. Points Column */}
      <td className={isSolved ? "" : "points-unsolved"}>{points}</td>
    </tr>
  );
};

const PanelR = ({ solutions }: Props) => {
  return (
    <div id="side-panel-container" className="master-appear-animation">
      <span>- RATKAISUT -</span>
      <div id="table-container">
        <table id="word-table">
          <thead>
            <tr>
              <th> Sana</th>
              <th className="header-icon">
                <img src="graphics/location_icon.svg" alt="Loc" />
              </th>
              <th className="header-icon">
                <img src="graphics/direction_icon.svg" alt="Dir" />
              </th>
              <th className="header-icon">
                <img src="graphics/points_icon.svg" alt="Pts" />
              </th>
            </tr>
          </thead>
          <tbody>
            {solutions.map((sol, idx) => (
              <SolutionRow key={idx} sol={sol} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelR;
