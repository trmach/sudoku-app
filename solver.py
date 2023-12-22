import sys
import os
import pandas as pd
import timeit
import time

global node_count

class Puzzle: # slave mentality
    def __init__(self, board):
        self.board = board # this will be a 9x9 2D array

    def checkPuzzle(self, board=None): # Return True for valid solution, False for invalid solution
        if board is None: # hell
            board = self.board
        s = set() # <- definition of valid sudoku row/column/box
        # check rows
        for i in range(9): 
            for j in range(9):
                if board[i][j] != 0:
                    s.add(board[i][j])
            if len(s) != 9:
                return False
            s.clear()
        
        # check columns
        for i in range(9): 
            for j in range(9):
                if board[i][j] != 0:
                    s.add(board[j][i])
            if len(s) != 9:
                return False
            s.clear()
        
        # check boxes
        for box_y in [0, 3, 6]: # starting row of boxes
            for box_x in [0, 3, 6]: # starting column of boxes
                for y in range(box_y, box_y + 3):
                    for x in range(box_x, box_x + 3):
                        if board[i][j] != 0:
                            s.add(board[y][x])
                if len(s) != 9:
                    return False
                s.clear()
        
        return True
    
    def pprints(self, board=None):
        p = ''
        if board is None:
            board = self.board
        for j in range(9):
            if j % 3 == 0:
                if j == 0:
                    p += ("╔" + ("═══╤"*2 + "═══╦")*2 + "═══╤"*2 + "═══╗")
                else:
                    p += ("╠" + ("═══╪"*2 + "═══╬")*2 + "═══╪"*2 + "═══╣")
            else:
                p += ("╟" + ("───┼"*2 + "───╫")*2 + "───┼"*2 + "───╢")
            p += '\n'
            for i in range(len(board[j])):
                if i % 3 == 0:
                    p += f"║ {board[j][i] if board[j][i] != 0 else ' '} "
                else:
                    p += f"│ {board[j][i] if board[j][i] != 0 else ' '} "
            p += "║"
            p += '\n'
        p += "╚" + ("═══╧"*2 + "═══╩")*2 + "═══╧"*2 + "═══╝"
        return p
    
    def pprint(self):
        print(self.pprints())

def findEmptyCell(p):
    for j in range(0, 9):
        for i in range(0, 9):
            if p.board[j][i] == 0:
                return (i, j)
    
    return (-1, -1)

def isValidDigit(p, i, j, e):
    if all([e != p.board[j][x] for x in range(9)]) and all([e != p.board[y][i] for y in range(9)]): # rows and columns
        b0x, b0y = 3 * (i // 3), 3 * (j // 3) # upper-left-most coordinates of this cell's box
        for y in range(b0y, b0y + 3): # iterate through the box and return False if e is in it
            for x in range(b0x, b0x + 3):
                if p.board[y][x] == e:
                    return False
        return True
    return False

def restrict(p, i, j, e, s): # take an element e, add it to a set of restrictions associated with a specific coordinate
    l = set()
    for x in range(9):
        if p.board[j][x] == 0: # unassigned in the row
            s[(x, j)].add(e) # add e to this cell's set of restrictions
            l.add((x, j))
            
    for y in range(9):
        if p.board[y][i] == 0: # unassigned in the column
            s[(i, y)].add(e)
            l.add((i, y))
            
    b0x, b0y = 3 * (i // 3), 3 * (j // 3)
    for y in range(b0y, b0y + 3):
        for x in range(b0x, b0x + 3):
            if p.board[y][x] == 0: # all unassigned in box
                s[(x, y)].add(e)
                l.add((x, y))
    return l

def backtracking_search_MRV(p):
    
    def backtrack(p, dom, s):
        os.system('clear')
        p.pprint()
        print(dom)
        time.sleep(0.05)

        if p.checkPuzzle():
            return True
        
        i, j = findEmptyCell(p)
        
        for n in (dom - s[(i, j)]): # we want to check values in the domain which have not been restricted at this cell
            if isValidDigit(p, i, j, n):
                p.board[j][i] = n
                l = restrict(p, i, j, n, s)
                #print(f"({i}, {j}) : {dom - s[(i, j)]}")
                if backtrack(p, dom, s):
                    return True

                for x in l: # add n back into the domain; i.e. remove it from set of restrictions
                    s[x] -= {n}
                
                p.board[j][i] = 0

        return False
    
    s = {}
    for j in range(9):
        for i in range(9):
            s[(i, j)] = set()

    if backtrack(p, {x for x in range(1, 10)}, s): # start with a full domain and 0 restrictions
        return p

def main():
    
    filename = sys.argv[1]
    solved = False

    try:
        file = open(filename, "r")
    except:
        raise Exception("File not found")
    
    input = pd.read_csv(file, header = None)
    
    p = Puzzle([[(lambda y: int(y) if y != 'X' else 0)(x) for x in input.T[col]] for col in range(9)])
    copy = Puzzle([[(lambda y: int(y) if y != 'X' else 0)(x) for x in input.T[col]] for col in range(9)])
        
    solved = backtracking_search_MRV(p)
    p.pprint()
    if solved:
        print("SOLVED!")

if __name__ == "__main__":
    main()