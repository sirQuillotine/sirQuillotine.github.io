import "./game.css";

type Solution = [
  string, // word
  [number, number], // [i, j]
  number, // r (points)
  "r" | "d", // direction
  boolean // solved
];

interface Props {
  solutions: Solution[];
}

const PanelR = ({ solutions }: Props) => {
  return (
    <div id="side-panel-container" className="master-appear-animation">
      <span>RATKAISUT</span>
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
            {solutions.map((sol, idx) => {
              var [word, [i, j], points, dir, isSolved] = sol;
              //isSolved = true; //-------näytä kaikki ratkaisut
              return (
                <tr key={idx}>
                  <td>
                    {isSolved ? (
                      `${word.toUpperCase()}`
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
                  <td className={isSolved ? "" : "points-unsolved"}>
                    {points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelR;
