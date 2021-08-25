function Coord(x, y) {
    this.x = x;
    this.y = y;
}

Coord.prototype.add = function(other) {
    return(new Coord(this.x + other.x, this.y + other.y));
};

Coord.prototype.equals = function(other) {
    return(this.x == other.x && this.y == other.y);
};


var init_square;
var init_x;
var init_y;
var utsu_piece;
var position = {
    "board": [[0, 0, 0, 0, 0, 0, 0, 0, 0],
	      [0, 0, 0, 0, 0, 0, 0, 0, 0],
	      [0, 0, 0, 0, 0, 0, 0, 0, 0],
	      [0, 0, 0, 0, 0, 0, 0, 0, 0],
	      [0, 0, 0, 0, 0, 0, 0, 0, 0],
	      [0, 0, 0, 0, 0, 0, 0, 0, 0],
	      [0, 0, 0, 0, 0, 0, 0, 0, 0],
	      [0, 0, 0, 0, 0, 0, 0, 0, 0],
	      [0, 0, 0, 0, 0, 0, 0, 0, 0]],
    "to_drop": {
	"sente": {"p": 0, "l": 0, "n": 0, "s": 0, "g": 0, "b": 0, "r": 0},
	"gote": {"p": 0, "l": 0, "n": 0, "s": 0, "g": 0, "b": 0, "r": 0}
    }
};



function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    console.log("DRAG");
    console.log(ev.srcElement.parentNode);
    init_x = parseInt(ev.srcElement.parentNode.getAttribute("x"));
    init_y = parseInt(ev.srcElement.parentNode.getAttribute("y"));
    console.log("drag: init_x =", init_x, ", init_y =", init_y);
    ev.dataTransfer.setData("text", ev.target.id);
}


function drag_utsu(ev) {
    console.log("DRAG_UTSU");
    console.log(ev.srcElement.parentNode);
    init_x = null;
    init_y = null;
    utsu_piece = ev.target.id;
    // console.log("drag: init_x =", init_x, ", init_y =", init_y);
    ev.dataTransfer.setData("text", ev.target.id);
}

function print_board() {
    var board = position["board"];
    var tmp_line;
    for(var y = 0; y < 9; y++) {
	tmp_line = "";
	for(var x = 0; x < 9; x++) {
	    tmp_line += board[y][x];
	    tmp_line += "";
	}
	console.log(tmp_line);
    }
}

function execute_move(position, square_from, square_to, piece) {
    // if square from is null, then it's a drop
    if(square_from != null) {
	position["board"][square_from.y][square_from.x] = 0;
	var captured = position["board"][square_to.y][square_to.x];
	if(captured != 0) {
	    var captured_unpromoted = get_unpromoted_piece(captured);
	    var piece_kind = captured_unpromoted.toLowerCase();
	    position["to_drop"][color][piece_kind] += 1;
	}
	position["board"][square_to.y][square_to.x] = piece;
    } else {
	position["board"][square_to.y][square_to.x] = piece;
    }
}

function drop(ev, after_drop_callback) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var target = ev.target;
    console.log("target:");
    console.log(target);
    var capture = false;
    var captured_piece = 0;
    if(target.className != "square") {
	capture = true;
	target = target.parentElement;
    }
    var new_x = parseInt(target.getAttribute("x"));
    var new_y = parseInt(target.getAttribute("y"));
    var piece;
    console.log("piece = ", piece);
    var elt;
    var move_done = false;
    if(init_x == null) {
	// it's a drop
	piece = utsu_piece;
	console.log("utsu: utsu_piece =", utsu_piece);
	if(can_utsu(piece, new_x, new_y, position["board"])) {
	    position["board"][new_y][new_x] = piece;
	    elt = document.getElementById(data);
	    ev.target.appendChild(elt);
	    move_done = true;
	}
    } else {
	piece = position["board"][init_y][init_x];
	if(can_move(piece, init_x, init_y, new_x, new_y, position["board"])){
	    position["board"][init_y][init_x] = 0;
	    if(!capture) {
		position["board"][new_y][new_x] = piece;
		elt = document.getElementById(data);
		var promotion = promotion_status(piece, init_y, new_y);
		if(promotion == "optional") {
		    var promoted_piece = get_promoted_piece(piece);
		    var promoted_img = get_img_name(promoted_piece);
		    var piece_img = get_img_name(piece);
		    var promoted_html = '<img src="' + promoted_img+ '">';
		    var piece_html = '<img src="' + piece_img+ '">';
		    var promotion_yes = document.getElementById("promotion_yes");
		    promotion_yes.onclick = function() {
			position["board"][new_y][new_x] = promoted_piece;
			elt.src = promoted_img;
			$('#dialog').dialog('close');
		    };
		    $("#promotion_yes").html(promoted_html);
		    $("#promotion_no").html(piece_html);
		    $("#dialog").dialog("open");
		}
		ev.target.appendChild(elt);
		
	    } else {
		captured_piece = get_unpromoted_piece(position["board"][new_y][new_x]);
		target.children[0].remove();
		position["board"][new_y][new_x] = piece;
		elt = document.getElementById(data);
		target.appendChild(elt);
		// adding a piece to drop
		var color = get_color(piece);
		addPieceToDrop(switch_color(captured_piece), color);
	    }
	    move_done = true;
	}
    }
    // run the "after move" function here
    // if the move was made
    if(move_done) {
	after_drop_callback.call();
    }
}

