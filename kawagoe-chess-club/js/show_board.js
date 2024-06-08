import { Chessground } from './chessground.min.js';

// add the boards
const chessgrounds = document.getElementsByClassName("chessground");


Array.from(chessgrounds).forEach(c => {
    console.log("test");
    let dataFen = c.getAttribute("data-fen");
    console.log("dataFen", dataFen);
    let dataViewOnly = c.getAttribute("data-view-only");
    let boardId = c.getAttribute("id");
    const dataBoard = {fen: dataFen, viewOnly: dataViewOnly}
    const cb = Chessground(c, dataBoard);
    console.log("now adding the arrows");
    // add the arrows to the boards
    const arrowsDivs = document.getElementsByClassName("chess-arrow");
    let arrows = [];
    Array.from(arrowsDivs).forEach(c => {
	console.log("test2");
	const arrowBoardId = c.getAttribute("data-board-id");
	if(arrowBoardId == boardId) {
	    const board = document.getElementById(boardId);
	    const from = c.getAttribute("data-start");
	    const to = c.getAttribute("data-end");
	    console.log(from, to);
	    const arrow = {orig: from,
			   dest: to,
			   brush: 'green',
			   modifiers: {
			       hilite: true,
			   },};
	    //debugger;
	    arrows.push(arrow)
	}    
    });
    if(arrows.length > 0){

	cb.setAutoShapes(arrows);
    }
    const dotDivs = document.getElementsByClassName("chess-dot");
    let dots = [];
    Array.from(dotDivs).forEach(c => {
	const dotBoardId = c.getAttribute("data-board-id");
	if(dotBoardId == boardId) {
	    const board = document.getElementById(boardId);
	    const square = c.getAttribute("data-square");
	    const dot = {orig: square,
			 brush: "green",
			 modifiers: {
			     hilite: true,
			 },};
	    dots.push(dot)
	}
    });
    if(dots.length > 0) {
	console.log(dots);
	cb.setAutoShapes(dots);
    }
});
