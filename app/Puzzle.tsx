'use client';

import { useState, useEffect } from 'react';
import './Puzzle.css';
import { fetchBoard } from './import_board';
import Numpad from './NumberButtons';

type Puzzle = {
  board: [string, boolean, boolean][][], // string: value, boolean: whether this digit was given
  isSelected: [number, number],
  cellCandidateMode: boolean,
  cellCandidates: string[][]
} 

function cmp(a: [number, number], b: [number, number]): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export function Puzzle() {

  const [state, setState] = useState<Puzzle>({ // bloated mess
    board: Array(9).fill(Array(9).fill([' ', false, false])),
    isSelected: [-1, -1],
    cellCandidateMode: false,
    cellCandidates: Array.from(Array(9), () => {return new Array(9).fill('')})

  });
  // We will need to create a selectable list of boards and pass them in here

  useEffect(() => { // ChatGPT told me how to use useEffect
    const fetchPuzzle = async () => {
      try {
        const board: [string, boolean, boolean][][] = await fetchBoard();
        setState({...state, board: board});
      } catch (err) {
        console.error('Error fetching board:', err);
      }
    }
    fetchPuzzle();
  }, [])

  function Cell({ value, position }: { value: string, position: [number, number] }) {

    const [hState, setHState] = useState(false);
//    const [boxCandidates, setBoxCandidates] = useState<number[]>([]);

    function handleCellSelect() {
      if (!cmp(state.isSelected, position)) {
        setState({...state, isSelected: position});
      } else {
        setState({...state, isSelected: [-1, -1]});
      }
    }

    return (
      <button className={'square ' 
        + (state.board[position[1]][position[0]][1] ? 'square-given ' : '')
        + (hState ? 'square-highlight ' : '') 
        + (cmp(state.isSelected, position) ? 'square-selected ' : '')
        + (state.board[position[1]][position[0]][2] ? 'square-cell-candidate' : '')
      }
      onMouseEnter={() => setHState(true)}
      onMouseLeave={() => setHState(false)}
      onClick={handleCellSelect}>
        {(state.board[position[1]][position[0]][2] ? state.cellCandidates[position[1]][position[0]] : value)}
      </button>
    );
  }

  function Box({ box }: { box: number }) { // makes no sense

    function mapToBox(box: number) { // takes box number and returns array of 9 coordinates
      let a = [];
      for (let n = 0; n < 9; n++) {
        a.push([(n%3 + (box%3)*3), (Math.floor(n/3) + Math.floor(box/3)*3)])
      }
      return a;
    }

    let coords = mapToBox(box);

    return (
      <div className='box subbox'>
      <Cell value={state.board[coords[0][1]][coords[0][0]][0]} position={[coords[0][0], coords[0][1]]} />
      <Cell value={state.board[coords[1][1]][coords[1][0]][0]} position={[coords[1][0], coords[1][1]]} />
      <Cell value={state.board[coords[2][1]][coords[2][0]][0]} position={[coords[2][0], coords[2][1]]} />
      <Cell value={state.board[coords[3][1]][coords[3][0]][0]} position={[coords[3][0], coords[3][1]]} />
      <Cell value={state.board[coords[4][1]][coords[4][0]][0]} position={[coords[4][0], coords[4][1]]} />
      <Cell value={state.board[coords[5][1]][coords[5][0]][0]} position={[coords[5][0], coords[5][1]]} />
      <Cell value={state.board[coords[6][1]][coords[6][0]][0]} position={[coords[6][0], coords[6][1]]} />
      <Cell value={state.board[coords[7][1]][coords[7][0]][0]} position={[coords[7][0], coords[7][1]]} />
      <Cell value={state.board[coords[8][1]][coords[8][0]][0]} position={[coords[8][0], coords[8][1]]} />
      </div>                       
    );                             /* ^ always remember to <C-v>jjjjjjjjg<C-a> */
  }

  function handleInput(e: string): void {
    const xy = state.isSelected;
    const x = state.isSelected[0];
    const y = state.isSelected[1];

    if (cmp(xy, [-1, -1])) return;        // no cell selected
    if (state.board[y][x][1]) return;     // digit is not given

    try {
      const newBoard = state.board;
      console.log("cell candidate mode: ", state.cellCandidateMode)
      if (state.cellCandidateMode) {
        let newCandidates = state.cellCandidates;
        if (e === '') {                                               // we hit 'delete'
          console.log('delete hit')
          newCandidates[y][x] = newCandidates[y][x].slice(0, -1);
          setState({...state, cellCandidates: newCandidates});
          return
        }
        if (!newCandidates[y][x].includes(e)) {
          newBoard[y][x][2] = true;
          newCandidates[y][x] += e; // add candidate
          setState({...state, board: newBoard, cellCandidates: newCandidates});
          console.log('new candidate set: ', state.board[y][x][2]);
          return
        } else {
          return
        }
      }
      console.log("setting final digit")
      newBoard[y][x][2] = false;
      newBoard[y][x][0] = e;      // final input
      setState({...state, board: newBoard});
    } catch {
      return
    }

  }

  return(
    <div className="puzzle-parent">
      <div>
        <div className='box'>
          <Box box={0} />
          <Box box={1} />
          <Box box={2} />
        </div>
        <div className='box'>
          <Box box={3} />
          <Box box={4} />
          <Box box={5} />
        </div>
        <div className='box'>
          <Box box={6} />
          <Box box={7} />
          <Box box={8} />
        </div>
      </div>
      <Numpad handleNumberButtons={(e: string) => handleInput(e)}
        handleDelete={(e: string) => handleInput(e)}
        handleToggleCandidate={() => {setState({...state, cellCandidateMode: !state.cellCandidateMode})}} />
      {//    <div>
//      <NumberButtons handleClick={(e) => {handleInput(e)}} />
//      <DeleteButton handleClick={(e) => {handleInput(e)}} />
//      <ToggleCandidate handleClick={() => {setState({...state, cellCandidateMode: !state.cellCandidateMode})}} />
//    </div>
}
    </div>
  );

}
