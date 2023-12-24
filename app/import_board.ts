'use server';

import { readFileSync } from 'fs';

const tempPath = '/home/charles/dev/sudoku-app'

// b-b-but we have all these wonderful frameworks and libraries...
export async function fetchBoard(): Promise<string[][]> { 
	
	const content: string = readFileSync(/*help*/`${tempPath}/public/boards/testcase1.csv`, 'utf8');
	const board: string[][] = [];
	let i = 0;
	while (content[i] !== undefined) {
		let row = [];
		while (content[i] !== '\n') {
			if (content[i] !== ',' && content[i] !== '\r') {
				if (content[i] === 'X') {
					row.push(' ');
				} else {
					row.push(content[i]);
				}
			}
			i += 1;
		}
		board.push(row)
		i += 1;
	}

	return board
	
}
