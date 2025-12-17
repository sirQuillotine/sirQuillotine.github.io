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
if not True:
    print("Aloitetaan siistiminen...")
    with open("nykysuomensanalista2024.txt", "r") as file:
        with open("siisti.txt", "w") as o_file:
            lines = file.readlines()
            for line in lines:
                sana = line.split("	")[0]
                if "Hakusana" in sana or not sana.isascii() or not sana.isalpha() or not sana.islower() or "q" in sana or "x" in sana or "z" in sana or len(sana) > 15 or sana in dictionary:
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


# 0 tyhjä
# 1 3x sana
# 2 2x sana
# 3 3x kirjain
# 4 2x kirjain

board = [["1", "0", "0", "4", "0", "0", "0", "1", "0", "0", "0", "4", "0", "0", "1"],
         ["0", "2", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "2", "0"],
         ["0", "0", "2", "0", "0", "0", "4", "0", "4", "0", "0", "0", "2", "0", "0"],
         ["4", "0", "0", "2", "0", "0", "0", "4", "0", "0", "0", "2", "0", "0", "4"],
         ["0", "0", "0", "0", "2", "0", "0", "0", "0", "2", "0", "0", "0", "0", "0"],
         ["0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0"],
         ["0", "0", "4", "0", "0", "0", "4", "0", "4", "0", "0", "0", "4", "0", "0"],
         ["1", "0", "0", "4", "0", "0", "0", "2", "0", "0", "0", "4", "0", "0", "1"], #keskikohta [7, 7]
         ["0", "0", "4", "0", "0", "0", "4", "0", "4", "0", "0", "0", "4", "0", "0"],
         ["0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0"],
         ["0", "0", "0", "0", "2", "0", "0", "0", "0", "2", "0", "0", "0", "0", "0"],
         ["4", "0", "0", "2", "0", "0", "0", "4", "0", "0", "0", "2", "0", "0", "4"],
         ["0", "0", "2", "0", "0", "0", "4", "0", "4", "0", "0", "0", "2", "0", "0"],
         ["0", "2", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "2", "0"],
         ["1", "0", "0", "4", "0", "0", "0", "1", "0", "0", "0", "4", "0", "0", "1"]]

