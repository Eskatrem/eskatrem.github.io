---
layout: page
title: Gold General
short_title: gold
page_number: 3
---
Teaching how the Gold general moves.

{% include shogiboard.html %}

<script src="assets/js/jquery.min.js"></script>
<script src="assets/js/pieces_utils.js"></script>
<script src="assets/js/shogi.js"></script>

<script>
	addUnmovablePieceToSquare(5, 5, "G");
	var legal_squares = list_legal_squares(5, 5, position.board);
	for(var i = 0; i < legal_squares.length; i++) {
		var square = legal_squares[i];
		var x = square[0];
		var y = square[1];
		addCircleToSquare(x, y);
	}
</script>
