---
layout: page
title: Lance
short_title: lance
page_number: 5
next_page_number: 6
---
In shogi, the lance is a weaker version of the chess rook, as it can only move vertically forward.
{% include shogiboard.html %}

<script src="assets/js/jquery.min.js"></script>
<script src="assets/js/pieces_utils.js"></script>
<script src="assets/js/shogi.js"></script>

<script>
	addUnmovablePieceToSquare(5, 5, "L");
	var legal_squares = list_legal_squares(5, 5, position.board);
	for(var i = 0; i < legal_squares.length; i++) {
		var square = legal_squares[i];
		var x = square[0];
		var y = square[1];
		addCircleToSquare(x, y);
	}
</script>
