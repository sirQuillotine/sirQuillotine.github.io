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
var currentHand: string[] = []; // Track the current hand state
var maxScore = 100;
var maxWord = 100;

var hintPosition = [
  [7, 4],
  [7, 9],
];
var hintDirection = "r";
var removing: any;

var generating = false;
var rand: (arg0: number, arg1: number) => any;

var seedNumber;

export type Solutions = [string, [number, number], number, "r" | "d", boolean];

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
  const [direction, setDirection] = useState("r"); // 'r' = oikealle (default),  'd' = alas
  const [placedLetters, setPlacedLetters] = useState<Record<string, string>>(
    {}
  );

  var seedNumber = parseFloat(seed);

  const step = 5.36; // laatta (4.96vh) + rako (0.4vh) = 5.36vh

  const setCookieFunction = (name: any, value: any, days: any) => {
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
    setHand(currentHand);
  };

  const handleCursorClick = () => {
    // This toggles 'r' to 'd' and 'd' back to 'r'
    setDirection((prev) => (prev === "r" ? "d" : "r"));
  };

  const handleShuffle = () => {
    if (guess.length === 0) {
      const shuffled = currentHand.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      currentHand = shuffled;
      setHand(shuffled);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const allowedLetters = "abcdefghijklmnoprstuvwyäö".split("");

      // NUOLET
      if (e.key === "ArrowUp") {
        setCursor((prev) => ({ ...prev, row: Math.max(1, prev.row - 1) }));
        guess = "";
        setBoard(generatedBoard);
        setHand(currentHand);
      }
      if (e.key === "ArrowDown") {
        setCursor((prev) => ({ ...prev, row: Math.min(15, prev.row + 1) }));
        guess = "";
        setBoard(generatedBoard);
        setHand(currentHand);
      }
      if (e.key === "ArrowLeft") {
        setCursor((prev) => ({ ...prev, col: Math.max(1, prev.col - 1) }));
        guess = "";
        setBoard(generatedBoard);
        setHand(currentHand);
      }
      if (e.key === "ArrowRight") {
        setCursor((prev) => ({ ...prev, col: Math.min(15, prev.col + 1) }));
        guess = "";
        setBoard(generatedBoard);
        setHand(currentHand);
      }

      // TAB
      if (e.key === "Tab") {
        console.log(rand(0, 10));
        if (guess.length === 0) {
          e.preventDefault();
          setDirection((prev) => (prev === "r" ? "d" : "r"));
        }
      }

      // Backspace
      if (key === "backspace" && guess.length > 0) {
        const copy = board.map((r) => r.slice());

        var col = cursor.col;
        if (col === 15 && isalpha(board[cursor.row - 1][col - 1])) {
          col += 1;
        }

        var row = cursor.row;
        if (row === 15 && isalpha(board[cursor.row - 1][col - 1])) {
          row += 1;
        }

        if (direction === "r") {
          if (isalpha(board[row - 1][col - 2])) {
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

        setCursor((prev) => {
          let newCol = col;
          let newRow = row;
          if (direction === "r") newCol--;
          if (direction === "d") newRow--;
          return { col: newCol, row: newRow };
        });

        setBoard(copy);
      }

      // ENTER
      if (key === "enter" && guess.length > 0) {
        if (isalpha(board[cursor.row - 1][cursor.col - 1])) {
          guess += board[cursor.row - 1][cursor.col - 1];
        }
        const wordScore = validateWord(
          guess,
          oguessPointer,
          generatedBoard,
          generatedHand,
          direction === "r" ? true : false
        );
        console.log(wordScore, guess);
        if (wordScore > 0) {
          var g = guessed.slice();

          var contains = false;
          for (var i = 0; i < g.length; i++) {
            if (
              g[i][0] === guess &&
              g[i][1][0] === oguessPointer[0] &&
              g[i][1][1] === oguessPointer[1] &&
              g[i][2] === direction
            ) {
              contains = true;
            }
          }

          if (!contains) {
            console.log("Sopii");
            console.log(solutions);
            g.push([guess, oguessPointer, direction]);
            var sol = solutions.slice();
            for (var i = 0; i < sol.length; i++) {
              if (
                sol[i][0] === guess &&
                sol[i][1][0] === oguessPointer[0] &&
                sol[i][1][1] === oguessPointer[1] &&
                sol[i][3] === direction
              ) {
                sol[i][4] = true;
              }
            }
            setGuessed(g);
            setSolutions(sol);
            // Total pisteet
            setTotalScore((prev) => {
              const newTotal = prev + wordScore;
              console.log(`Sanapisteet: ${wordScore}, Yhteensä: ${newTotal}`);
              return newTotal;
            });

            const copy = animationBoard.map((r) => r.slice());
            if (direction === "r") {
              for (var i = 0; i < guess.length; i++) {
                copy[oguessPointer[0]][oguessPointer[1] + i] = guess[i];
              }
            } else {
              for (var i = 0; i < guess.length; i++) {
                copy[oguessPointer[0] + i][oguessPointer[1]] = guess[i];
              }
            }
            setAnimationBoard(copy);
            removeAnimation();
          } else {
            console.log("Sana on jo käytetty");
          }
        } else {
          console.log("Ei sovi");
        }
        setBoard(generatedBoard);
        setHand(currentHand);
        guess = "";
      }

      // kirjoitus
      if (allowedLetters.includes(key)) {
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
              if (direction === "r" && newCol < 15) newCol++;
              if (direction === "d" && newRow < 15) newRow++;
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
            if (direction === "r" && newCol < 15) newCol++;
            if (direction === "d" && newRow < 15) newRow++;
            return { col: newCol, row: newRow };
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cursor, direction]); // IMPORTANT: Added cursor and direction here

  const delay = (ms: number | undefined) =>
    new Promise((res) => setTimeout(res, ms));
  const removeAnimation = async () => {
    await delay(1500);
    setAnimationBoard(boardTemplate);
  };

  //MEIKÄMANDARIININ KOODIMOODI

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

  const [dictionary, setWords] = useState<string[]>([]);
  const dictionarySet = useMemo(() => new Set(dictionary), [dictionary]);
  const [hand, setHand] = useState<string[]>([]);
  const [guessed, setGuessed] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);

  const [hintVis, setHintVis] = useState<boolean>(false);

  const [board, setBoard] = useState<string[][]>(boardTemplate);
  const [animationBoard, setAnimationBoard] =
    useState<string[][]>(boardTemplate);
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
      generateBoard();
    }
  }, [dictionary.length]);

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
          if (
            isalpha(boardCopy[x - 1]?.[y]) ||
            isalpha(boardCopy[x + 1]?.[y])
          ) {
            var existing = getWord([x, y], !isHorizontal, boardCopy);
            for (let k = 0; k < existing.length; k++) {
              const letter = existing[k];
              score += LETTER_SCORES[letter] || 0;
            }
          }
        } else {
          if (
            isalpha(boardCopy[x]?.[y - 1]) ||
            isalpha(boardCopy[x]?.[y + 1])
          ) {
            var existing = getWord([x, y], !isHorizontal, boardCopy);
            for (let k = 0; k < existing.length; k++) {
              const letter = existing[k];
              score += LETTER_SCORES[letter] || 0;
            }
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
        var existing = getWord(
          [position[0], position[1] - 1],
          isHorizontal,
          boardCopy
        );
        for (let k = 0; k < existing.length; k++) {
          adjacentScore += LETTER_SCORES[existing[k]] || 0;
        }
      }
    } else if (!isHorizontal && position[0] - 1 >= 0) {
      if (isalpha(board[position[0] - 1][position[1]])) {
        var existing = getWord(
          [position[0] - 1, position[1]],
          isHorizontal,
          boardCopy
        );
        for (let k = 0; k < existing.length; k++) {
          adjacentScore += LETTER_SCORES[existing[k]] || 0;
        }
      }
    }

    score += adjacentScore;
    score *= multiplier;
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
      if (position[1] < 0 || position[1] + word.length > 14) {
        return 0;
      }
    } else {
      if (position[0] < 0 || position[0] + word.length > 14) {
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

  function generateBoard() {
    if (!generating) {
      generating = true;

      if (seedNumber === 0) {
        seedNumber = Math.floor(Math.random() * 1000000);
        rand = SeedRandom(seedNumber, 1000);
      } else {
        rand = SeedRandom(seedNumber, 1000);
      }
      guess = "";
      console.log("Generoidaan siemenellä " + seedNumber);

      var count = getRandomInt(2, 4);
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
          var s = dictionary.filter((w) => w.length <= 8);
          word = s[rand(0, s.length)];
          offset = getRandomInt(0, word.length - 1);
        } else {
          try {
            var s = dictionary.filter(
              (w) => w.length <= 8 && w.includes(letter)
            );
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
        count--;
        t = 10000;
        b = copy.map((row) => row.slice());
      }
      //test
      //b = test;
      generatedBoard = b.map((r) => r.slice());
      setBoard(b);

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

      var handt: string[] = [];
      for (let i = 0; i < 7; i++) {
        handt.push(bag.splice(getRandomInt(0, bag.length - 1), 1)[0]);
      }
      setHand(handt);
      generatedHand = handt;
      currentHand = handt.slice(); // Initialize currentHand with the new hand

      // Find possible words - optimized
      const solutiones: any[] = [];
      const handStr = handt.join("");
      const processedRows = new Set<string>();
      const processedCols = new Set<string>();

      for (let i = 0; i < b.length; i++) {
        const rowStr = rowToString(b, i);

        processedRows.add(rowStr);
        const combinedRow = rowStr + handStr;

        wordsFromLetters(combinedRow).forEach((word) => {
          if (i === 12) {
            console.log(word);
          }
          for (let j = 0; j < b[i].length; j++) {
            const r = validateWord(word, [i, j], b, handt, true);
            if (r !== 0) {
              solutiones.push([word, [i, j], r, "r", false]);
              maxScore += r;
              maxWord += 1;
            }
          }
        });

        const colStr = columnToString(b, i);
        processedCols.add(colStr);
        const combinedCol = colStr + handStr;
        wordsFromLetters(combinedCol).forEach((word) => {
          for (let j = 0; j < b.length; j++) {
            const r = validateWord(word, [j, i], b, handt, false);
            if (r !== 0) {
              solutiones.push([word, [j, i], r, "d", false]);
              maxScore += r;
              maxWord += 1;
            }
          }
        });
      }

      setSolutions(solutiones);
      setCookieFunction("board", b, 7);

      console.log("maxScore: " + maxScore + "  maxWords: " + maxWord);

      console.log("Generoitu");
    }
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

  useEffect(() => {
    onScoreChange?.(totalScore);
  }, [totalScore, onScoreChange]);

  useEffect(() => {
    onstatsChange?.([totalScore, maxScore, guessed.length, maxWord]);
  }, [totalScore, maxScore, maxWord, guessed.length, onstatsChange]);

  useEffect(() => {
    if (solutions.length > 0) {
      var h = solutions[getRandomInt(0, solutions.length)];

      hintDirection = h[3];
      hintPosition = [
        h[1],
        h[3] === "r"
          ? [h[1][0], h[1][1] + h[0].length]
          : [h[1][0] + h[0].length, h[1][1]],
      ];
      setHintVis(true);
      removing = h[0];
      removeHint(h[0]);
    }
  }, [hint]);

  const removeHint = async (word: string) => {
    await delay(10000);
    if (removing === word) {
      setHintVis(false);
    }
  };

  useEffect(() => {
    onSolutionsChange?.(solutions);
  }, [solutions, onSolutionsChange]);

  return (
    <div id="master-div">
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

            const userLetter = placedLetters[coordKey];
            const generatedLetter = board[r][c];
            const outLetter = animationBoard[r][c];

            const isAlpha = /[a-z|ä|ö]/i.test(generatedLetter as string);
            const isAlpha2 = /[a-z|ä|ö]/i.test(outLetter as string);

            const finalLetter =
              userLetter || (isAlpha ? (generatedLetter as string) : null);
            const finalout = isAlpha2 ? (outLetter as string) : null;
            return (
              <div
                key={coordKey + finalLetter}
                className={`base-tile ${STYLE_MAP[cellValue]} ${
                  finalout
                    ? "has-letter letter-disappears-animation"
                    : finalLetter
                    ? "has-letter letter-appears-animation"
                    : ""
                }`}
                onClick={() => moveCursorTo(colNum, rowNum)}
                style={{
                  backgroundImage: finalLetter
                    ? `url(/graphics/tiles/letters/${finalLetter.toUpperCase()}.png)`
                    : finalout
                    ? `url(/graphics/tiles/letters/${finalout.toUpperCase()}.png)`
                    : undefined,
                  backgroundSize: "cover",
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
              (guess.length > 0 ? oguessPointer[1] : cursor.col - 1) * step
            }vh, ${
              (guess.length > 0 ? oguessPointer[0] : cursor.row - 1) * step
            }vh)`,
            transition: "transform 0.02s ease-out",
            zIndex: 10,
          }}
        >
          <img
            src="/graphics/cursor_half.png"
            id="cursor-border"
            className={`cursor-inner ${
              direction === "r" ? "cursor-right" : "cursor-down"
            }`}
            alt=""
          />
        </div>

        {/* Karettti */}
        <div
          id="cursor"
          onClick={handleCursorClick}
          style={{
            transform: `translate(${(cursor.col - 1) * step}vh, ${
              (cursor.row - 1) * step
            }vh)`,
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
                guess.length > 0 && direction == "d" ? "5.75vh" : "-2.5vh"
              }`,
            }}
          />
          <img
            src="/graphics/cursor_half_caretside.png"
            id="cursor-border"
            className={`cursor-inner ${
              direction === "r" ? "cursor-right" : "cursor-down"
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
              guess.length == 0 && direction == "r"
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
            hintVis
              ? "hint-visible tile-appear"
              : "hint-invisible tile-disappear"
          }
          style={{
            transform: `translate(${hintPosition[0][1] * step}vh, ${
              hintPosition[0][0] * step
            }vh)`,
            transition: "transform 0.02s ease-out",
            zIndex: 10,
          }}
        >
          <img
            src="/graphics/cursor_half.png"
            id="cursor-border"
            className={`cursor-inner ${
              hintDirection === "r" ? "cursor-right" : "cursor-down"
            }`}
            alt=""
          />
        </div>

        {/* Vinkki Loppupää */}
        <div
          id="cursor"
          className={
            hintVis
              ? "hint-visible tile-appear"
              : "hint-invisible tile-disappear"
          }
          style={{
            transform: `translate(${hintPosition[1][1] * step}vh, ${
              hintPosition[1][0] * step
            }vh)`,
            transition: "transform 0.02s ease-out",
            zIndex: 10,
          }}
        >
          <img
            src="/graphics/cursor_half_caretside.png"
            id="cursor-border"
            className={`cursor-inner ${
              hintDirection === "r" ? "cursor-right" : "cursor-down"
            }`}
            alt=""
          />
        </div>
      </div>

      <div id="hand-container">
        {hand.map((tile, i) => (
          <div
            key={i}
            className={`base-tile hand-tile ${
              tile.toUpperCase() ? "has-letter" : ""
            }`}
            style={{
              backgroundImage: tile.toUpperCase()
                ? `url(/graphics/tiles/letters/${tile.toUpperCase()}.png)`
                : undefined,
              backgroundSize: "contain",
              filter: "none",
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
