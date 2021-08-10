---
layout: page
title: Introduction
short_title: intro
page_number: 1
next_page_number: 2
---
Shogi is the Japanese version of chess. Similar to chess, each player has a set of various pieces, including a King, and, like in chess, the goal is to capture the opponent's king.

This is how the king looks like: <img src="assets/img/sente/king.png">.

And this is the starting position:

{% include shogiboard.html %}
<script src="assets/js/jquery.min.js"></script>
<script src="assets/js/pieces_utils.js"></script>
<script src="assets/js/shogi.js"></script>


<script>
for(var i = 0; i < 9; i++) {
	addPieceToSquare(i, 6, "P");
	addPieceToSquare(i, 2, "p");
}
addPieceToSquare(0, 8, "L");
addPieceToSquare(8, 8, "L");
addPieceToSquare(7, 8, "N");
addPieceToSquare(1, 8, "N");
addPieceToSquare(2, 8, "S");
addPieceToSquare(6, 8, "S");
addPieceToSquare(3, 8, "G");
addPieceToSquare(5, 8, "G");
addPieceToSquare(4, 8, "K");
addPieceToSquare(1, 7, "B");
addPieceToSquare(7, 7, "R");

addPieceToSquare(0, 0, "l");
addPieceToSquare(8, 0, "l");
addPieceToSquare(7, 0, "n");
addPieceToSquare(1, 0, "n");
addPieceToSquare(2, 0, "s");
addPieceToSquare(6, 0, "s");
addPieceToSquare(3, 0, "g");
addPieceToSquare(5, 0, "g");
addPieceToSquare(4, 0, "k");
addPieceToSquare(1, 1, "r");
addPieceToSquare(7, 1, "b");

</script>
This is how physical shogi pieces look like:

<img src="assets/img/shogi_photo.jpg">

Do you notice something about the pieces? They don't have a color! Instead, each piece is a pentagon whose tip is pointing towards the opponent.

There is a very good reason for that: unlike chess where captured pieces are dead, in shogi captured pieces can be reused: instead of playing a "normal" move, a player can use one of the pieces they have captured and put (drop) it on the board, as their piece (there are some restrictions on where a piece can be dropped, that will be covered later).



