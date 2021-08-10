---
layout: page
title: Second Mating Problem
short_title: second_mate
page_number: 5
n_moves: 1
---
Now you must use the drop to mate!

{% include shogiboard.html %}

<script src="assets/js/jquery.min.js"></script>
<script src="assets/js/pieces_utils.js"></script>
<script src="assets/js/shogi.js"></script>

<script>
	addPieceToSquare(8, 0, "k");
	addPieceToSquare(8, 2, "K");
	addPieceToDrop("G", "sente");
	addPieceToDrop("S", "sente");
	addPieceToDrop("N", "sente");
	addPieceToDrop("g", "gote");
	addPieceToDrop("s", "gote");
</script>
