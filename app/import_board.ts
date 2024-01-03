'use server';

import { readFileSync } from 'fs';

const tempPath = '/home/charles/dev/sudoku-app'

// b-b-but we have all these wonderful frameworks and libraries...
export async function fetchBoard(): Promise<[string, boolean, boolean][][]> { 
	
	const content: string = readFileSync(/*help*/`${tempPath}/public/boards/nyt-20240103-medium.csv`, 'utf8');
	const board: [string, boolean, boolean][][] = [];
	let i = 0;
	while (content[i] !== undefined) {
		let row: [string, boolean, boolean][] = [];
		while (content[i] !== '\n') {
			if (content[i] !== ',' && content[i] !== '\r') {
				if (content[i] === 'X') {
					row.push([' ', false, false]);
				} else {
					row.push([content[i], true, false]);
				}
			}
			i += 1;
		}
		board.push(row)
		i += 1;
	}

	return board
	
}
