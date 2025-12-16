import { useEffect, useState, type KeyboardEventHandler } from "react";
import "./board.css";

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
    return /^[a-zA-Z()]+$/.test(str);
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
    var count = getRandomInt(3, 6);
    console.log("Aloitetaan luominen " + count + " sanalla");
    b = boardTemplate.map((row) => row.slice());
    var position = [7, 7];

    var b = boardTemplate;
    var t = 1000;
    var first = true;
    var mahu = 0;
    var sovi = 0;
    var kelpaa = 0;
    var r = 0;

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
      count--;
      t = 10000;
      console.log(word);
      b = copy.map((row) => row.slice());
    }

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

    type Letter = keyof typeof letter_counts;

    const bag: string[] = [];
    for (const letter in letter_counts) {
      for (let i = 0; i < letter_counts[letter as Letter]; i++) {
        bag.push(letter);
      }
    }

    var handt = [];
    for (let i = 0; i < 7; i++) {
      handt.push(bag.splice(getRandomInt(0, bag.length - 1), 1)[0]);
    }
    setHand(handt);

    //Etsitään mahdolliset sanat
    console.log("Etstiään");
    var hor = [];
    var ver = [];
    console.log(columnToString(b, 7));
    console.log(rowToString(b, 7));
    for (var i = 0; i < b.length; i++) {
      for (var j = 0; j < b[i].length; j++) {
        if (isalpha(b[i][j])) {
          var horlet = rowToString(b, i);
          var verlet = columnToString(b, j);
          for (var word in dictionary) {
            if (contains(word, handt.join(""), horlet)) {
              console.log("MM");

              if (validateWord(word, [i, j], b, true)) {
                hor.push({ word: word, position: [i, j], horizontal: true });
                console.log({ word: word, position: [i, j], horizontal: true });
              }
            }
            if (contains(word, handt.join(""), verlet)) {
              if (validateWord(word, [i, j], b, false)) {
                ver.push({ word: word, position: [i, j], horizontal: false });
                console.log({
                  word: word,
                  position: [i, j],
                  horizontal: false,
                });
              }
            }
          }
        }
      }
    }
    console.log("Löydetty");
  }

  function isLetter(str: string) {
    return str.length === 1 && !!str.match(/[a-z]/i);
  }

  var guess = "";
  var guessing = false;
  var posi: number[] = [];
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      console.log(guess + " " + posi);
      console.log(validateWord(guess, posi, board, true));
      guess = "";
    } else if (guessing == true && isLetter(event.key)) {
      guess += event.key;
      console.log("Arvaus " + guess);
    }
  };

  function pos(pos: number[]) {
    posi = pos;
    guessing = true;
    console.log("Painoit " + posi);
  }

  return (
    <>
      <h1 onClick={generateBoard}>Pöytä</h1>
      <div className="container" onKeyDown={handleKeyDown} tabIndex={0}>
        {board.map((row, i) =>
          row.map((tile, j) => (
            <div
              onClick={() => pos([i, j])}
              key={i + "-" + j}
              className={isalpha(tile) ? "tile-active" : "tile"}
            >
              {tile.toUpperCase()}
            </div>
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
    </>
  );
}

export default Board;
