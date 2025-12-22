import random
from copy import copy, deepcopy

class Tile:
    def __init__(self, letter, position):
        self.letter = letter
        self.position = position

class Word:
    def __init__(self, word, position, isHorizontal, score):
        self.word = word
        self.position = position
        self.isHorizontal = isHorizontal
        self.score = score


letter_counts = {"a": 10, "b": 1, "c": 1, "d": 1, "e": 8, "f": 1, "g": 1, "h": 2, "i": 10, "j": 2,
                 "k": 5, "l": 5, "m": 3, "n": 9, "o": 5, "p": 2, "r": 2, "s": 7,
                 "t": 9, "u": 4, "v": 2, "w": 1, "y": 2, "ä": 5, "ö": 1 }
letter_scores = {"a": 1, "b": 8, "c": 10, "d": 7, "e": 1, "f": 8, "g": 8, "h": 4, "i": 1, "j": 4,
                 "k": 2, "l": 2, "m": 3, "n": 1, "o": 2, "p": 4, "r": 4, "s": 1,
                 "t": 1, "u": 3, "v": 4, "w": 8, "y": 4, "ä": 2, "ö": 7 }
bag = []
for key in letter_counts.keys():
    for i in range(letter_counts[key]):
        bag.append(key)
forbidden_letters = ["q", "x"]
dictionary = []
if True:
    print("Aloitetaan siistiminen...")
    with open("ap_sanalista.txt", "r") as file:
        with open("siisti.txt", "w") as o_file:
            lines = file.readlines()
            for line in lines:
                sana = line.split("	")[0]
                if "Hakusana" in sana or not sana.isalpha() or not sana.islower() or "q" in sana or "x" in sana or "z" in sana or len(sana) > 15 or sana in dictionary:
                    continue
                flag = False
                for key in letter_counts.keys():
                    if sana.count(key) > letter_counts[key] + 2:
                        flag = True
                if flag:
                    continue
                else:
                    dictionary.append(sana)
                    o_file.write(sana + "\n")

    print("Siistitty!")
else:
    with open("siisti.txt", "r") as file:
        lines = file.readlines()
        for line in lines:
            dictionary.append(line.strip())