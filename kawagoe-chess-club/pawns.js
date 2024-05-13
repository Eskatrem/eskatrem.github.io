      import { Chessground } from './node_modules/chessground/dist/chessground.js';
      Chessground(document.getElementById('board-1'), {
	fen: '8/8/8/8/8/8/3P4/8 b - - 2 25',  
	viewOnly: true,
        drawable: {
          autoShapes: [
             {
              orig: 'd3',
              brush: 'green',
              //label: { text: 'A' },
              modifiers: {
                hilite: true,
              },
            },
            {
              orig: 'd4',
              brush: 'green',
              //label: { text: 'B' },
              modifiers: {
                lineWidth: 6,
              },
            },
          ],
        },
      });

      Chessground(document.getElementById('board-2'), {
	fen: '8/8/8/8/8/3P4/8/8 b - - 2 25',  
	viewOnly: true,
        drawable: {
          autoShapes: [
             {
              orig: 'd4',
              brush: 'green',
              //label: { text: 'A' },
              modifiers: {
                hilite: true,
              },
            },
          ],
        },
      });

      Chessground(document.getElementById('board-3'), {
	fen: '8/8/8/8/2p1p3/3P4/8/8 b - - 2 25',  
	viewOnly: true,
        drawable: {
          autoShapes: [
             {
		 orig: 'd3',
		 dest: 'e4',
              brush: 'green',
              modifiers: {
                hilite: true,
              },
             },
             {
		 orig: 'd3',
		 dest: 'c4',
              brush: 'green',
              modifiers: {
                hilite: true,
              },
             },	      
          ],
        },
      });

      Chessground(document.getElementById('board-4'), {
	fen: '8/8/8/3pP3/8/8/8/8 b - - 2 25',  
	viewOnly: true,
        drawable: {
          autoShapes: [
             {
		 orig: 'e5',
		 dest: 'd6',
              brush: 'green',
              modifiers: {
                hilite: true,
              },
             },
          ],
        },
      });