test_board = [["1", "0", "0", "4", "0", "0", "0", "1", "0", "0", "0", "4", "0", "0", "1"],
         ["0", "2", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "2", "0"],
         ["0", "0", "2", "0", "0", "0", "4", "0", "4", "0", "0", "0", "2", "0", "0"],
         ["4", "0", "0", "2", "0", "0", "0", "4", "0", "0", "0", "2", "0", "0", "4"],
         ["0", "0", "0", "0", "2", "0", "0", "0", "0", "2", "0", "0", "0", "0", "0"],
         ["0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0"],
         ["0", "0", "4", "0", "0", "0", "4", "0", "4", "0", "0", "0", "4", "0", "0"],
         ["1", "0", "0", "4", "0", "0", "y", "l", "i", "0", "0", "4", "0", "0", "1"], #keskikohta [7, 7]
         ["0", "0", "4", "0", "0", "0", "4", "0", "4", "0", "0", "0", "4", "0", "0"],
         ["0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "3", "0"],
         ["0", "0", "0", "0", "2", "0", "0", "0", "0", "2", "0", "0", "0", "0", "0"],
         ["4", "0", "0", "2", "0", "0", "0", "4", "0", "0", "0", "2", "0", "0", "4"],
         ["0", "0", "2", "0", "0", "0", "4", "0", "4", "0", "0", "0", "2", "0", "0"],
         ["0", "2", "0", "0", "0", "3", "0", "0", "0", "3", "0", "0", "0", "2", "0"],
         ["1", "0", "0", "4", "0", "0", "0", "1", "0", "0", "0", "4", "0", "0", "1"]]

for row_index, row in enumerate(test_board):
    for column_index, letter in enumerate(row):
        if letter.isalpha():
            test_board[row_index][column_index] = Tile(letter, (row_index, column_index))

def render_board(board):
    for row_index, row in enumerate(board):
        for column_index, letter in enumerate(row):
            try:
                print(f"|{letter.letter:2}", end="")
            except:
                if row_index == 0:
                    print(f"|{column_index:2}", end="")
                elif column_index == 0:
                    print(f"|{row_index:2}", end="")
                elif letter == "1":
                    print(f"|{"3x":2}", end="")
                elif letter == "2":
                    print(f"|{"2x":2}", end="")
                elif letter == "3":
                    print(f"|{"+3":2}", end="")
                elif letter == "4":
                    print(f"|{"+2":2}", end="")
                else:
                    print(f"|{"":2}", end="")
                
        print("")

def rowsAsStrings(board):
    rows = []
    for row in board:
        row_string = []
        for letter in row:
            row_string.append(letter.letter.lower() if type(letter) is Tile else " ")
        row_string = "".join(row_string).split(" ")
        for word in row_string:
            if word != "" and len(word) > 1:
                rows.append(word)
    return rows



def rowAsLetters(board, row_index):
    letters = []
    for tile in board[row_index]:
        if type(tile) is Tile:
            letters.append(tile.letter.lower())
    return letters

def columnsAsStrings(board):
    columns = []
    for i in range(15):
        column_string = []
        for j in range(15):
            column_string.append(board[j][i].letter.lower() if type(board[j][i]) is Tile else " ")
        column_string = "".join(column_string).split(" ")
        for word in column_string:
            if word != "" and len(word) > 1:
                columns.append(word)
    return columns

def columnAsLetters(board, column_index):
    letters = []
    for i in range(15):
        if type(board[i][column_index]) is Tile:
            letters.append(board[i][column_index].letter.lower())
    return letters

def validateBoard(board):
    rows = rowsAsStrings(board)
    columns = columnsAsStrings(board)
    
    for word in rows:
        if word not in dictionary:
            return False
        
    for word in columns:
        if word not in dictionary:
            return False
    return True



def getRandomIndex(word, letter):
    indices = [i for i, l in enumerate(word) if l == letter]
    if indices:
        return random.choice(indices)
    return -1

def getAllIndices(word, letter):
    indices = [i for i, l in enumerate(word) if l == letter]
    return indices

def ccontains(word, hand, letters):
    for letter in letters:
        if not letter in word:
            return False
    hand = hand + letters
    for letter in word:
        if word.count(letter) > "".join(hand).count(letter):

            return False
    return True

def getWordInPosition(board, pos, isHorizontal):
    word = ""
    if not type(board[pos[0]][pos[1]]) == Tile:
        return word.lower()
    
    if isHorizontal:
        for i in range(pos[1], 15):
            if type(board[pos[0]][i]) == Tile:
                word = word + board[pos[0]][i].letter
            else:
                break
        for i in range(pos[1] - 1, 0, -1):
            if type(board[pos[0]][i - 1]) == Tile:
                word = board[pos[0]][i - 1].letter + word
            else:
                break
        return word.lower()
    else:
        for i in range(pos[0], 15):
            if type(board[i][pos[1]]) == Tile:
                word = word + board[i][pos[1]].letter
            else:
                break
        for i in range(pos[0] - 1, 0, -1):
            if type(board[i - 1][pos[1]]) == Tile:
                word = board[i - 1][pos[1]].letter + word
            else:
                break
        return word.lower()
    
def getScoreInPosition(board, pos, isHorizontal):
    word = getWordInPosition(board, pos, isHorizontal)
    score = 0
    for letter in word:
        score += letter_scores[letter.lower()]
    return score



def getRandomNode(board):
    while True:
        try:
            node_tile = random.choice([l for l in random.choice(board) if type(l) is Tile])
            break
        except:
            continue
    return node_tile

def validateWord(word, hand, position, board, isHorizontal):
    matches = []
    #Käy kaikki indeksit läpi
    try:
        offsets = getAllIndices(word.lower(), board[position[0]][position[1]].letter.lower())
    except:
        offsets = range(0, len(word))
    for offset in offsets:
        if isHorizontal:
            if position[1] - offset < 0 or position[1] - offset + len(word) > 14:
                continue #Sana ei mahdu ruudulle
        else:
            if position[0] - offset < 0 or position[0] - offset + len(word) > 14:
                continue #Sana ei mahdu ruudulle

        # Yritä lisätä sana
        flag = False
        for i in range(0, len(word)):
            if isHorizontal:
                pos = (position[0], position[1]  - offset + i)
                if type(board[pos[0]][pos[1]]) is Tile:
                    if board[pos[0]][pos[1]].letter.lower() != word[i].lower():
                        flag = True # Ruutu on varattu
                    if word in getWordInPosition(board, pos, isHorizontal):
                        flag = True
                else:
                    if not word[i].lower() in hand:
                        flag = True
            if not isHorizontal:
                pos = (position[0] - offset + i, position[1])
                if type(board[pos[0]][pos[1]]) is Tile:
                    if board[pos[0]][pos[1]].letter.lower() != word[i].lower():
                        flag = True
                    if word in getWordInPosition(board, pos, isHorizontal):
                        flag = True
                else:
                    if not word[i].lower() in hand:
                        flag = True
        if flag:
            continue

        new_board = deepcopy(board)
        score = 0
        adjacent_score = 0
        multiplier = 1
        used = 0
        start_pos = None
        for i in range(0, len(word)):
            if isHorizontal:
                pos = (position[0], position[1] - offset + i)
                start_pos = pos if start_pos is None else start_pos         
                tile = new_board[pos[0]][pos[1]]
                if type(tile) == Tile:
                    score += letter_scores[tile.letter.lower()]
                else:
                    try:
                        adjacent_score += getScoreInPosition(board, (pos[0] - 1, pos[1]), not isHorizontal)
                    except:
                        pass
                    try:
                        adjacent_score += getScoreInPosition(board, (pos[0] + 1, pos[1]), not isHorizontal)
                    except:
                        pass
                    used += 1
                    if tile == "0":
                        score += letter_scores[word[i].lower()]
                    if tile == "1":
                        multiplier *= 3
                    if tile == "2":
                        multiplier *= 2
                    if tile == "3":
                        score += letter_scores[word[i].lower()] * 3
                    if tile == "4":
                        score += letter_scores[word[i].lower()] * 2
                new_board[pos[0]][pos[1]] = Tile(word[i].upper(), pos) 
            if not isHorizontal:
                pos = (position[0] - offset + i, position[1])
                start_pos = pos if start_pos is None else start_pos 
                tile = new_board[pos[0]][pos[1]]
                if type(tile) == Tile:
                    score += letter_scores[tile.letter.lower()]
                else:
                    try:
                        adjacent_score += getScoreInPosition(board, (pos[0], pos[1] - 1), not isHorizontal)
                    except:
                        pass
                    try:
                        adjacent_score += getScoreInPosition(board, (pos[0], pos[1] + 1), not isHorizontal)
                    except:
                        pass
                    used += 1
                    if tile == "0":
                        score += letter_scores[word[i].lower()]
                    if tile == "1":
                        multiplier *= 3
                    if tile == "2":
                        multiplier *= 2
                    if tile == "3":
                        score += letter_scores[word[i].lower()] * 3
                    if tile == "4":
                        score += letter_scores[word[i].lower()] * 2
                new_board[pos[0]][pos[1]] = Tile(word[i].upper(), pos)

        if not validateBoard(new_board):
            continue
        
        if used == 7:
            score += 50
        matches.append(Word(word, start_pos, isHorizontal, (score) * multiplier + adjacent_score))
    return matches

def hasAdjacent(p, board):
    try:
        if type(board[p[0] + 1][p[1]]) == Tile:
            return True
    except:
        pass
    try:
        if type(board[p[0] - 1][p[1]]) == Tile:
            return True
    except:
        pass
    try:
        if type(board[p[0]][p[1] + 1]) == Tile:
            return True
    except:
        pass
    try:
        if type(board[p[0]][p[1] - 1]) == Tile:
            return True
    except:
        pass
    return False


def generate(board, letter_count):
    node_tile = None
    position = (7, 7)
    while letter_count > 0:
        new_board = deepcopy(board)

        #valitse sana 
        # LISÄÄ ETTÄ KÄY KAIKKI SANAT JÄRJESTELMÄLLISESTI
        # LISÄÄ ETTÄ LAATAT VASTAA PUSSIN LAATTOJA
        

        if not node_tile:
            word = random.choice([w for w in dictionary if len(w) <= 8])
            offset = random.randint(0, len(word) - 1)
        else:
            position = node_tile.position
            word = random.choice([w for w in dictionary if node_tile.letter.lower() in w and len(w) <= 8])
            offset = getRandomIndex(word, node_tile.letter.lower())

        #valitse paikka    
        isHorizontal = random.choice([True, False])
        if isHorizontal:
            if position[1] - offset < 0 or position[1] - offset + len(word) > 14:
                node_tile = getRandomNode(board)
                continue #Sana ei mahdu ruudulle
        else:
            if position[0] - offset < 0 or position[0] - offset + len(word) > 14:
                node_tile = getRandomNode(board)
                continue #Sana ei mahdu ruudulle

        # Yritä lisätä sana
        flag = False
        for i in range(0, len(word)):
            if isHorizontal:
                pos = (position[0], position[1] - offset + i)
                if type(board[pos[0]][pos[1]]) is Tile:
                    if board[pos[0]][pos[1]].letter.lower() != word[i].lower():
                        flag = True
                        node_tile = getRandomNode(board)
                        break # Ruutu on varattu
            if not isHorizontal:
                pos = (position[0] - offset + i, position[1])
                if type(board[pos[0]][pos[1]]) is Tile:
                    if board[pos[0]][pos[1]].letter.lower() != word[i].lower():
                        flag = True
                        node_tile = getRandomNode(board)
                        break # Ruutu on varattu
        if flag:
            continue
        
        for i in range(0, len(word)):
            if isHorizontal:
                pos = (position[0], position[1] - offset + i)
                new_board[pos[0]][pos[1]] = Tile(word[i].upper(), pos) 
            if not isHorizontal:
                pos = (position[0] - offset + i, position[1])
                new_board[pos[0]][pos[1]] = Tile(word[i].upper(), pos)
        if not validateBoard(new_board):
            continue # Lauta ei kelpaa

        letter_count -= 1
        board = new_board.copy()

        # Valitse seuraavan sanan paikka
        node_tile = getRandomNode(board)
    render_board(board)

    # Valitse kirjaimet pussista
    hand = "".join(random.sample(bag, 7))

    
    print("Kirjaimet kädessä: ", " ".join(hand).upper())

    #Etsi mahdolliset pöydälle sopivat sanat
    horizontal = []
    vertical = []
    highest = None
    for i, row in enumerate(board):
        for j, tile in enumerate(row):
            pos = (i, j)
            if type(tile) == Tile or hasAdjacent(pos, board):
                #Tarkista molemmat suunnat
                vertical_letters = "".join(columnAsLetters(board, pos[1]))
                horizontal_letters = "".join(rowAsLetters(board, pos[0]))
                horizontal_matches = []
                vertical_matches = []
                for word in dictionary:
                    if ccontains(word, hand, vertical_letters):
                        r = validateWord(word, hand, pos, board, False)
                        if r:
                            vertical_matches.extend(r)
                    if ccontains(word, hand, horizontal_letters):
                        e = validateWord(word, hand, pos, board, True)
                        if e:
                            horizontal_matches.extend(e)
                
                if vertical_matches or horizontal_matches:
                    if vertical_matches:
                        print("Pystyyn:", ", ".join([m.word + " " + str(m.position) + " " + str(m.score) for m in vertical_matches]), end=" ")
                    if horizontal_matches:
                        print("Vaakaan:", ", ".join([m.word + " " + str(m.position) +  " " + str(m.score) for m in horizontal_matches]), end=" ")
                    print("\n")

                for match in horizontal_matches:
                    if match not in horizontal:
                        horizontal.append(match)
                        if highest:
                            if match.score > highest.score:
                                highest = match
                        else:
                            highest = match
                for match in vertical_matches:
                    if match not in vertical:
                        vertical.append(match)
                        if highest:
                            if match.score > highest.score:
                                highest = match
                        else:
                            highest = match
    
    score = 0
    while len(horizontal) > 0 or len(vertical) > 0:
        guess = input("Arvaa sana ja paikka! V/P SANA 4,3: ").split(" ")
        if guess[0] == "V":
            isHorizontal = True
        else:
            isHorizontal = False
        word = guess[1]
        p = guess[2].split(",")
        pos = (int(p[0]), int(p[1]))
        g = Word(word, pos, isHorizontal, 0)
        if g.word == highest.word and g.position == highest.position:
            print("Löysit parhaiten pisteitä tuottavan sanan")
        if isHorizontal:
            for word in horizontal:
                if g.word == word.word and g.position == word.position:
                    print(f"{word.word} sopii kohtaan ({word.position}) ja tuottaa {word.score} pistettä")
                    horizontal.remove(word)
                    break
            else:
                print("Sana on käyteety tai ei sovi")
        else:
            for word in vertical:
                if g.word == word.word and g.position == word.position:
                    print(f"{word.word} sopii kohtaan ({word.position}) ja tuottaa {word.score} pistettä")
                    vertical.remove(word)
                    break
            else:
                print("Sana on käyteetty tai ei sovi")
        print(f"{len(horizontal) + len(vertical)} sanaa löytämättä")
    print("Kaikki löydetty!")




                
            




    


print("SANAPELI")


while True:
    letter_count = input("Kuinka monta sanaa haluat pöydälle? ")


    #Tarkista syöte!!!!!!!!!
    if int(letter_count) >= 1:
        letter_count = int(letter_count)
        generate(board, letter_count)
        break
    else:
        print("Anna kelvollinen numero.")
        letter_count = input("Kuinka monta sanaa haluat pöydälle? ")










