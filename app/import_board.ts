'use server';

import { readFileSync } from 'fs';

export default async function fetchBoard() { // b-b-but we have all these wonderful frameworks and libraries
	
	const content = readFileSync(`${__dirname}/boards/testcase4_solution.csv`, 'utf8');
	const board = [];
	let i = 0;
	while (content[i]) {
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