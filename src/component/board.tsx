import { useEffect, useState } from "react";
import "./board.css";
import Tile from "./Tile";

var guess = "";
var guessing = false;
var isHor = true;
var oguessPointer: number[] = [7, 7];
var guessPointer: number[] = [7, 7];
var generatedBoard: string[][] = [];
var generatedHand: string[] = [];

function Board() {
  const boardTemplate = [
    ["1", "0", "0", "4", "0", "0", "0", "1", "0", "0", "0", "4", "0", "0", "1"],
    ["0", "2", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "2", "0"],
    ["0", "0", "2", "0", "0", "0", "4", "0", "4", "0", "0", "0", "2", "0", "0"],
    ["4", "0", "0", "2", "0", "0", "0", "4", "0", "0", "0", "2", "0", "0", "4"],
    ["0", "0", "0", "0", "2", "0", "0", "0", "0", "2", "0", "0", "0", "0", "0"],
    ["0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0"],
    ["0", "0", "4", "0", "0", "0", "4", "0", "4", "0", "0", "0", "4", "0", "0"],
    ["1", "0", "0", "4", "0", "0", "0", "5", "0", "0", "0", "4", "0", "0", "1"],
    ["0", "0", "4", "0", "0", "0", "4", "0", "4", "0", "0", "0", "4", "0", "0"],
    ["0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0"],
    ["0", "0", "0", "0", "2", "0", "0", "0", "0", "2", "0", "0", "0", "0", "0"],
    ["4", "0", "0", "2", "0", "0", "0", "4", "0", "0", "0", "2", "0", "0", "4"],
    ["0", "0", "2", "0", "0", "0", "4", "0", "4", "0", "0", "0", "2", "0", "0"],
    ["0", "2", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "2", "0"],
    ["1", "0", "0", "4", "0", "0", "0", "1", "0", "0", "0", "4", "0", "0", "1"],
  ];

  const [dictionary, setWords] = useState<string[]>([]);
  const [hand, setHand] = useState<string[]>([]);
  const [guessStartPos, setActive] = useState<number[]>([7, 7]);
  const [guessed, setGuessed] = useState<any[]>([]);
  const [horizontalSolutions, setHor] = useState<any[]>([]);
  const [verticalSolutions, setVer] = useState<any[]>([]);

  const [board, setBoard] = useState<string[][]>(boardTemplate);
  useEffect(() => {
    fetch("/siisti.txt")
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
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function getLetter(b: string[][] = board, position: number[]) {
    return b[position[0]][position[1]];
  }
  function getRandomIndex(word: string, letter: string) {
    var indices = word
      .split("")
      .map((c, i) => (c === letter ? i : -1))
      .filter((i) => i !== -1);
    return indices[getRandomInt(0, indices.length - 1)];
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
    return /[a-z|ä|ö]/.test(str);
  }
  function validateBoard(board: string[][]) {
    for (var i = 0; i < board.length; i++) {
      var buffer = "";
      for (var j = 0; j < board[i].length; j++) {
        if (isalpha(board[i][j])) {
          buffer += board[i][j];
        } else if (buffer.length > 1) {
          if (!dictionary.includes(buffer)) {
            return false;
          }
          buffer = "";
        } else {
          buffer = "";
        }
      }
      if (buffer.length > 1) {
        if (!dictionary.includes(buffer)) {
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
          if (!dictionary.includes(buffer)) {
            return false;
          }
          buffer = "";
        } else {
          buffer = "";
        }
      }
      if (buffer.length > 1) {
        if (!dictionary.includes(buffer)) {
          return false;
        }
      }
    }
    return true;
  }

  function validateWord(
    word: string,
    position: number[],
    board: string[][],
    isHorizontal: boolean
  ) {
    var boardCopy = board.map((row) => row.slice());
    //Tarkista mahtuuko sana
    if (isHorizontal) {
      if (position[1] < 0 || position[1] + word.length > 14) {
        return false;
      }
    } else {
      if (position[0] < 0 || position[0] + word.length > 14) {
        return false;
      }
    }

    //Tarkista sopiiko sana
    for (var i = 0; i < word.length; i++) {
      var x = isHorizontal ? position[0] : position[0] + i;
      var y = isHorizontal ? position[1] + i : position[1];

      if (isalpha(board[x][y]) && board[x][y] !== word[i]) {
        return false;
      }

      //Lisätään samalla sanaa pöydän kopioon
      boardCopy[x][y] = word[i];
    }

    //Tarkista kelpaako sana
    if (!validateBoard(boardCopy)) {
      return false;
    }
    return true;
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

  function contains(word: string, hand: string, letters: string) {
    const combined = hand + letters;
    return (
      [...letters].every((l) => word.includes(l)) &&
      [...word].every(
        (l) => word.split(l).length - 1 <= combined.split(l).length - 1
      )
    );
  }

  function generateBoard() {
    guessing = false;
    guess = "";

    var count = getRandomInt(2, 4);
    //var count = 1;
    console.log("Aloitetaan luominen " + count + " sanalla");
    setActive([-1, -1]);

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
        word = s[Math.floor(Math.random() * s.length)];
        offset = getRandomInt(0, word.length - 1);
      } else {
        try {
          var s = dictionary.filter((w) => w.length <= 8 && w.includes(letter));
          word = s[Math.floor(Math.random() * s.length)];
          offset = getRandomIndex(word, letter);
        } catch (e) {
          r++;
          continue;
        }
      }

      //Valitse paikka
      var isHorizonal = Math.random() < 0.5;

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

    generatedBoard = b.map((r) => r.slice());
    setBoard(b);
    console.log("Luotu pöytä");

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

    var handt: any[] = [];
    for (let i = 0; i < 7; i++) {
      handt.push(bag.splice(getRandomInt(0, bag.length - 1), 1)[0]);
    }

    setHand(handt);
    generatedHand = handt;

    //Etsitään mahdolliset sanat
    var h: any[] = [];
    var v: any[] = [];
    for (var i = 0; i < b.length; i++) {
      for (var j = 0; j < b[i].length; j++) {
        if (isalpha(b[i][j])) {
          var horlet = rowToString(b, i);
          var verlet = columnToString(b, j);

          dictionary.forEach((word) => {
            if (contains(word, handt.join(""), horlet)) {
              if (
                validateWord(word, [i, j], b, true) &&
                !placedWords.some(
                  (pw) => pw[0] === word && pw[1][0] === i && pw[1][1] === j
                )
              ) {
                h.push([word, [i, j], getScore(word, [i, j], true)]);
              }
            }
            if (contains(word, handt.join(""), verlet)) {
              if (
                validateWord(word, [i, j], b, false) &&
                !placedWords.some(
                  (pw) => pw[0] === word && pw[1][0] === i && pw[1][1] === j
                )
              ) {
                v.push([word, [i, j], getScore(word, [i, j], false)]);
              }
            }
          });
        }
      }
    }

    console.log("Löydetty", h.length, v.length);
    setHor(h);
    setVer(v);
  }

  function getScore(word: string, pos: number[], isHorizontal: boolean) {
    const letter_scores = {
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
    } as const;

    var score = 0;
    var multiplier = 1;
    var used = 0;

    //Katsotaan jatkaako vanhaa sanaa
    if (isHorizontal) {
      if (isalpha(generatedBoard[pos[0]][pos[1] - 1])) {
        var existing = getWord([pos[0], pos[1] - 1], isHorizontal);
        //ota score
        existing.split("").forEach((letter) => {
          score += letter_scores[letter as keyof typeof letter_scores];
        });
      } else if (isalpha(generatedBoard[pos[0]][pos[1] + word.length])) {
        var existing = getWord([pos[0], pos[1] + word.length], isHorizontal);
        //ota score
        existing.split("").forEach((letter) => {
          score += letter_scores[letter as keyof typeof letter_scores];
        });
      }
    } else {
      if (isalpha(generatedBoard[pos[0] - 1][pos[1]])) {
        var existing = getWord([pos[0] - 1, pos[1]], !isHorizontal);
        //ota score
        existing.split("").forEach((letter) => {
          score += letter_scores[letter as keyof typeof letter_scores];
        });
      } else if (isalpha(generatedBoard[pos[0] + word.length][pos[1]])) {
        var existing = getWord([pos[0] + word.length, pos[1]], !isHorizontal);
        //ota score
        existing.split("").forEach((letter) => {
          score += letter_scores[letter as keyof typeof letter_scores];
        });
      }
    }

    for (var i = 0; i < word.length; i++) {
      //Kerätään uuden sanan pisteet
      //Kertätään kertoimet

      var x = isHorizontal ? pos[0] : pos[0] + i;
      var y = isHorizontal ? pos[1] + i : pos[1];

      if (generatedBoard[x][y] === "1") {
        multiplier *= 3;
      } else if (generatedBoard[x][y] === "2") {
        multiplier *= 2;
      } else if (generatedBoard[x][y] === "3") {
        score += letter_scores[word[i] as keyof typeof letter_scores] * 3;
      } else if (generatedBoard[x][y] === "4") {
        score += letter_scores[word[i] as keyof typeof letter_scores] * 2;
      } else if (generatedBoard[x][y] === "0") {
        used += 1;
        score += letter_scores[word[i] as keyof typeof letter_scores];
      } else {
        score += letter_scores[word[i] as keyof typeof letter_scores];
      }

      //KAtso ettei overflow
      //Käydään sivuavat sanat läpi
      if (isHorizontal) {
        if (isalpha(generatedBoard[x + 1][y])) {
          var adjacent = getWord([x + 1, y], !isHorizontal);
          adjacent.split("").forEach((letter) => {
            score += letter_scores[letter as keyof typeof letter_scores];
          });
        } else if (isalpha(generatedBoard[x - 1][y])) {
          var adjacent = getWord([x - 1, y], !isHorizontal);
          adjacent.split("").forEach((letter) => {
            score += letter_scores[letter as keyof typeof letter_scores];
          });
        }
      } else {
        if (isalpha(generatedBoard[x][y + 1])) {
          var adjacent = getWord([x, y + 1], !isHorizontal);
          adjacent.split("").forEach((letter) => {
            score += letter_scores[letter as keyof typeof letter_scores];
          });
        } else if (isalpha(generatedBoard[x][y - 1])) {
          var adjacent = getWord([x, y - 1], !isHorizontal);
          adjacent.split("").forEach((letter) => {
            score += letter_scores[letter as keyof typeof letter_scores];
          });
        }
      }
    }

    //Summaa kaikki yhteen
    score *= multiplier;
    if (used == 7) {
      score += 50;
    }

    return score;
  }

  function getWord(pos: number[], isHorizontal: boolean) {
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
        if (isalpha(board[x][i])) {
          word += board[i][y];
        } else {
          break;
        }
      }

      for (var i = x - 1; i >= 0; i--) {
        if (isalpha(board[x][i])) {
          word = board[i][y] + word;
        } else {
          break;
        }
      }
    }
    return word;
  }

  const handle = (event: React.KeyboardEvent) => {
    console.log(event.key, guessPointer);

    if (!guessing) {
      if (event.key === "ArrowUp") {
        guessPointer = [Math.min(guessPointer[0] - 1, 14), guessPointer[1]];
        setActive(guessPointer);
      }
      if (event.key === "ArrowDown") {
        guessPointer = [Math.max(guessPointer[0] + 1, 0), guessPointer[1]];
        setActive(guessPointer);
      }
      if (event.key === "ArrowRight") {
        guessPointer = [guessPointer[0], Math.min(guessPointer[1] + 1, 14)];
        setActive(guessPointer);
      }
      if (event.key === "ArrowLeft") {
        guessPointer = [guessPointer[0], Math.max(guessPointer[1] - 1, 0)];
        setActive(guessPointer);
      }
    }

    if (guessing == true) {
      if (event.key === "Backspace" && guess.length > 0) {
        if (isHor) {
          if (!isalpha(generatedBoard[guessPointer[0]][guessPointer[1] - 1])) {
            var handcopy = hand.slice();
            handcopy.push(guess[guess.length - 1]);
            setHand(handcopy);
          }
        } else {
          if (!isalpha(generatedBoard[guessPointer[0] - 1][guessPointer[1]])) {
            var handcopy = hand.slice();
            handcopy.push(guess[guess.length - 1]);
            setHand(handcopy);
          }
        }

        guess = guess.slice(0, -1);

        const copy = board.map((r) => r.slice());
        if (isHor) {
          copy[guessPointer[0]][guessPointer[1] - 1] =
            generatedBoard[guessPointer[0]][guessPointer[1] - 1];
        } else {
          copy[guessPointer[0] - 1][guessPointer[1]] =
            generatedBoard[guessPointer[0] - 1][guessPointer[1]];
        }
        guessPointer = isHor
          ? [guessPointer[0], guessPointer[1] - 1]
          : [guessPointer[0] - 1, guessPointer[1]];

        setBoard(copy);
      } else if (event.key === "Enter" && guess.length > 0) {
        if (validateBoard(board)) {
          console.log("Sopii");
          var guessedCopy = guessed.slice();
          guessedCopy.push([guess, oguessPointer]);
          setGuessed(guessedCopy);
        } else {
          console.log("Ei sovi");
        }
        setBoard(generatedBoard);
        setHand(generatedHand);
        setActive([-1, -1]);
        guess = "";
      } else if (
        isalpha(event.key) &&
        event.key.length === 1 &&
        guessPointer[0] < 15 &&
        guessPointer[1] < 15
      ) {
        //Jos kädessä on kirjain tai on jo laudalla
        if (isalpha(board[guessPointer[0]][guessPointer[1]])) {
          guess += board[guessPointer[0]][guessPointer[1]];
          const copy = board.map((r) => r.slice());
          setBoard(copy);
          if (guessPointer[0] + 1 < 15 && guessPointer[1] + 1 < 15) {
            guessPointer = isHor
              ? [guessPointer[0], guessPointer[1] + 1]
              : [guessPointer[0] + 1, guessPointer[1]];
          }
        } else if (hand.includes(event.key)) {
          var handcopy = hand.slice();
          handcopy.splice(handcopy.indexOf(event.key), 1);
          setHand(handcopy);

          guess += event.key;
          const copy = board.map((r) => r.slice());
          copy[guessPointer[0]][guessPointer[1]] = event.key;
          setBoard(copy);
          if (guessPointer[0] + 1 < 16 && guessPointer[1] + 1 < 16) {
            guessPointer = isHor
              ? [guessPointer[0], guessPointer[1] + 1]
              : [guessPointer[0] + 1, guessPointer[1]];
          }
        }
      }
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      handle(e as unknown as React.KeyboardEvent);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handle]);

  function PressTile(pos: number[]) {
    if (guessStartPos[0] == pos[0] && guessStartPos[1] == pos[1]) {
      isHor = !isHor;
    } else {
      isHor = true;
    }

    setBoard(generatedBoard);
    setHand(generatedHand);
    guess = "";
    setActive(pos);
    guessPointer = pos;
    oguessPointer = pos;
    guessing = true;
  }

  function renderClass(tile: string, tilePos: number[]) {
    if (tilePos[0] == guessPointer[0] && tilePos[1] == guessPointer[1]) {
      if (isHor) {
        return "write-horizontal";
      } else {
        return "write-vertical";
      }
    }
    if (isalpha(tile)) {
      return "active";
    } else {
      return "";
    }
  }

  function renderSolution(word: string, pos: number[]) {
    for (const g of guessed) {
      if (g[0] === word && g[1][0] === pos[0] && g[1][1] === pos[1]) {
        return "solved";
      }
    }
    return "";
  }

  return (
    <>
      <h1 onClick={generateBoard}>Pöytä</h1>
      <div className="container" tabIndex={0}>
        {board.map((row, i) =>
          row.map((tile, j) => (
            <Tile
              onClick={() => PressTile([i, j])}
              color={renderClass(tile, [i, j])}
              position={[i, j]}
              key={i + "-" + j}
            >
              {tile}
            </Tile>
          ))
        )}
      </div>
      <div className="hand">
        {hand.map((tile, i) => (
          <div key={i} className="tile">
            {tile.toUpperCase()}
          </div>
        ))}
      </div>
      <div className="horizontal-solutions">
        {horizontalSolutions.map((tile, i) => (
          <div key={i} className={renderSolution(tile[0], tile[1])}>
            {tile[0] + " " + tile[1] + " " + tile[2]}
          </div>
        ))}
      </div>

      <div className="vertical-solutions">
        {verticalSolutions.map((tile, i) => (
          <div key={i} className={renderSolution(tile[0], tile[1])}>
            {tile[0] + " " + tile[1] + " " + tile[2]}
          </div>
        ))}
      </div>
    </>
  );
}

export default Board;
