import { useState, useEffect, useMemo } from "react";
import "./game.css";

// (0) = tyhjä, (1) = 2x kirjain, (2) = 3x kirjain,
// (3) = 2x sana, (4) = 3x sana, (5) = keskikohta (tyhjä mutta eri design)
const TILE_STYLES = [
  [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4],
  [0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0],
  [0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0],
  [1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1],
  [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
  [4, 0, 0, 1, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0, 4],
  [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
  [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
  [1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1],
  [0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0],
  [0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0],
  [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4],
];

const boardTemplate = [
  ["1", "0", "0", "4", "0", "0", "0", "1", "0", "0", "0", "4", "0", "0", "1"],
  ["0", "2", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "2", "0"],
  ["0", "0", "2", "0", "0", "0", "4", "0", "4", "0", "0", "0", "2", "0", "0"],
  ["4", "0", "0", "2", "0", "0", "0", "4", "0", "0", "0", "2", "0", "0", "4"],
  ["0", "0", "0", "0", "2", "0", "0", "0", "0", "0", "2", "0", "0", "0", "0"],
  ["0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0"],
  ["0", "0", "4", "0", "0", "0", "4", "0", "4", "0", "0", "0", "4", "0", "0"],
  ["1", "0", "0", "4", "0", "0", "0", "5", "0", "0", "0", "4", "0", "0", "1"],
  ["0", "0", "4", "0", "0", "0", "4", "0", "4", "0", "0", "0", "4", "0", "0"],
  ["0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0"],
  ["0", "0", "0", "0", "2", "0", "0", "0", "0", "0", "2", "0", "0", "0", "0"],
  ["4", "0", "0", "2", "0", "0", "0", "4", "0", "0", "0", "2", "0", "0", "4"],
  ["0", "0", "2", "0", "0", "0", "4", "0", "4", "0", "0", "0", "2", "0", "0"],
  ["0", "2", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "2", "0"],
  ["1", "0", "0", "4", "0", "0", "0", "1", "0", "0", "0", "4", "0", "0", "1"],
];

/*const test = [
  ["1", "0", "0", "4", "0", "0", "0", "1", "0", "0", "0", "4", "0", "0", "1"],
  ["0", "2", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "2", "0"],
  ["0", "0", "2", "0", "0", "0", "4", "0", "4", "0", "0", "0", "2", "0", "0"],
  ["4", "0", "0", "2", "0", "0", "0", "4", "0", "0", "0", "2", "0", "0", "4"],
  ["0", "0", "0", "0", "2", "0", "0", "0", "0", "0", "2", "0", "0", "0", "0"],
  ["0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0"],
  ["0", "0", "4", "0", "0", "0", "4", "0", "4", "0", "0", "0", "4", "0", "0"],
  ["1", "0", "0", "4", "0", "t", "i", "e", "0", "e", "s", "s", "u", "0", "1"],
  ["0", "0", "4", "0", "0", "0", "4", "0", "4", "0", "0", "0", "4", "0", "0"],
  ["0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0"],
  ["0", "0", "0", "0", "2", "0", "0", "0", "0", "0", "2", "0", "0", "0", "0"],
  ["4", "0", "0", "2", "0", "0", "0", "4", "0", "0", "0", "2", "0", "0", "4"],
  ["0", "0", "2", "0", "0", "0", "4", "0", "4", "0", "0", "0", "2", "0", "0"],
  ["0", "2", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "2", "0"],
  ["1", "0", "0", "4", "0", "0", "0", "1", "0", "0", "0", "4", "0", "0", "1"],
];*/

const LETTER_SCORES: Record<string, number> = {
  a: 1,
  b: 8,
  c: 10,
  d: 7,
  e: 1,
  f: 8,
  g: 8,
  h: 4,
  i: 1,
  j: 4,
  k: 2,
  l: 2,
  m: 3,
  n: 1,
  o: 2,
  p: 4,
  r: 4,
  s: 1,
  t: 1,
  u: 3,
  v: 4,
  w: 8,
  y: 4,
  ä: 2,
  ö: 7,
};

const STYLE_MAP: any = {
  0: "base-tile-empty",
  1: "base-tile-2x-letter",
  2: "base-tile-3x-letter",
  3: "base-tile-2x-word",
  4: "base-tile-3x-word",
  5: "base-tile-center",
};

var guess = "";
var oguessPointer: number[] = [];
var generatedBoard: string[][] = [];
var generatedHand: string[] = [];
var maxScore = 0;
var maxWord = 0;

var hintPosition = [
  [7, 4],
  [7, 9],
];
var hintDirection = true;
var removing: any;

var generating = false;
var rand: (arg0: number, arg1: number) => any;

var seedNumber = 0;

export type Solutions = [string, [number, number], number, boolean, boolean];

interface BoardProps {
  onScoreChange?: (score: number) => void;
  onstatsChange?: (stats: number[]) => void;
  hint?: any;
  seed?: string;
  onSolutionsChange: React.Dispatch<React.SetStateAction<Solutions[]>>;
}

const Board = ({
  onScoreChange,
  onstatsChange,
  seed = "0",
  hint,
  onSolutionsChange,
}: BoardProps) => {
  const [cursor, setCursor] = useState({ col: 8, row: 8 }); // kursori aluksi keskellä
  const [cursorDirection, setCursorDirection] = useState(true); // true = oikealle (default),  false = alas
  const [showPopup, setShowPopup] = useState(false);

  const [dictionary, setWords] = useState<string[]>([]);
  const dictionarySet = useMemo(() => new Set(dictionary), [dictionary]);
  const [hand, setHand] = useState<string[]>([]);
  const [guessed, setGuessed] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);

  const [hintVis, setHintVis] = useState<string>("");

  const [board, setBoard] = useState<string[][]>(boardTemplate);
  const [correctAnimation, setCorrect] = useState<string[][]>(boardTemplate);
  const [removeAnimation, setRemove] = useState<string[][]>(boardTemplate);

  const handleUsedWord = () => {
    navigator.clipboard.writeText(window.location.href + seedNumber);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };
  //if (seedNumber === 0) {
  seedNumber = parseFloat(seed);
  //}

  const screenWidth = window.screen.width;
  const [step, setStep] = useState(screenWidth > 500 ? 5.36 : 6.0266); // laatta (4.96vh) + rako (0.4vh) = 5.36vh

  useEffect(() => {
    const handleResize = () => {
      setStep(window.screen.width > 500 ? 5.36 : 6.0266);
    };
    // Set initial value
    handleResize();
    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stepunit = screenWidth > 500 ? "vh" : "vw";

  const setCookie = (name: any, value: any, days: any) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  };

  const getCookie = (name: any) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const popped = parts.pop();
      return popped?.split(";").shift();
    }
    return null;
  };

  // kursorin liikutus
  const moveCursorTo = (c: number, r: number) => {
    setCursor({ col: c, row: r });
    guess = "";
    setBoard(generatedBoard);
    setHand(generatedHand);
  };

  const handleCursorClick = () => {
    // This toggles 'r' to 'd' and 'd' back to 'r'
    if (guess.length === 0)
      setCursorDirection((prev) => (prev === true ? false : true));
  };

  const handleShuffle = () => {
    if (guess.length === 0) {
      const shuffled = generatedHand.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      generatedHand = shuffled;

      setHand(shuffled);
    }
  };

  function handleWriting(key: string) {
    setCorrect(boardTemplate);
    setRemove(boardTemplate);

    if (guess.length === 0) {
      oguessPointer = [cursor.row - 1, cursor.col - 1];
    }
    if (isalpha(board[cursor.row - 1][cursor.col - 1])) {
      if (isalpha(generatedBoard[cursor.row - 1][cursor.col - 1])) {
        guess += board[cursor.row - 1][cursor.col - 1];
        const copy = board.map((r) => r.slice());
        setBoard(copy);
        // liikuta cursoria kirjiamen jälkeen
        setCursor((prev) => {
          let newCol = prev.col;
          let newRow = prev.row;
          if (cursorDirection && newCol < 15) newCol++;
          if (!cursorDirection && newRow < 15) newRow++;
          return { col: newCol, row: newRow };
        });
      }
    } else if (hand.includes(key)) {
      //Poistetaan kädestä kirjotettu kirjain

      var handcopy = hand.slice();
      handcopy[handcopy.indexOf(key)] = "0";
      setHand(handcopy);

      guess += key;
      const copy = board.map((r) => r.slice());
      copy[cursor.row - 1][cursor.col - 1] = key;
      setBoard(copy);
      // liikuta cursoria kirjiamen jälkeen
      setCursor((prev) => {
        let newCol = prev.col;
        let newRow = prev.row;
        if (cursorDirection && newCol < 15) newCol++;
        if (!cursorDirection && newRow < 15) newRow++;
        return { col: newCol, row: newRow };
      });
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const allowedLetters = "abcdefghijklmnoprstuvwyäö".split("");

      // NUOLET
      if (e.key === "ArrowUp") {
        setCursor((prev) => ({ ...prev, row: Math.max(1, prev.row - 1) }));
        guess = "";
        setBoard(generatedBoard);
        setHand(generatedHand);
      }
      if (e.key === "ArrowDown") {
        setCursor((prev) => ({ ...prev, row: Math.min(15, prev.row + 1) }));
        guess = "";
        setBoard(generatedBoard);
        setHand(generatedHand);
      }
      if (e.key === "ArrowLeft") {
        setCursor((prev) => ({ ...prev, col: Math.max(1, prev.col - 1) }));
        guess = "";
        setBoard(generatedBoard);
        setHand(generatedHand);
      }
      if (e.key === "ArrowRight") {
        setCursor((prev) => ({ ...prev, col: Math.min(15, prev.col + 1) }));
        guess = "";
        setBoard(generatedBoard);
        setHand(generatedHand);
      }

      // TAB
      if (e.key === "Tab") {
        e.preventDefault();
        if (guess.length === 0) {
          setCursorDirection((prev) => !prev);
        }
      }

      // Backspace
      if (key === "backspace" && guess.length > 0) {
        const copy = board.map((r) => r.slice());

        var col = cursor.col;
        var row = cursor.row;
        if (cursorDirection) {
          if (col === 15 && isalpha(board[cursor.row - 1][col - 1])) {
            col += 1;
          }
        } else {
          if (row === 15 && isalpha(board[cursor.row - 1][col - 1])) {
            row += 1;
          }
        }

        if (cursorDirection === true) {
          if (
            isalpha(board[row - 1][col - 2]) &&
            !isalpha(generatedBoard[row - 1][col - 2])
          ) {
            //Lisätään käteen kirjain
            var handcopy = hand.slice();
            for (var i = generatedHand.length - 1; i >= 0; i--) {
              if (
                handcopy[i] == "0" &&
                generatedHand[i] == guess[guess.length - 1]
              ) {
                handcopy[i] = guess[guess.length - 1];
                break;
              }
            }
            setHand(handcopy);
          }

          copy[row - 1][col - 2] = generatedBoard[row - 1][col - 2];
        } else {
          if (
            isalpha(board[row - 2][col - 1]) &&
            !isalpha(generatedBoard[row - 2][col - 1])
          ) {
            //Lisätään käteen kirjain
            var handcopy = hand.slice();
            for (var i = generatedHand.length - 1; i >= 0; i--) {
              if (
                handcopy[i] == "0" &&
                generatedHand[i] == guess[guess.length - 1]
              ) {
                handcopy[i] = guess[guess.length - 1];
                break;
              }
            }
            setHand(handcopy);
          }

          copy[row - 2][col - 1] = generatedBoard[row - 2][col - 1];
        }

        guess = guess.slice(0, -1);

        setCursor(() => {
          let newCol = col;
          let newRow = row;
          if (cursorDirection === true) newCol--;
          if (cursorDirection === false) newRow--;
          return { col: newCol, row: newRow };
        });

        setBoard(copy);
      }

      // ENTER
      if (key === "enter" && guess.length > 0) {
        handleEnter();
      }

      // kirjoitus
      if (allowedLetters.includes(key)) {
        handleWriting(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cursor, cursorDirection, hand]); // IMPORTANT: Added cursor and direction here

  const delay = (ms: number | undefined) =>
    new Promise((res) => setTimeout(res, ms));
  const resetCorrect = async () => {
    await delay(1500);
    setCorrect(boardTemplate);
  };

  const resetRemove = async () => {
    await delay(1500);
    setRemove(boardTemplate);
  };

  //MEIKÄMANDARIININ KOODIMOODI

  useEffect(() => {
    fetch("/sanalista.txt")
      .then((res) => res.text())
      .then((text) => {
        // Split by line, filter out empty lines

        setWords(
          text
            .split("\n")
            .map((w) => w.trim())
            .filter(Boolean)
        );
      });
  }, []);

  useEffect(() => {
    if (dictionary.length > 0) {
      // run asynchronously so UI can update (hide side panel) before heavy compute
      setTimeout(() => generateBoard(), 0);
    }
  }, [dictionary.length]);

  useEffect(() => {
    if (dictionary.length > 0) {
      // defer generation to allow DOM paint (so panel can hide immediately)
      setTimeout(() => generateBoard(), 0);
    }
  }, [seed]);

  function getRandomInt(min: number, max: number) {
    /*
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
    */
    return rand(min, max);
  }

  function SeedRandom(seed: number, state2: number) {
    var mod1 = 4294967087;
    var mul1 = 65539;
    var mod2 = 4294965887;
    var mul2 = 65537;
    if (typeof seed != "number") {
      seed = +new Date();
    }
    if (typeof state2 != "number") {
      state2 = seed;
    }
    seed = (seed % (mod1 - 1)) + 1;
    state2 = (state2 % (mod2 - 1)) + 1;
    function random(min: number, max: number) {
      var limit = max - min;
      seed = (seed * mul1) % mod1;
      state2 = (state2 * mul2) % mod2;
      if (
        seed < limit &&
        state2 < limit &&
        seed < mod1 % limit &&
        state2 < mod2 % limit
      ) {
        return random(min, max);
      }
      return min + ((seed + state2) % limit);
    }
    return random;
  }

  function getLetter(b: string[][] = board, position: number[]) {
    return b[position[0]][position[1]];
  }
  function getRandomIndex(word: string, letter: string) {
    var indices = word
      .split("")
      .map((c, i) => (c === letter ? i : -1))
      .filter((i) => i !== -1);
    return indices[getRandomInt(0, indices.length)];
  }
  function getRandomPos(b: string[][]) {
    var tiles = b
      .map((row, i) => row.map((tile, j) => ({ tile, i, j })))
      .flat()
      .filter((t) => isalpha(t.tile));
    if (tiles.length > 0) {
      var tile = tiles[getRandomInt(0, tiles.length - 1)];
      return [tile["i"], tile["j"]];
    }
    return [-1, -1];
  }
  function isalpha(str: string) {
    if (!(str == null)) {
      return str.length == 1 ? /[a-z|ä|ö]/.test(str) : false;
    } else {
      return false;
    }
  }
  function validateBoard(board: string[][]) {
    for (var i = 0; i < board.length; i++) {
      var buffer = "";
      for (var j = 0; j < board[i].length; j++) {
        if (isalpha(board[i][j])) {
          buffer += board[i][j];
        } else if (buffer.length > 1) {
          if (!dictionarySet.has(buffer)) {
            return false;
          }
          buffer = "";
        } else {
          buffer = "";
        }
      }
      if (buffer.length > 1) {
        if (!dictionarySet.has(buffer)) {
          return false;
        }
      }
    }

    for (var j = 0; j < board.length; j++) {
      buffer = "";
      for (var i = 0; i < board[j].length; i++) {
        if (isalpha(board[i][j])) {
          buffer += board[i][j];
        } else if (buffer.length > 1) {
          if (!dictionarySet.has(buffer)) {
            return false;
          }
          buffer = "";
        } else {
          buffer = "";
        }
      }
      if (buffer.length > 1) {
        if (!dictionarySet.has(buffer)) {
          return false;
        }
      }
    }
    return true;
  }

  function getScore(
    word: string,
    position: number[],
    board: string[][],
    isHorizontal: boolean
  ) {
    var score = 0;
    var joinScore = 0;
    var adjacentScore = 0;
    var multiplier = 1;
    var used = 0;

    var boardCopy = board.map((row) => row.slice());

    //Tarkista sopiiko sana ja että kädessä on kirjaimet
    for (var i = 0; i < word.length; i++) {
      var x = isHorizontal ? position[0] : position[0] + i;
      var y = isHorizontal ? position[1] + i : position[1];

      //Lisätään samalla sanaa pöydän kopioon ja lasketaan pisteet
      // Katsotaan sivuaako kirjain vanhaa sanaa

      //Lisätään laatta joten kerätään sivuavien sanojen pisteet
      if (!isalpha(boardCopy[x][y])) {
        used += 1;

        boardCopy[x][y] = word[i];

        if (isHorizontal) {
          //Sana sivuaa toinen sana
          if (
            isalpha(boardCopy[x - 1]?.[y]) ||
            isalpha(boardCopy[x + 1]?.[y])
          ) {
            var adjacentWord = getWord([x, y], !isHorizontal, boardCopy);
            var [ax, ay] = getWordStartPos([x, y], !isHorizontal, boardCopy);

            //Käydään sivuava sana läpi
            var singleAdjacent = 0;
            var mult = 1;
            for (let k = 0; k < adjacentWord.length; k++) {
              const letter = adjacentWord[k];
              // Use original board's tile modifier values
              const tile = generatedBoard[ax + k]?.[ay];
              if (tile === "1") {
                mult *= 3;
                singleAdjacent += LETTER_SCORES[letter] || 0;
              } else if (tile === "2") {
                mult *= 2;
                singleAdjacent += LETTER_SCORES[letter] || 0;
              } else if (tile === "3") {
                singleAdjacent += (LETTER_SCORES[letter] || 0) * 3;
              } else if (tile === "4") {
                singleAdjacent += (LETTER_SCORES[letter] || 0) * 2;
              } else {
                singleAdjacent += LETTER_SCORES[letter] || 0;
              }
            }

            adjacentScore += singleAdjacent * mult;
          }
        } else {
          if (
            isalpha(boardCopy[x]?.[y - 1]) ||
            isalpha(boardCopy[x]?.[y + 1])
          ) {
            var adjacentWord = getWord([x, y], !isHorizontal, boardCopy);
            var [ax, ay] = getWordStartPos([x, y], !isHorizontal, boardCopy);

            //Käydään sivuava sana läpi
            var singleAdjacent = 0;
            var mult = 1;
            for (let k = 0; k < adjacentWord.length; k++) {
              const letter = adjacentWord[k];
              const tile = generatedBoard[ax]?.[ay + k];
              if (tile === "1") {
                mult *= 3;
                singleAdjacent += LETTER_SCORES[letter] || 0;
              } else if (tile === "2") {
                mult *= 2;
                singleAdjacent += LETTER_SCORES[letter] || 0;
              } else if (tile === "3") {
                singleAdjacent += (LETTER_SCORES[letter] || 0) * 3;
              } else if (tile === "4") {
                singleAdjacent += (LETTER_SCORES[letter] || 0) * 2;
              } else {
                singleAdjacent += LETTER_SCORES[letter] || 0;
              }
            }
            adjacentScore += singleAdjacent * mult;
          }
        }
      }

      // Use original board's tile modifier values
      const tile = generatedBoard[x]?.[y];
      if (tile === "1") {
        multiplier *= 3;
        score += LETTER_SCORES[word[i]] || 0;
      } else if (tile === "2") {
        multiplier *= 2;
        score += LETTER_SCORES[word[i]] || 0;
      } else if (tile === "3") {
        score += (LETTER_SCORES[word[i]] || 0) * 3;
      } else if (tile === "4") {
        score += (LETTER_SCORES[word[i]] || 0) * 2;
      } else {
        score += LETTER_SCORES[word[i]] || 0;
      }
    }

    //Pistelaskua varten katsotaan alku ja loppupää
    if (isHorizontal && position[1] - 1 >= 0) {
      if (isalpha(board[position[0]][position[1] - 1])) {
        var adjacentWord = getWord(
          [position[0], position[1] - 1],
          isHorizontal,
          generatedBoard
        );
        for (let k = 0; k < adjacentWord.length; k++) {
          joinScore += LETTER_SCORES[adjacentWord[k]] || 0;
        }
      }
    } else if (!isHorizontal && position[0] - 1 >= 0) {
      if (isalpha(board[position[0] - 1][position[1]])) {
        var adjacentWord = getWord(
          [position[0] - 1, position[1]],
          isHorizontal,
          generatedBoard
        );
        for (let k = 0; k < adjacentWord.length; k++) {
          joinScore += LETTER_SCORES[adjacentWord[k]] || 0;
        }
      }
    }
    score += joinScore;
    score *= multiplier;
    score += adjacentScore;
    if (used == 7) {
      score += 50;
    }
    if (used == 0) {
      score = 0;
    }

    return score;
  }

  function validateWord(
    word: string,
    position: number[],
    board: string[][],
    handt: string[],
    isHorizontal: boolean
  ) {
    var boardCopy = board.map((row) => row.slice());

    //Tarkista mahtuuko sana
    if (isHorizontal) {
      if (position[1] < 0 || position[1] + word.length - 1 > 14) {
        return 0;
      }
    } else {
      if (position[0] < 0 || position[0] + word.length - 1 > 14) {
        return 0;
      }
    }

    const handCounts: Record<string, number> = {};
    for (const c of handt) handCounts[c] = (handCounts[c] || 0) + 1;
    var touching = false;

    //Tarkista sopiiko sana ja että kädessä on kirjaimet
    for (var i = 0; i < word.length; i++) {
      var x = isHorizontal ? position[0] : position[0] + i;
      var y = isHorizontal ? position[1] + i : position[1];

      if (isalpha(board[x][y]) && board[x][y] !== word[i]) {
        return 0;
      }

      //Lisätään samalla sanaa pöydän kopioon ja lasketaan pisteet
      // Katsotaan sivuaako kirjain vanhaa sanaa

      //Lisätään laatta joten kerätään sivuavien sanojen pisteet
      if (!isalpha(boardCopy[x][y])) {
        // consume from handCounts
        if (handCounts[word[i]] > 0) {
          handCounts[word[i]]--;
        } else {
          return 0;
        }

        //Käytetään kädestä kirjain

        boardCopy[x][y] = word[i];

        if (isHorizontal) {
          if (
            isalpha(boardCopy[x - 1]?.[y]) ||
            isalpha(boardCopy[x + 1]?.[y])
          ) {
            touching = true;
          }
        } else {
          if (
            isalpha(boardCopy[x]?.[y - 1]) ||
            isalpha(boardCopy[x]?.[y + 1])
          ) {
            touching = true;
          }
        }
      } else {
        //Ei lisätä laattaa
        touching = true;
      }
    }

    if (!touching) {
      return 0;
    }

    //Tarkista kelpaako pöytä
    if (!validateBoard(boardCopy)) {
      return 0;
    }

    //Ei hyväksyt jos sana jatkaa olemassa olevaa sanaa väärin
    if (getWord(position, isHorizontal, boardCopy) !== word) {
      return 0;
    }

    return getScore(word, position, board, isHorizontal);
  }

  function columnToString(board: string[][], column: number) {
    return board
      .map((row) => row[column])
      .filter((t) => isalpha(t))
      .join("");
  }

  function rowToString(board: string[][], row: number) {
    return board[row].filter((t) => isalpha(t)).join("");
  }

  function contains(word: string, letters: string) {
    return [...word].every(
      (l) =>
        letters.includes(l) &&
        word.split(l).length - 1 <= letters.split(l).length - 1
    );
  }

  function wordsFromLetters(letters: string) {
    return dictionary.filter((word) => contains(word, letters));
  }
  /*
  function generateBoard() {
    if (!generating) {
      generating = true;

      rand = SeedRandom(seedNumber, 1000);

      if (seed !== getCookie("seed")) {
        //Lauta on uusi
        setCookie("solutions", "", 7);
      }

      var cookieGuess = getCookie("solutions")?.split(",");

      setCookie("seed", seedNumber, 7);

      guess = "";
      setHintVis("");

      console.log("Generoidaan siemenellä " + seedNumber);

      var count = getRandomInt(3, 8);
      //var count = 1;

      var position = [7, 7];

      var b = boardTemplate;
      var t = 1000;
      var first = true;
      var mahu = 0;
      var sovi = 0;
      var kelpaa = 0;
      var r = 0;

      var placedWords: any[] = [];
      const letter_counts = {
        a: 10,
        b: 1,
        c: 1,
        d: 1,
        e: 8,
        f: 1,
        g: 1,
        h: 2,
        i: 10,
        j: 2,
        k: 5,
        l: 5,
        m: 3,
        n: 9,
        o: 5,
        p: 2,
        r: 2,
        s: 7,
        t: 9,
        u: 4,
        v: 2,
        w: 1,
        y: 2,
        ä: 5,
        ö: 1,
      } as const;
      type Letter = keyof typeof letter_counts;

      var bag: string[] = [];
      for (const letter in letter_counts) {
        for (let i = 0; i < letter_counts[letter as Letter]; i++) {
          bag.push(letter);
        }
      }
      var handt: string[] = [];
      for (let i = 0; i < 7; i++) {
        handt.push(bag.splice(getRandomInt(0, bag.length - 1), 1)[0]);
      }

      //test
      //handt = ["ö", "s", "ö", "n", "e", "ö"];
      setHand(handt);
      generatedHand = handt;

      console.log("Alku: " + bag.join(""));

      while (count > 0 && t-- > 0) {
        var copy = b.map((row) => row.slice());
        var word = "";
        var offset = 0;
        if (!first) {
          position = getRandomPos(copy);
        }
        var letter = getLetter(copy, position);

        //Valitse sana
        if (first) {
          var s = dictionary.filter(
            (w) => w.length <= 8 && contains(w, bag.join(""))
          );
          if (s.length === 0) {
            break;
          }
          word = s[rand(0, s.length)];
          offset = getRandomInt(0, word.length - 1);
        } else {
          try {
            var s = dictionary.filter(
              (w) => w.length <= 8 && contains(w, bag.join(""))
            );
            if (s.length === 0) {
              console.log("Pussista ei voi keksiä sanoja", bag.join(""));
              break;
            }
            s = s.filter((w) => w.includes(letter));
            word = s[rand(0, s.length)];
            offset = getRandomIndex(word, letter);
          } catch (e) {
            r++;
            continue;
          }
        }

        //Valitse paikka
        var isHorizonal = rand(0, 100) < 50;

        if (isHorizonal) {
          if (
            position[1] - offset < 0 ||
            position[1] - offset + word.length > 15
          ) {
            mahu++;
            continue;
          }
        } else {
          if (
            position[0] - offset < 0 ||
            position[0] - offset + word.length > 15
          ) {
            mahu++;
            continue;
          }
        }

        //Tarkista paikan vapaus
        var flag = false;
        for (var i = 0; i < word.length; i++) {
          var x = isHorizonal ? position[0] : position[0] + i - offset;
          var y = isHorizonal ? position[1] + i - offset : position[1];
          if (isalpha(copy[x][y]) && copy[x][y] !== letter) {
            flag = true;
            break;
          }
        }
        if (flag) {
          sovi++;
          continue;
        }

        //Aseta sana
        for (var i = 0; i < word.length; i++) {
          var x = isHorizonal ? position[0] : position[0] + i - offset;
          var y = isHorizonal ? position[1] + i - offset : position[1];
          copy[x][y] = word[i];
        }
        if (!validateBoard(copy)) {
          kelpaa++;

          continue;
        }
        if (first) {
          first = false;
        }

        var x = isHorizonal ? position[0] : position[0] - offset;
        var y = isHorizonal ? position[1] - offset : position[1];
        placedWords.push([word, [x, y]]);
        for (var i = 0; i < word.length; i++) {
          bag.splice(bag.indexOf(word[i]), 1);
        }
        count--;
        t -= 1;
        b = copy.map((row) => row.slice());
      }

      //test
      //b = test;
      generatedBoard = b.map((r) => r.slice());
      setBoard(b);

      // Find possible words - optimized
      const solutiones: any[] = [];
      const handStr = handt.join("");

      maxScore = 0;
      maxWord = 0;

      var oldGuessed: any = [];
      var oldScore = 0;

      for (let i = 0; i < b.length; i++) {
        const rowStr = rowToString(b, i);

        const combinedRow = rowStr + handStr;

        wordsFromLetters(combinedRow).forEach((word) => {
          for (let j = 0; j < b[i].length; j++) {
            const candScore = validateWord(word, [i, j], b, handt, true);

            if (candScore !== 0) {
              solutiones.push([
                word,
                [i, j],
                candScore,
                true,
                cookieGuess?.includes(maxWord.toString()) ? true : false,
              ]);
              if (cookieGuess?.includes(maxWord.toString())) {
                oldGuessed.push([word, [i, j], true]);
                oldScore += candScore;
              }
              maxScore += candScore;
              maxWord += 1;
            }
          }
        });

        const colStr = columnToString(b, i);
        const combinedCol = colStr + handStr;
        wordsFromLetters(combinedCol).forEach((word) => {
          for (let j = 0; j < b.length; j++) {
            const candScore = validateWord(word, [j, i], b, handt, false);
            if (candScore !== 0) {
              solutiones.push([
                word,
                [j, i],
                candScore,
                false,
                cookieGuess?.includes(maxWord.toString()) ? true : false,
              ]);
              if (cookieGuess?.includes(maxWord.toString())) {
                oldGuessed.push([word, [j, i], false]);
                oldScore += candScore;
              }
              maxScore += candScore;
              maxWord += 1;
            }
          }
        });
      }
      setGuessed(oldGuessed);
      setTotalScore(oldScore);

      setSolutions(solutiones);

      console.log("Generoitu");
      generating = false;
    }
  }*/
  function generateBoard() {
    if (generating) return;

    generating = true;
    rand = SeedRandom(seedNumber, 1000);

    // Handle cookies
    if (seed !== getCookie("seed")) {
      setCookie("solutions", "", 7);
    }
    const cookieGuess = getCookie("solutions")?.split(",") || [];
    setCookie("seed", seedNumber, 7);

    guess = "";
    setHintVis("");

    console.log("Generoidaan siemenellä " + seedNumber);

    // Initialize letter bag
    const letter_counts = {
      a: 10,
      b: 1,
      c: 1,
      d: 1,
      e: 8,
      f: 1,
      g: 1,
      h: 2,
      i: 10,
      j: 2,
      k: 5,
      l: 5,
      m: 3,
      n: 9,
      o: 5,
      p: 2,
      r: 2,
      s: 7,
      t: 9,
      u: 4,
      v: 2,
      w: 1,
      y: 2,
      ä: 5,
      ö: 1,
    } as const;
    type Letter = keyof typeof letter_counts;

    const bag: string[] = [];
    for (const letter in letter_counts) {
      for (let i = 0; i < letter_counts[letter as Letter]; i++) {
        bag.push(letter);
      }
    }

    // Draw hand
    const handt: string[] = [];
    for (let i = 0; i < 7; i++) {
      handt.push(bag.splice(getRandomInt(0, bag.length - 1), 1)[0]);
    }
    setHand(handt);
    generatedHand = handt;

    // Pre-filter and sort dictionary
    const bagStr = bag.join("");
    const availableWords = dictionary
      .filter((w) => w.length >= 2 && w.length <= 8 && contains(w, bagStr))
      .sort((a, b) => b.length - a.length); // Prefer longer words

    if (availableWords.length === 0) {
      console.log("Ei sanoja käytettävissä");
      generating = false;
      return;
    }

    // NEW ALGORITHM: Constraint-based placement
    let b = boardTemplate.map((row) => row.slice());
    const targetWords = getRandomInt(3, 8);
    const placedWords: Array<[string, [number, number], boolean]> = [];
    const bagLetters = [...bag];

    // Helper: Find all valid placements for a word
    function findValidPlacements(
      word: string,
      board: string[][]
    ): Array<{ pos: [number, number]; horizontal: boolean; anchor?: string }> {
      const placements: Array<{
        pos: [number, number];
        horizontal: boolean;
        anchor?: string;
      }> = [];

      // If board is empty, place first word in center
      if (placedWords.length === 0) {
        const centerStart = Math.floor((15 - word.length) / 2);
        placements.push({ pos: [7, centerStart], horizontal: true });
        placements.push({ pos: [centerStart, 7], horizontal: false });
        return placements;
      }

      // Find positions where word can connect to existing letters
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
          const cell = board[i][j];
          if (!isalpha(cell)) continue;

          // Try each position in word that matches this cell
          for (let k = 0; k < word.length; k++) {
            if (word[k] !== cell) continue;

            // Try horizontal placement
            const hStart = j - k;
            if (hStart >= 0 && hStart + word.length <= 15) {
              if (canPlaceWord(word, [i, hStart], true, board)) {
                placements.push({
                  pos: [i, hStart],
                  horizontal: true,
                  anchor: cell,
                });
              }
            }

            // Try vertical placement
            const vStart = i - k;
            if (vStart >= 0 && vStart + word.length <= 15) {
              if (canPlaceWord(word, [vStart, j], false, board)) {
                placements.push({
                  pos: [vStart, j],
                  horizontal: false,
                  anchor: cell,
                });
              }
            }
          }
        }
      }

      return placements;
    }

    // Helper: Check if word can be placed
    function canPlaceWord(
      word: string,
      pos: [number, number],
      horizontal: boolean,
      board: string[][]
    ): boolean {
      const [startX, startY] = pos;
      let hasConnection = placedWords.length === 0;

      for (let i = 0; i < word.length; i++) {
        const x = horizontal ? startX : startX + i;
        const y = horizontal ? startY + i : startY;
        const cell = board[x][y];

        // Check if cell conflicts
        if (isalpha(cell)) {
          if (cell !== word[i]) return false;
          hasConnection = true;
        } else {
          // Check adjacent cells for invalid crossings
          const adjacents = horizontal
            ? [
                [x - 1, y],
                [x + 1, y],
              ]
            : [
                [x, y - 1],
                [x, y + 1],
              ];

          for (const [ax, ay] of adjacents) {
            if (ax >= 0 && ax < 15 && ay >= 0 && ay < 15) {
              if (isalpha(board[ax][ay])) {
                // This would create an unintended crossing
                return false;
              }
            }
          }
        }
      }

      // Check before/after positions are clear
      if (horizontal) {
        if (startY > 0 && isalpha(board[startX][startY - 1])) return false;
        if (
          startY + word.length < 15 &&
          isalpha(board[startX][startY + word.length])
        )
          return false;
      } else {
        if (startX > 0 && isalpha(board[startX - 1][startY])) return false;
        if (
          startX + word.length < 15 &&
          isalpha(board[startX + word.length][startY])
        )
          return false;
      }

      return hasConnection;
    }

    function shuffle(array: any) {
      let currentIndex = array.length;

      // While there remain elements to shuffle...
      while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = getRandomInt(0, currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
    }

    // Helper: Count letters needed from bag
    function lettersFromBag(
      word: string,
      pos: [number, number],
      horizontal: boolean,
      board: string[][]
    ): string[] {
      const needed: string[] = [];
      const [startX, startY] = pos;

      for (let i = 0; i < word.length; i++) {
        const x = horizontal ? startX : startX + i;
        const y = horizontal ? startY + i : startY;

        if (!isalpha(board[x][y])) {
          needed.push(word[i]);
        }
      }
      return needed;
    }

    // Main placement loop
    let attempts = 0;
    const maxAttempts = 200;

    while (placedWords.length < targetWords && attempts < maxAttempts) {
      attempts++;

      // Filter words by available letters
      const currentBagStr = bagLetters.join("");
      const candidates = availableWords.filter((w) =>
        contains(w, currentBagStr)
      );

      if (candidates.length === 0) break;

      // Try words in order (longest first)
      let placed = false;
      shuffle(candidates);
      for (const word of candidates) {
        const placements = findValidPlacements(word, b);

        if (placements.length === 0) continue;

        // Pick random valid placement
        const placement = placements[rand(0, placements.length)];
        const needed = lettersFromBag(
          word,
          placement.pos,
          placement.horizontal,
          b
        );

        // Check if we have the letters
        const tempBag = [...bagLetters];
        let canAfford = true;
        for (const letter of needed) {
          const idx = tempBag.indexOf(letter);
          if (idx === -1) {
            canAfford = false;
            break;
          }
          tempBag.splice(idx, 1);
        }

        if (!canAfford) continue;

        // Place the word
        const [startX, startY] = placement.pos;
        for (let i = 0; i < word.length; i++) {
          const x = placement.horizontal ? startX : startX + i;
          const y = placement.horizontal ? startY + i : startY;
          b[x][y] = word[i];
        }

        // Remove letters from bag
        for (const letter of needed) {
          const idx = bagLetters.indexOf(letter);
          bagLetters.splice(idx, 1);
        }

        placedWords.push([word, placement.pos, placement.horizontal]);
        placed = true;
        break;
      }

      if (!placed) {
        // No word could be placed, try backing off
        attempts += 10;
      }
    }

    generatedBoard = b.map((r) => r.slice());
    setBoard(b);

    // Find solutions - optimized
    const solutionSet = new Set<string>();
    const solutions: Array<
      [string, [number, number], number, boolean, boolean]
    > = [];
    const handStr = handt.join("");

    maxScore = 0;
    maxWord = 0;
    const oldGuessed: Array<[string, [number, number], boolean]> = [];
    let oldScore = 0;

    for (let i = 0; i < b.length; i++) {
      // Process row
      const rowStr = rowToString(b, i);
      const rowWords = wordsFromLetters(rowStr + handStr);

      for (const word of rowWords) {
        for (let j = 0; j < b[i].length; j++) {
          const key = `${word}-${i}-${j}-h`;
          if (solutionSet.has(key)) continue;

          const score = validateWord(word, [i, j], b, handt, true);
          if (score !== 0) {
            solutionSet.add(key);
            const isGuessed = cookieGuess.includes(maxWord.toString());
            solutions.push([word, [i, j], score, true, isGuessed]);

            if (isGuessed) {
              oldGuessed.push([word, [i, j], true]);
              oldScore += score;
            }

            maxScore += score;
            maxWord++;
          }
        }
      }

      // Process column
      const colStr = columnToString(b, i);
      const colWords = wordsFromLetters(colStr + handStr);

      for (const word of colWords) {
        for (let j = 0; j < b.length; j++) {
          const key = `${word}-${j}-${i}-v`;
          if (solutionSet.has(key)) continue;

          const score = validateWord(word, [j, i], b, handt, false);
          if (score !== 0) {
            solutionSet.add(key);
            const isGuessed = cookieGuess.includes(maxWord.toString());
            solutions.push([word, [j, i], score, false, isGuessed]);

            if (isGuessed) {
              oldGuessed.push([word, [j, i], false]);
              oldScore += score;
            }

            maxScore += score;
            maxWord++;
          }
        }
      }
    }

    setGuessed(oldGuessed);
    setTotalScore(oldScore);
    setSolutions(solutions);

    console.log(`Generoitu: ${placedWords.length} sanaa, ${attempts} yritystä`);
    generating = false;
  }

  function getWord(pos: number[], isHorizontal: boolean, board: string[][]) {
    //Etsi sana paikassa pos
    var word = "";
    var x = pos[0];
    var y = pos[1];
    if (!isalpha(board[x][y])) {
      return word;
    }

    if (isHorizontal) {
      for (var i = y; i < board.length; i++) {
        if (isalpha(board[x][i])) {
          word += board[x][i];
        } else {
          break;
        }
      }

      for (var i = y - 1; i >= 0; i--) {
        if (isalpha(board[x][i])) {
          word = board[x][i] + word;
        } else {
          break;
        }
      }
    } else {
      for (var i = x; i < board.length; i++) {
        if (isalpha(board[i][y])) {
          word += board[i][y];
        } else {
          break;
        }
      }

      for (var i = x - 1; i >= 0; i--) {
        if (isalpha(board[i][y])) {
          word = board[i][y] + word;
        } else {
          break;
        }
      }
    }
    return word;
  }

  function getWordStartPos(
    startPos: number[],
    isHorizonal: boolean,
    board: string[][]
  ) {
    var x = startPos[0];
    var y = startPos[1];
    if (!isalpha(board[x]?.[y])) {
      return [-1, -1];
    }

    if (isHorizonal) {
      while (isalpha(board[x]?.[y - 1])) {
        y -= 1;
      }
    } else {
      while (isalpha(board[x - 1]?.[y])) {
        x -= 1;
      }
    }

    return [x, y];
  }

  /*
  function handleBackspace() {
    // Backspace
    if (guess.length > 0) {
      const copy = board.map((r) => r.slice());

      var col = cursor.col;
      var row = cursor.row;
      if (cursorDirection) {
        if (col === 15 && isalpha(board[cursor.row - 1][col - 1])) {
          col += 1;
        }
      } else {
        if (row === 15 && isalpha(board[cursor.row - 1][col - 1])) {
          row += 1;
        }
      }

      if (direction === "r") {
        if (
          isalpha(board[row - 1][col - 2]) &&
          !isalpha(generatedBoard[row - 1][col - 2])
        ) {
          //Lisätään käteen kirjain
          var handcopy = hand.slice();
          for (var i = generatedHand.length - 1; i >= 0; i--) {
            if (
              handcopy[i] == "0" &&
              generatedHand[i] == guess[guess.length - 1]
            ) {
              handcopy[i] = guess[guess.length - 1];
              break;
            }
          }
          setHand(handcopy);
        }

        copy[row - 1][col - 2] = generatedBoard[row - 1][col - 2];
      } else {
        if (isalpha(board[row - 2][col - 1])) {
          //Lisätään käteen kirjain
          var handcopy = hand.slice();
          for (var i = generatedHand.length - 1; i >= 0; i--) {
            if (
              handcopy[i] == "0" &&
              generatedHand[i] == guess[guess.length - 1]
            ) {
              handcopy[i] = guess[guess.length - 1];
            }
          }
          setHand(handcopy);
        }

        copy[row - 2][col - 1] = generatedBoard[row - 2][col - 1];
      }

      guess = guess.slice(0, -1);

      setCursor(() => {
        let newCol = col;
        let newRow = row;
        if (direction === "r") newCol--;
        if (direction === "d") newRow--;
        return { col: newCol, row: newRow };
      });

      setBoard(copy);
    }
  }*/

  function handleEnter() {
    const originalGuess = guess;
    let startX = oguessPointer[0];
    let startY = oguessPointer[1];
    const originalX = startX;
    const originalY = startY;
    let totalScore = 0;

    // Expand guess to include adjacent letters and find start position
    const expandedGuess = expandGuessWithAdjacentLetters(
      guess,
      startX,
      startY,
      cursorDirection,
      generatedBoard
    );

    guess = expandedGuess.word;
    startX = expandedGuess.x;
    startY = expandedGuess.y;

    // Initialize animation states
    const correctCells = correctAnimation.map((row) => row.slice());
    const removeCells = removeAnimation.map((row) => row.slice());
    const guessedWords = guessed.slice();
    const solutionList = solutions.slice();

    // Validate the main word
    const mainWordScore = validateWord(
      guess,
      [startX, startY],
      generatedBoard,
      generatedHand,
      cursorDirection
    );

    // Process the main word if valid
    if (mainWordScore > 0) {
      const wordResult = processWord(
        guess,
        startX,
        startY,
        cursorDirection,
        mainWordScore,
        guessedWords,
        solutionList,
        correctCells,
        removeCells,
        originalGuess,
        generatedBoard
      );

      totalScore += wordResult.score;

      // Process perpendicular words formed at each position in the original guess
      const perpendicularDirection = !cursorDirection;

      for (let i = 0; i < originalGuess.length; i++) {
        const checkX = cursorDirection ? originalX : originalX + i;
        const checkY = cursorDirection ? originalY + i : originalY;

        // Check if there's a perpendicular word at this position
        const perpendicularWord = getWord(
          [checkX, checkY],
          !cursorDirection,
          board
        );

        // Only process if the perpendicular word is longer than 1 letter
        if (perpendicularWord.length > 1) {
          const perpendicularResult = findWordStart(
            checkX,
            checkY,
            perpendicularDirection,
            generatedBoard
          );

          const perpendicularScore = validateWord(
            perpendicularWord,
            [perpendicularResult.x, perpendicularResult.y],
            generatedBoard,
            generatedHand,
            !cursorDirection
          );

          if (perpendicularScore > 0) {
            const wordResult = processWord(
              perpendicularWord,
              perpendicularResult.x,
              perpendicularResult.y,
              perpendicularDirection,
              perpendicularScore,
              guessedWords,
              solutionList,
              correctCells,
              removeCells,
              "",
              generatedBoard
            );

            totalScore += wordResult.score;
          }
        }
      }
    } else {
      // Main word is invalid - mark for removal animation and skip perpendicular word
      markInvalidWord(
        originalGuess,
        startX,
        startY,
        cursorDirection,
        removeCells,
        generatedBoard
      );
    }

    // Update state
    setCorrect(correctCells);
    setRemove(removeCells);
    setGuessed(guessedWords);
    setSolutions(solutionList);
    setTotalScore((prev) => prev + totalScore);

    resetCorrect();
    resetRemove();

    setCursor({
      col: oguessPointer[1] + 1,
      row: oguessPointer[0] + 1,
    });

    setBoard(generatedBoard);
    setHand(generatedHand);
    guess = "";
  }

  // Helper function: Expand guess with adjacent letters
  function expandGuessWithAdjacentLetters(
    guess: string,
    x: number,
    y: number,
    direction: boolean,
    board: string[][]
  ) {
    let word = guess;
    let startX = x;
    let startY = y;

    if (direction) {
      // Check for letters before
      if (isalpha(board[x]?.[y - 1])) {
        word = getWord([x, y - 1], true, board) + word;
        startY = findStartColumn(x, y, board);
      }
      // Check for letters after
      else if (isalpha(board[cursor.row - 1]?.[cursor.col - 1])) {
        word += getWord([cursor.row - 1, cursor.col - 1], true, board);
      }
    } else {
      // Check for letters above
      if (isalpha(board[x - 1]?.[y])) {
        word = getWord([x - 1, y], false, board) + word;
        startX = findStartRow(x, y, board);
      }
      // Check for letters below
      else if (isalpha(board[cursor.row - 1]?.[cursor.col - 1])) {
        word += getWord([cursor.row - 1, cursor.col - 1], false, board);
      }
    }

    return { word, x: startX, y: startY };
  }

  // Helper function: Find start column for horizontal word
  function findStartColumn(x: number, y: number, board: string[][]) {
    let col = y;
    while (col >= 1 && isalpha(board[x]?.[col - 1])) {
      col--;
    }
    return col;
  }

  // Helper function: Find start row for vertical word
  function findStartRow(x: number, y: number, board: string[][]) {
    let row = x;
    while (row >= 1 && isalpha(board[row - 1]?.[y])) {
      row--;
    }
    return row;
  }

  // Helper function: Find word start position
  function findWordStart(
    x: number,
    y: number,
    direction: boolean,
    board: string[][]
  ) {
    if (direction) {
      if (isalpha(board[x]?.[y - 1])) {
        return { x, y: findStartColumn(x, y, board) };
      }
    } else {
      if (isalpha(board[x - 1]?.[y])) {
        return { x: findStartRow(x, y, board), y };
      }
    }
    return { x, y };
  }

  // Helper function: Check if word was already guessed
  function isWordAlreadyGuessed(
    word: string,
    x: number,
    y: number,
    direction: boolean,
    guessedWords: any
  ) {
    return guessedWords.some(
      (g: any) =>
        g[0] === word && g[1][0] === x && g[1][1] === y && g[2] === direction
    );
  }

  // Helper function: Process valid word
  function processWord(
    word: string,
    x: number,
    y: number,
    direction: boolean,
    score: number,
    guessedWords: any,
    solutionList: any,
    correctCells: string[][],
    removeCells: string[][],
    originalGuess: string,
    board: string[][]
  ) {
    let earnedScore = 0;

    if (isWordAlreadyGuessed(word, x, y, direction, guessedWords)) {
      handleUsedWord();
      if (originalGuess !== "") {
        markInvalidWord(originalGuess, x, y, direction, removeCells, board);
      }
      return { score: 0 };
    }

    // Check if word is in solutions
    const solutionIndex = solutionList.findIndex(
      (sol: any) =>
        sol[0] === word &&
        sol[1][0] === x &&
        sol[1][1] === y &&
        sol[3] === direction
    );

    if (solutionIndex !== -1) {
      earnedScore = score;
      guessedWords.push([word, [x, y], direction]);
      setCookie("solutions", getCookie("solutions") + "," + solutionIndex, 7);
      solutionList[solutionIndex][4] = true;

      // Mark correct cells
      const isHorizontal = direction;
      for (let i = 0; i < word.length; i++) {
        if (isHorizontal) {
          correctCells[x][y + i] = word[i];
        } else {
          correctCells[x + i][y] = word[i];
        }
      }
    }

    return { score: earnedScore };
  }

  // Helper function: Mark invalid word for removal animation
  function markInvalidWord(
    word: string,
    x: number,
    y: number,
    direction: boolean,
    removeCells: string[][],
    board: string[][]
  ) {
    const isHorizontal = direction;

    for (let i = 0; i < word.length; i++) {
      if (isHorizontal) {
        if (!isalpha(board[x][y + i])) {
          removeCells[x][y + i] = word[i];
        }
      } else {
        if (!isalpha(board[x + i][y])) {
          removeCells[x + i][y] = word[i];
        }
      }
    }
  }

  function handleHandClick(tile: string, index: number) {
    // kirjoitus
    if (tile !== "0") {
      if (guess.length === 0) {
        oguessPointer = [cursor.row - 1, cursor.col - 1];
      }
      if (isalpha(board[cursor.row - 1][cursor.col - 1])) {
        if (isalpha(generatedBoard[cursor.row - 1][cursor.col - 1])) {
          guess += board[cursor.row - 1][cursor.col - 1];
          const copy = board.map((r) => r.slice());
          setBoard(copy);
          // liikuta cursoria kirjiamen jälkeen
          setCursor((prev) => {
            let newCol = prev.col;
            let newRow = prev.row;
            if (cursorDirection && newCol < 15) newCol++;
            if (!cursorDirection && newRow < 15) newRow++;
            return { col: newCol, row: newRow };
          });
        }
      } else if (hand.includes(tile)) {
        //Poistetaan kädestä kirjotettu kirjain
        var handcopy = hand.slice();
        handcopy[index] = "0";
        setHand(handcopy);

        guess += tile;
        const copy = board.map((r) => r.slice());
        copy[cursor.row - 1][cursor.col - 1] = tile;
        setBoard(copy);
        // liikuta cursoria kirjiamen jälkeen
        setCursor((prev) => {
          let newCol = prev.col;
          let newRow = prev.row;
          if (cursorDirection && newCol < 15) newCol++;
          if (!cursorDirection && newRow < 15) newRow++;
          return { col: newCol, row: newRow };
        });
      }
    } else if (isalpha(board[cursor.row - 1][cursor.col - 1])) {
      guess += board[cursor.row - 1][cursor.col - 1];
      const copy = board.map((r) => r.slice());
      setBoard(copy);
      // liikuta cursoria kirjiamen jälkeen
      setCursor((prev) => {
        let newCol = prev.col;
        let newRow = prev.row;
        if (cursorDirection && newCol < 15) newCol++;
        if (!cursorDirection && newRow < 15) newRow++;
        return { col: newCol, row: newRow };
      });
    }
  }

  useEffect(() => {
    onScoreChange?.(totalScore);
  }, [totalScore, onScoreChange]);

  useEffect(() => {
    onstatsChange?.([totalScore, maxScore, guessed.length, maxWord]);
  }, [totalScore, maxScore, maxWord, guessed.length, onstatsChange]);

  useEffect(() => {
    if (solutions.length > 0) {
      var s = solutions.filter((sol) => sol[4] === false);
      var h = s[getRandomInt(0, s.length)];
      hintDirection = h[3];
      hintPosition = [
        h[1],
        h[3] === true
          ? [h[1][0], h[1][1] + h[0].length - 1]
          : [h[1][0] + h[0].length - 1, h[1][1]],
      ];
      setHintVis(h[1]);
      removing = h[0];
      removeHint(h[0]);
    }
  }, [hint]);

  const removeHint = async (word: string) => {
    await delay(10000);
    if (removing === word) {
      setHintVis("");
    }
  };

  useEffect(() => {
    onSolutionsChange?.(solutions);
  }, [solutions, onSolutionsChange]);

  return (
    <div id="master-div">
      <div className={`popup-toast ${showPopup ? "show" : ""}`}>
        Ratkaisit tämän jo!
      </div>
      <div id="coords-x" className="coords-xy">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className={`coord-character-x ${
              guess.length === 0 && cursor.col === i + 1
                ? "coord-highlighted"
                : ""
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div id="coords-y" className="coords-xy">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className={`coord-character-y ${
              guess.length === 0 && cursor.row === i + 1
                ? "coord-highlighted"
                : ""
            }`}
          >
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      <div id="base-grid-container" style={{ position: "relative" }}>
        {TILE_STYLES.map((row, r) =>
          row.map((cellValue, c) => {
            const rowNum = r + 1;
            const colNum = c + 1;
            const coordKey = `${rowNum}-${colNum}`;

            const generatedLetter = board[r][c];
            const correctLetter = correctAnimation[r][c];
            const removeLetter = removeAnimation[r][c];

            const isLetterAlpha = /[a-z|ä|ö]/i.test(generatedLetter as string);
            const isCorrectAlpha = /[a-z|ä|ö]/i.test(correctLetter as string);
            const isRemoveAlpha = /[a-z|ä|ö]/i.test(removeLetter as string);

            const finalLetter = isLetterAlpha
              ? (generatedLetter as string)
              : null;
            const finalCorrect = isCorrectAlpha
              ? (correctLetter as string)
              : null;
            const finalRemove = isRemoveAlpha ? (removeLetter as string) : null;
            return (
              <div
                key={coordKey + finalLetter}
                className={`base-tile ${STYLE_MAP[cellValue]} ${
                  finalCorrect
                    ? "has-letter letter-disappears-animation"
                    : finalLetter
                    ? "has-letter letter-appears-animation"
                    : finalRemove
                    ? "has-letter letter-remove-animation"
                    : ""
                }`}
                onClick={() => moveCursorTo(colNum, rowNum)}
                style={{
                  backgroundImage:
                    finalLetter || finalCorrect || finalRemove
                      ? `url(/graphics/tiles/letters/${encodeURIComponent(
                          (finalLetter?.toUpperCase() ??
                            finalCorrect?.toUpperCase() ??
                            finalRemove?.toUpperCase()) ||
                            ""
                        )}.png)`
                      : undefined,
                  backgroundSize: "contain",
                }}
              >
                {/* Visual letters are handled by the backgroundImage style above */}
              </div>
            );
          })
        )}

        {/* Alkupää */}
        <div
          id="cursor"
          style={{
            transform: `translate(${
              (guess.length > 0 ? oguessPointer[1] : cursor.col - 1) * step +
              stepunit
            }, ${
              (guess.length > 0 ? oguessPointer[0] : cursor.row - 1) * step +
              stepunit
            })`,
            transition: "transform 0.02s ease-out",
            zIndex: 10,
          }}
        >
          <img
            src="/graphics/cursor_half.png"
            id="cursor-border"
            className={`cursor-inner ${
              cursorDirection ? "cursor-right" : "cursor-down"
            }`}
            alt=""
          />
        </div>

        {/* Karettti */}
        <div
          id="cursor"
          onClick={handleCursorClick}
          style={{
            transform: `translate(${(cursor.col - 1) * step + stepunit}, ${
              (cursor.row - 1) * step + stepunit
            })`,
            transition: "transform 0.02s ease-out",
            zIndex: 10,
          }}
        >
          <img
            src={
              guess.length > 0
                ? "/graphics/enter_tag.svg"
                : "/graphics/tab_tag.svg"
            }
            id="cursor-tag"
            className="cursor-inner"
            alt=""
            style={{
              top: `${
                guess.length > 0 && !cursorDirection
                  ? "5.75" + stepunit
                  : "-2.5" + stepunit
              }`,
            }}
          />
          <img
            src="/graphics/cursor_half_caretside.png"
            id="cursor-border"
            className={`cursor-inner ${
              cursorDirection ? "cursor-right" : "cursor-down"
            }`}
            alt=""
          />
          <img
            src="/graphics/cursor_icon.svg"
            id="cursor-key"
            className="cursor-inner"
            alt=""
          />
          <img
            src="/graphics/cursor_arrow.svg"
            id="cursor-arrow"
            className={`cursor-inner ${
              guess.length == 0 && cursorDirection
                ? "cursor-arrow-right"
                : "cursor-arrow-down"
            }`}
            alt=""
            style={{
              opacity: `${guess.length > 0 ? "0" : "100"}`,
            }}
          />
        </div>

        {/* Vinkki Alkupää */}
        <div
          id="cursor"
          className={
            hintVis !== ""
              ? "hint-visible tile-appear"
              : "hint-invisible tile-disappear"
          }
          style={{
            transform: `translate(${hintPosition[0][1] * step + stepunit}, ${
              hintPosition[0][0] * step + stepunit
            })`,
            transition: "transform 0.02s ease-out",
            zIndex: 10,
          }}
        >
          <img
            src="/graphics/cursor_half.png"
            id="cursor-border"
            className={`cursor-inner ${
              hintDirection ? "cursor-right" : "cursor-down"
            }`}
            alt=""
          />
        </div>

        {/* Vinkki Loppupää */}
        <div
          id="cursor"
          className={
            hintVis !== ""
              ? "hint-visible tile-appear"
              : "hint-invisible tile-disappear"
          }
          style={{
            transform: `translate(${hintPosition[1][1] * step + stepunit}, ${
              hintPosition[1][0] * step + stepunit
            })`,
            transition: "transform 0.02s ease-out",
            zIndex: 10,
          }}
        >
          <img
            src="/graphics/cursor_half_caretside.png"
            id="cursor-border"
            className={`cursor-inner ${
              hintDirection ? "cursor-right" : "cursor-down"
            }`}
            alt=""
          />
        </div>
      </div>

      <div
        id="hand-container"
        className={hand.length > 0 ? "hand-appear-animation" : "master"}
      >
        {/* Backspace nappi <div id="shuffle-button" onClick={handleBackspace}></div>*/}

        {hand.map((tile, i) => (
          <div
            key={i}
            className={`base-tile hand-tile ${
              tile.toUpperCase() ? "has-letter" : ""
            }`}
            style={{
              backgroundImage: tile.toUpperCase()
                ? `url(/graphics/tiles/letters/${encodeURIComponent(
                    tile.toUpperCase()
                  )}.png)`
                : undefined,
              backgroundSize: "contain",
              filter: "none",
            }}
            onClick={() => {
              handleHandClick(tile, i);
            }}
          >
            {/* Visual letters are handled by the backgroundImage style above */}
          </div>
        ))}
        <div id="shuffle-button" onClick={handleShuffle}></div>
      </div>
    </div>
  );
};

export default Board;