function getSquare(i, j) {
    var square_id = "#square_" + j + "_" + i;
    return($(square_id));
}

function get_img_name(piece) {
    var color = piece.toUpperCase() == piece? "sente": "gote";
    var img_name = "assets/img/" + color + "/";
    var piece_cap = piece.toUpperCase();
    if(piece_cap=="K") {
	img_name += "king";
    } else if(piece_cap=="G") {
	img_name += "gold";
    } else if(piece_cap == "R") {
	img_name += "rook";
    } else if(piece_cap == "B") {
	img_name += "bishop";
    } else if(piece_cap == "S") {
	img_name += "silver";
    } else if(piece_cap == "N") {
	img_name += "knight";
    } else if(piece_cap == "L") {
	img_name += "lance";
    } else if(piece_cap == "P") {
	img_name += "pawn";
    } else if(piece_cap == "PR") {
	img_name += "promoted_rook";
    } else if(piece_cap == "PB") {
	img_name += "promoted_bishop";
    } else if(piece_cap == "PL") {
	img_name += "promoted_lance";
    } else if(piece_cap == "PN") {
	img_name += "promoted_knight";
    } else if(piece_cap == "PP") {
	img_name += "tokin";
    } else if(piece_cap == "PS") {
	img_name += "promoted_silver";
    }
    img_name += ".png";
    return(img_name);
}

function addPieceToSquare(i, j, piece) {
    var square = getSquare(i, j);
    var img_name = get_img_name(piece);
    var piece_id = piece + "_" + i + "_" + j;
    var square_height = square.height();
    var piece_html = '<img id="'+piece_id+'" src="' + img_name +'" draggable="true" ondragstart="drag(event)" max-width: 100% max-height: 100%>';
    square.prepend(piece_html);
    position["board"][j][i] = piece;
}

function addUnmovablePieceToSquare(i, j, piece) {
    var square = getSquare(i, j);
    var img_name = get_img_name(piece);
    var piece_id = piece + "_" + i + "_" + j;
    var square_height = square.height();
    var piece_html = '<img id="'+piece_id+'" src="' + img_name +'" draggable="false" max-width: 100% max-height: 100%>';
    square.prepend(piece_html);
    position["board"][j][i] = piece;
}

function addCircleToSquare(i, j) {
    var square = getSquare(i, j);
    var circle_html = '<div class="circle"></div>';
    square.prepend(circle_html);
}

function addPieceToDrop(piece) {
    var color = piece.toUpperCase() == piece? "sente": "gote";
    // var id_drop_zone = color == "sente"? "#sente_pieces": "#gote_pieces";
    // var div_pieces = $(id_drop_zone);
    var piece_common = piece.toLowerCase();
    var piece_id = piece;//switch_color(piece);
    var id_drop_zone = color + "_" + piece_common + "_drop";
    var img_name = get_img_name(piece);
    
    var count = position["to_drop"][color][piece_common];
    var count_id = color + "_" + piece + "_drop_count";
    if(count == 0) {
	// need to add the piece in the droppable pieces,
	// and set the available number to 1.
	var piece_html = '<img id="' + piece_id +'" src="' + img_name +'" draggable="true" ondragstart="drag_utsu(event)" width="32" height="38" style="float: up;">';
	$("#" + id_drop_zone).append(piece_html);
	var count_div = '<div id="' + count_id + '" style="text-align: center;">1</div>';
	$("#" + id_drop_zone).append(count_div);
    } else {
	// just increment the displayed number
	$("#" + count_id).html(count + 1);
    }
    // div_pieces.append(piece_html);
    position["to_drop"][color][piece_common] += 1;
}

function render_board(pieces) {
   var n = pieces.length;
   for(var i = 0; i < tmp; i++) {
       var piece_data = pieces[i];
       var piece = piece_data[0], x = piece_data[1], y = piece_data[2];
       addPieceToSquare(x, y, piece);
   }
}

function copy_board(board) {
    var new_board = [];
    for(var i = 0; i < 9; i++) {
	var tmp_row = [];
	for(var j = 0; j < 9; j++) {
	    tmp_row.push(board[i][j]);
	}
	new_board.push(tmp_row);
    }
    return(new_board);
}

function copy_position(position) {
    var new_board = copy_board(position["board"]);
    var new_position = {"board": new_board, to_drop: {"sente": [], "gote": []}};
    var keys = ["p", "l", "n", "s", "g", "b", "r"];
    var n_keys = 7; // keys.length
    for(var i = 0; i < n_keys; i++) {
	var key = keys[i];
	new_position["to_drop"]["sente"][key] = position["to_drop"]["sente"][key];
    }
    for(i = 0; i < n_keys; i++){
	key = keys[i];
	new_position["to_drop"]["gote"][key] = position["to_drop"]["gote"][key];
    }
    return(new_position);
}
