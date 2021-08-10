function add_2d(square, dir) {
    return([square[0] + dir[0], square[1] + dir[1]]);
}

function nothingBetween(coord1, coord2, position) {
    var dir = new Coord(Math.sign(coord2.x - coord1.x), Math.sign(coord2.y - coord1.y));
    var tmpCoord = coord1.add(dir);
    console.log("dir =", dir, ", coord1 =", coord1, ", coord2 =", coord2);
    while(!tmpCoord.equals(coord2)) {
	console.log("tmpCoord =", tmpCoord);
	var tmp_piece = position[tmpCoord.y][tmpCoord.x];
	console.log("tmp_piece =", tmp_piece);
	if(tmp_piece != 0) {
	    return(false);
	}
	tmpCoord = tmpCoord.add(dir);
    }
    return(true);
}

function get_color(piece) {
    if(piece == 0) {
	return(0);
    }
    if(piece.toUpperCase() == piece) {
	return("sente");
    } else {
	return("gote");
    }
}

function switch_color(piece) {
    if(piece.toUpperCase() == piece) {
	return(piece.toLowerCase());
    } else {
	return(piece.toUpperCase());
    }
}

function can_move(piece, init_x, init_y, new_x, new_y, position) {
    var dx = init_x - new_x;
    var dy = init_y - new_y;
    if(position[new_y][new_x] != 0) {
	var captured = position[new_y][new_x];
	if(get_color(piece) == get_color(captured)) {
	    return(false);
	}
    }
    console.log("dx =", dx, ", dy =", dy);
    if((dx == 0) && (dy == 0)) {
	return(false);
       }
    var adx = Math.abs(dx);
    var ady = Math.abs(dy);
    var res;
    console.log("checking piece:", piece);

    if(piece == "K") {
	res = (adx <= 1) && (ady <= 1) && (adx + ady >= 1);
	return(res);
    } else if(piece == "k") {
	res = (adx <= 1) && (ady <= 1) && (adx + ady >= 1);
	return(res);
    } else if(piece == "P") {
	return((dx == 0) && (dy == 1));
    } else if(piece == "p") {
	return((dx == 0) && (dy == -1));
    } else if(piece == "N") {
	return((dy == 2) && (adx == 1));
    } else if(piece == "n") {
	return((dy == -2) && (adx == 1));
    } else if(piece == "G" || piece == "PP" || piece == "PS" || piece == "PL" || piece == "PN") {
	return(((dy == 1) && (adx <= 1)) || ((adx == 1) && (dy == 0)) || ((dy == -1) && (dx == 0)));
    } else if(piece == "g" || piece == "pp" || piece == "ps" || piece == "pl" || piece == "pn") {
	return(((dy == -1) && (adx <= 1)) || ((adx == 1) && (dy == 0)) || ((dy == 1) && (dx == 0)));
    } else if(piece == "S") {
	return(((adx == 1) && (ady == 1)) || ((dx == 0) && (dy == 1)));
    } else if(piece == "s") {
	return(((adx == 1) && (ady == 1)) || ((dx == 0) && (dy == -1)));
    } else if(piece == "L") {
	console.log("dx =", dx,", dy =", dy);
	if((adx > 0) || (dy <= 0)) {
	    return(false);
	} else {
	    // checking that all the squares between (init_x, init_y) and (new_x, new_y) are empty
	    for(var i=1; i < (dy-1); i++) {
		var tmp = position[init_x][init_y + i];
		if(tmp != 0){
		    console.log("found an occupied square between init_square and destination square");
		    return(false);
		}
	    }
	    console.log("returning true...");
	    return(true);
	}
    } else if(piece == "l") {
	console.log("checking if l move is legal: dx =", dx, " dy =", dy);
	if((adx > 0) || (dy >= 0)) {
	    
	    return(false);
	   } else {
	       // checking that all the squares between (init_x, init_y) and (new_x, new_y) are empty
	       for(var i=1; i < (dy-1); i--) {
		   var tmp = position[init_x][init_y + i];
		   if(tmp != 0){
		       return(false);
		   }
	       }
	       return(true);
	   }
    } else if(piece == "R" || piece == "r") {
	if((dx != 0) && (dy != 0)) {
	    return(false);
	}
	// need to check the squares in between
	var no_piece_between = nothingBetween(new Coord(init_x, init_y), new Coord(new_x, new_y), position);
	console.log("no_piece_between =", no_piece_between);
	return(no_piece_between);
    } else if(piece == "B" || piece == "b") {
	if(adx != ady) {
	    return(false);
	}
	return(nothingBetween(new Coord(init_x, init_y), new Coord(new_x, new_y), position));
    } else if(piece == "PR" || piece == "pr") {
	return validate_promoted_rook_move(init_x, init_y, new_x, new_y, position);
    } else if(piece == "PB" || piece == "pb") {

    }
    
    console.log("outside the switch statement: piece =", piece);
    return(false);
 }


