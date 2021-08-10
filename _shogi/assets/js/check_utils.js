function find_king(board, color) {
    var target_king = color == "sente"? "K": "k";
    for(var i = 0; i < 9; i++) {
	for(var j = 0; j < 9; j++) {
	    if(board[j][i] == target_king) {
		return([i, j]);
	    }
	}
    }
    return(null);
}

function find_checking_pieces(board, color) {
    var king_pos = find_king(board, color);
    var king_x = king_pos[0];
    var king_y = king_pos[1];
    var res = [];
    for(var i = 0; i < 9; i++) {
	for(var j = 0; j < 9; j++) {
	    var piece = board[j][i];
	    if(piece !=0 && get_color(piece) != color) {
		if(can_move(piece, i, j, king_x, king_y, board)) {
		    res.push([piece, i, j]);
		}
	    }
	}
    }
    return(res);
}

function is_check(board, color) {
    var king_pos = find_king(board, color);
    var king_x = king_pos[0];
    var king_y = king_pos[1];
    for(var i = 0; i < 9; i++) {
	for(var j = 0; j < 9; j++) {
	    var piece = board[j][i];
	    if(piece !=0 && get_color(piece) != color) {
		if(can_move(piece, i, j, king_x, king_y, board)) {
		    return(true);
		}
	    }
	}
    }
    return(false);
}

function calculate_direction(x1, y1, x2, y2) {
    var dx;
    var dy;
    if(x1 == x2) {
	dx = 0;
	dy = Math.sign(y2 - y1);
	return([dx, dy]);
    }

    if(y1 == y2) {
	dy = 0;
	dx = Math.sign(x2 - x1);
	return([dx, dy]);
    }
    dx = x2 - x1;
    dy = y2 - y1;
    if(Math.abs(dx) == Math.abs(dy)) {
	return([Math.sign(dx), Math.sign(dy)]);
    }
    return([dx, dy]);
}

function is_checkmate(board, color) {
    var checking_pieces = find_checking_pieces(board, color);
    if(checking_pieces.length == 0) {
	// no check, so no checkmate
	return(false);
    }
    if(checking_pieces.length == 1) {
	// check if the piece can be captured
	var checking_piece = checking_pieces[0][0];
	var checking_x = checking_pieces[0][1];
	var checking_y = checking_pieces[0][2];

	var king_pos = find_king(board, color);
	var king_x = king_pos[0];
	var king_y = king_pos[1];

	for(var i = 0; i < 9; i++) {
	    for(var j = 0; j < 9; j++) {
		var piece = board[j][i];
		if(piece !=0 && get_color(piece) == color) {
		    if(can_move(piece, i, j, checking_x, checking_y, board)) {
			return(false);
		    }
		}
	    }
	}
	// check if the check can be blocked
	// TODO: check blocks with drops
	var dir = calculate_direction(checking_x, checking_y, king_x, king_y);
	var tmp_square = Coord(checking_x + dir[0], checking_y + dir[1]);
	var final_coord = Coord(king_x, king_y);
	while(!tmp_square.equals(final_coord)) {
	    for(i = 0; i < 9; i++) {
		for(j = 0; j < 9; j++) {
		    piece = board[j][i];
		    if(piece !=0 && get_color(piece) == color && piece.toUpperCase() != "K") {
			if(can_move(piece, i, j, tmp_square.x, tmp_square.y, board)) {
			    return(false);
			}
		    }
		}
	    }
	}
	
    }
    // check whether the king can escape.
    var kings_possible_squares = list_legal_squares(king_x, king_y, board);
    for(var k = 0; k < kings_possible_squares.length; k++) {
	tmp_square = kings_possible_squares[k];
	    for(i = 0; i < 9; i++) {
		for(j = 0; j < 9; j++) {
		    piece = board[j][i];
		    if(piece !=0 && get_color(piece) == color) {
			if(can_move(piece, i, j, tmp_square[0], tmp_square[1], board)) {
			    return(false);
			}
		    }
		}
	    }
	
    }
    return(true);
}
