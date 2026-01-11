import { useEffect, useRef, useState } from "react";
import "./game.css";

type Solution = [string, [number, number], number, boolean, boolean];

interface Props {
  solutions: Solution[];
  onHint?: (hint: string) => void;
  onReload?: (hint: string) => void;
  seed?: string;
}

var seedNumber = "0";

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
          dir ? (
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

const PanelR = ({ solutions, onHint, onReload, seed = "0" }: Props) => {
  const [isPeeking, setIsPeeking] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const setCookie = (name: any, value: any, days: any) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  };

  const handleShare = () => {
    console.log("Kopitoitu siemen", seedNumber);
    navigator.clipboard.writeText(
      "https://sirquillotine.github.io/#/" + seedNumber
    );
    //https://sirquillotine.github.io/#/
    //window.location.href

    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  const handleInfo = () => {
    setShowInfo((prev) => !prev);
  };

  function setHint() {
    onHint?.(Math.random().toString());
  }
  function setReload() {
    console.log("Refresh...");

    setCookie("time", 0, 7);
    ///setTime(0);  <-------- TÄÄÄÄ ON TÄRKEE

    onReload?.(Math.floor(Math.random() * 1000000).toString());
  }

  seedNumber = seed;

  return (
    <div
      id="bottom-panel-container"
      className={solutions.length > 0 ? "master-appear-animation" : "master"}
    >
      <div className={`popup-toast ${showPopup ? "show" : ""}`}>
        Linkki kopioitu leikepöydälle!
      </div>
      <div className={`popup-info ${showInfo ? "show" : ""}`}>
        <span>
          Etsi kaikki Scrabble-sääntöjen mukaiset ratkaisut laudalta. Arvatut ja
          arvaamatta olevat ratkaisut sekä niiden pistemäärät näet oikeasta
          sivupalkista.
        </span>
      </div>

      <div className="solutioncontainer">
        <div id="side-panel-container">
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
      </div>

      <div className="buttoncontainer">
        <div
          id="side-panel-button-info"
          className="side-panel-button"
          onMouseEnter={handleInfo}
          onMouseLeave={handleInfo}
        ></div>
        <div
          id="side-panel-button-hint"
          className="side-panel-button"
          onClick={setHint}
        ></div>
        <div
          id="side-panel-button-share"
          className="side-panel-button"
          onClick={() => {
            handleShare();
          }}
        ></div>
        <div
          id="side-panel-button-restart"
          className="side-panel-button"
          onClick={setReload}
        ></div>
      </div>
    </div>
  );
};

export default PanelR;