function validate_promoted_rook_move(init_x, init_y, new_x, new_y, position) {
    // assumes that (init_x, init_y) != (new_x, new_y)
    // and that there is no piece of the same color on (new_x, new_y)
    var dx = new_x - init_x;
    var dy = new_y - init_y;
    var adx = Math.abs(dx);
    var ady = Math.abs(dy);
    if(adx > 1 || ady > 1) {
	if(adx * ady > 0) {
	    return(false);
	} else {
	    // check that there is nothing between (init_x, init_y) and (new_x, new_y)
	    var no_piece_between = nothingBetween(new Coord(init_x, init_y), new Coord(new_x, new_y), position);
	    return(no_piece_between);
	}
    }
    return(adx <= 1 && ady <= 1);
}

function validate_promoted_bishop_move(init_x, init_y, new_x, new_y, position) {
    // assumes that (init_x, init_y) != (new_x, new_y)
    // and that there is no piece of the same color on (new_x, new_y)
    var dx = new_x - init_x;
    var dy = new_y - init_y;
    var adx = Math.abs(dx);
    var ady = Math.abs(dy);
    if(adx != ady) {
	// in this case, not a diagonal movement
	return(adx + ady == 1);
    }
    var no_piece_between = nothingBetween(new Coord(init_x, init_y), new Coord(new_x, new_y), position);
    return(no_piece_between);
}

function can_utsu(piece, i, j, position) {
    if(position[j][i] != 0) {
	// square not empty
	return(false);
    }
    if(piece == "P" || piece == "p") {
	// check for nifu...
	for(var k = 0; k < 9; k++) {
	    var tmp = position.get(i, k);
	    if(tmp == piece) {
		return(false);
	    }
	}
    }
    if(piece == "n" && j >= 7) {
	return(false);
    }
    if(piece == "N" && j <= 1) {
	return(false);
    }

    if(piece == "l" && j >= 8) {
	return(false);
    }

    if(piece == "L" && j <= 0) {
	return(false);
    }

    if(piece == "p" && j >= 8) {
	return(false);
    }

    if(piece == "P" && j <= 0) {
	return(false);
    }
    
    return(true);
}


function promotion_status(piece, row_start, row_end) {
    console.log("promotion_status: piece, row_end, row_start =", piece, ",", row_end, row_start);
    if(piece == "G" || piece == "g" || piece == "k" || piece == "K" || piece.length > 1) {
	return("no_promotion");
    }
    if(piece == "p" || piece == "l") {
	if(row_end == 0) {
	    return("mandatory");
	} else if(row_end <= 2) {
	    return("optional");
	} else {
	    return("no_promotion");
	}
    }
    if(piece == "P" || piece == "L") {
	if(row_end == 8) {
	    return("mandatory");
	} else if(row_end >= 5) {
	    return("optional");
	} else {
	    return("no_promotion");
	}
    }
    if(piece == "N") {
	if(row_end >= 7) {
	    return("mandatory");
	} else if(row_end == 5) {
	    return("optional");
	} else {
	    return("no_promotion");
	}
    }
    if(piece == "n") {
	if(row_end <= 1) {
	    return("mandatory");
	} else if(row_end == 2) {
	    return("optional");
	} else {
	    return("no_promotion");
	}
    }
    var color = get_color(piece);
    if(color == "sente" && (row_start <= 2 || row_end <= 2)) {
	return("optional");
    }
    if(color == "gote" && (row_start >= 6 || row_end >= 6)) {
	return("optional");
    }
    return("no_promotion");
}


function get_promoted_piece(piece) {
    if(piece.toUpperCase() == piece) {
	return("P" + piece);
    } else {
	return("p" + piece);
    }
}

function get_similar_piece(piece) {
    if(piece == "pp" || piece == "pn" || piece == "pl" || piece == "ps") {
	return("g");
    }
    if(piece == "PP" || piece == "PN" || piece == "PL" || piece == "PS") {
	return("G");
    }
    return(piece);
}

function in_board(square) {
    var x = square[0];
    var y = square[1];
    return(x > 0 && x < 9 && y > 0 && y < 9);
}

function is_valid_square(square, color, board) {
    console.log("square =", square);
    if(!in_board(square)) {
	return(false);
    }
    console.log("get_color(board[square[1]][square[0]]) =", get_color(board[square[1]][square[0]]));
    return(get_color(board[square[1]][square[0]]) != color);
}

function list_legal_pawn_moves(x, y, color, board) {
    var dir = color == "sente"? -1:1;
    var next_square = board[y + dir][x];
    if(next_square == 0 || get_color(next_square) != color) {
	return([[x, y + dir]]);
    } else {
	return([]);
    }
}

function list_legal_knight_moves(x, y, color, board) {
    var y_inc = color == "sente"? -2:2;
    var new_y = y + y_inc;
    var res = [];
    var new_xs = [x - 1, x + 1];
    for(var i = 0; i < new_xs.length; i++) {
	var new_x = new_xs[i];
	if(new_x > 0 && new_x <= 8) {
	    var tmp_piece = board[new_y][new_x];
	    if(tmp_piece == 0 || get_color(tmp_piece) != color) {
		res.push([new_x, new_y]);
	    }
	}
    }
    return(res);
}

