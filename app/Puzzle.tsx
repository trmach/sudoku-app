'use client';

import { useState, useEffect } from 'react';
import './Puzzle.css';
import fetchBoard from './import_board';

export default function Puzzle() {
	
	const [puzzleBoard, setPuzzleBoard] = useState(Array(9).fill(Array(9).fill(' ')));
	// We will need to create a selectable list of boards and pass them in here
	
	useEffect(() => { // ChatGPT told me how to use useEffect
		const fetchPuzzle = async () => {
			try {
				const board = await fetchBoard();
				setPuzzleBoard(board);
			} catch (err) {
				console.error('Error fetching board', err);
			}
		}
		fetchPuzzle();
	}, [])
	
	
	function Cell({ value }: { value: string }) {
		
		const [hState, setHState] = useState(false);
		const [selected, setSelected] = useState(false);
		return (
			<button
				className={'square ' + (hState ? 'square-highlight ' : '') + (selected ? 'square-selected' : '')}
				onMouseEnter={() => setHState(true)}
				onMouseLeave={() => setHState(false)}
				onClick={() => setSelected(!selected)}>
				{value}
				</button>
			);
	}

    function Box({ box }: { box: number }) {

		function mapToBox(box: number) { // takes box number and returns array of 9 coordinates
			let a = [];
			for (let n = 0; n < 9; n++) {
				a.push([(n%3 + (box%3)*3), (Math.floor(n/3) + Math.floor(box/3)*3)])
			}
			return a;
		}

		let coords = mapToBox(box);

		return (
			<>
			<div className='box subbox'>
				<Cell value={puzzleBoard[coords[0][1]][coords[0][0]]} />
				<Cell value={puzzleBoard[coords[1][1]][coords[1][0]]} />
				<Cell value={puzzleBoard[coords[2][1]][coords[2][0]]} />
				<Cell value={puzzleBoard[coords[3][1]][coords[3][0]]} />
				<Cell value={puzzleBoard[coords[4][1]][coords[4][0]]} />
				<Cell value={puzzleBoard[coords[5][1]][coords[5][0]]} />
				<Cell value={puzzleBoard[coords[6][1]][coords[6][0]]} />
				<Cell value={puzzleBoard[coords[7][1]][coords[7][0]]} />
				<Cell value={puzzleBoard[coords[8][1]][coords[8][0]]} />
			</div>
			
		</>
		);
	}
	
	return(
		<>
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
		</>
	);
	
}