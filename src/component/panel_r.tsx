import { useEffect, useRef, useState } from "react";
import "./game.css";

type Solution = [string, [number, number], number, "r" | "d", boolean];

interface Props {
  solutions: Solution[];
}

const SolutionRow = ({
  sol,
  isPeeking,
  fullySolved,
}: {
  sol: Solution;
  isPeeking: boolean;
  fullySolved: boolean;
}) => {
  const [word, [i, j], points, dir, isSolved] = sol;
  const rowRef = useRef<HTMLTableRowElement>(null);

  const show = isSolved || isPeeking;

  useEffect(() => {
    if (isSolved) {
      rowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isSolved]);

  return (
    <tr
      ref={rowRef}
      className={
        fullySolved ? "row-fullsolve" : isSolved ? "row-highlight" : ""
      }
    >
      {/* 1. Sana Column */}
      <td
        style={{
          paddingLeft: `0.75vh`,
          overflow: "hidden",
          whiteSpace: "nowrap",
          width: "12vh",
        }}
      >
        {show ? (
          word.toUpperCase()
        ) : (
          <div
            style={{
              backgroundColor: "#16191780",
              width: "12vh",
              height: "2vh",
              borderRadius: "1vh",
            }}
          />
        )}
      </td>
      {/* 2. Location Column */}
      <td>
        <div
          style={{
            display: `flex`,
            justifyContent: `center`,
            width: "3.5vh",
          }}
        >
          {show ? (
            <span className="location-text-div">
              {String.fromCharCode(64 + i + 1)}
              {j + 1}
            </span>
          ) : (
            <div
              style={{
                backgroundColor: "#16191780",
                width: "3.5vh",
                height: "2vh",
                borderRadius: "1vh",
              }}
            />
          )}
        </div>
      </td>
      {/* 3. Direction Column */}
      <td
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "2vh",
        }}
      >
        {show ? (
          dir === "r" ? (
            "→"
          ) : (
            "↓"
          )
        ) : (
          <div
            style={{
              backgroundColor: "#16191780",
              width: "2vh",
              height: "2vh",
              borderRadius: "1vh",
            }}
          />
        )}
      </td>
      {/* 4. Points Column */}
      <td className={show ? "" : "points-unsolved"}>{points}</td>
    </tr>
  );
};

const PanelR = ({ solutions }: Props) => {
  const [isPeeking, setIsPeeking] = useState(false);

  return (
    <div
      id="side-panel-container"
      className={solutions.length > 0 ? "master-appear-animation" : "master"}
    >
      <span id="table-title">- RATKAISUT -</span>

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
              <SolutionRow
                key={idx}
                sol={sol}
                isPeeking={isPeeking}
                fullySolved={solutions
                  .filter((solution) => solution[0] === sol[0])
                  .every((solution) => solution[4] === true)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <span
        id="click-to-reveal"
        onMouseDown={() => setIsPeeking(true)}
        onMouseUp={() => setIsPeeking(false)}
        onMouseLeave={() => setIsPeeking(false)}
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        Paljasta (pidä painettuna)
      </span>
    </div>
  );
};

export default PanelR;