function list_legal_lance_moves(x, y, color, board) {
    var y_inc = color == "sente"? -1: 1;
    var tmp_y = y + y_inc;
    var res = [];
    while(tmp_y >= 0 && tmp_y < 9 && board[tmp_y][x] == 0) {
	res.push([x, tmp_y]);
	tmp_y += y_inc;
    }
    if(tmp_y >= 0 && tmp_y < 9 && get_color(board[tmp_y][x]) != color) {
	res.push([x, tmp_y]);
    }
    return(res);
}

function list_legal_silver_moves(x, y, color, board) {
    var y_inc = color == "sente"? -1: 1;
    var square = [x, y];
    var res = [];
    var dirs = [[0, y_inc], [1, y_inc], [-1, y_inc], [1, -y_inc], [-1, -y_inc]];
    for(var i = 0; i < dirs.length; i++) {
	var dir = dirs[i];
	var tmp_square = add_2d(square, dir);
	if(is_valid_square(tmp_square, color, board)) {
	    res.push(tmp_square);
	}
    }
    return(res);
}

function list_legal_gold_moves(x, y, color, board) {
    var y_inc = color == "sente"? -1: 1;
    var square = [x, y];
    var res = [];
    var dirs = [[0, y_inc], [1, y_inc], [-1, y_inc], [1, 0], [-1, 0], [0, -y_inc]];
    for(var i = 0; i < dirs.length; i++) {
	var dir = dirs[i];
	var tmp_square = add_2d(square, dir);
	if(is_valid_square(tmp_square, color, board)) {
	    res.push(tmp_square);
	}
    }
    return(res);
}

function list_legal_king_moves(x, y, color, board) {
    console.log("x =", x, "y =",y);
    var square = [x, y];
    var res = [];
    var dirs = [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    for(var i = 0; i < dirs.length; i++) {
	var dir = dirs[i];
	console.log("dir:", dir);
	var tmp_square = add_2d(square, dir);
	if(is_valid_square(tmp_square, color, board)) {
	    res.push(tmp_square);
	}
    }
    return(res);
}

function extend_dir_from_square(square, dir, color, board) {
    var res = [];
    var tmp_square = add_2d(square, dir);
    while(in_board(tmp_square) && board[tmp_square[1]][tmp_square[0]] == 0) {
	res.push(tmp_square);
	tmp_square = add_2d(tmp_square, dir);
    }
    if(is_valid_square(tmp_square, color, board)) {
	res.push(tmp_square);
    }
    return(res);
}

function list_legal_bishop_moves(x, y, color, board) {
    var square = [x, y];
    var res = [];
    var dirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    for(var i = 0; i < dirs.length; i++) {
	var dir = dirs[i];
	var tmp = extend_dir_from_square(square, dir, color, board);
	res += tmp;
    }
    return(res);
}


function list_legal_rook_moves(x, y, color, board) {
    var square = [x, y];
    var res = [];
    var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for(var i = 0; i < dirs.length; i++) {
	var dir = dirs[i];
	var tmp = extend_dir_from_square(square, dir, color, board);
	res += tmp;
    }
    return(res);
}


function list_legal_promoted_bishop_moves(x, y, color, board) {
    var res = list_legal_bishop_moves(x, y, color, board);
    var square = [x, y];
    var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for(var i = 0; i < dirs.length; i++) {
	var dir = dirs[i];
	var tmp_square = add_2d(square, dir);
	if(is_valid_square(tmp_square, color, board)) {
	    res.push(tmp_square);
	}
    }
    return(res);
}


function list_legal_promoted_rook_moves(x, y, color, board) {
    var res = list_legal_rook_moves(x, y, color, board);
    var square = [x, y];
    var dirs = [[-1, -1], [1, 1], [1, -1], [-1, 1]];
    for(var i = 0; i < dirs.length; i++) {
	var dir = dirs[i];
	var tmp_square = add_2d(square, dir);
	if(is_valid_square(tmp_square, color, board)) {
	    res.push(tmp_square);
	}
    }
    return(res);
}


function list_legal_squares(x, y, board) {
    var piece = board[y][x];
    var color = get_color(piece);
    var similar_piece = get_similar_piece(piece).toUpperCase();
    switch(similar_piece) {
    case "P": return(list_legal_pawn_moves(x, y, color, board));
    case "N": return(list_legal_knight_moves(x, y, color, board));
    case "L": return(list_legal_lance_moves(x, y, color, board));
    case "S": return(list_legal_silver_moves(x, y, color, board));
    case "G": return(list_legal_gold_moves(x, y, color, board));
    case "K": return(list_legal_king_moves(x, y, color, board));
    case "B": return(list_legal_bishop_moves(x, y, color, board));
    case "R": return(list_legal_rook_moves(x, y, color, board));
    case "PB": return(list_legal_promoted_bishop_moves(x, y, color, board));
    case "PR": return(list_legal_promoted_rook_moves(x, y, color, board));
    }
    return([]);
}
