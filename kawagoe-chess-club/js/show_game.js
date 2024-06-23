import LichessPgnViewer from './lichess-pgn-viewer.min.js';


const lpv = LichessPgnViewer(domElement, {
    pgn: 'e4 c6 { I started to experiment with the Caro-Kann after Jacques explained a few things about this opening} d4 d5 Nc3 dxe4 Nxe4 Nf6 Ng5 h6 Ng5-f3 Bf5 Bd3 Bxd3 Qxd3 e6 Bf4 Bd6 Ne5 Qc7 0-0-0 Nbd7 Ngf3 Nh5 Qe3 f6 g4 Nxf4 Qxf4 fxe5 Qe4 0-0-0 dxe5 Bxe5 Rxd7 Bf4+ Rd2 e5 c3 Qa5 Rhd1 Qxa2 Nxe5 Bxd2+ Kc2 Bxc3 Qf5+ Kb8 Nd7+ Rxd7 Qxd7 Qxb2+ Kd3 Bf6 Ke3 Qe5+ Kf3 Rd8 0-1',
});

// lpv is an instance of PgnViewer , providing some utilities such as:
lpv.goTo('first');
lpv.goTo('next');
lpv.flip();
console.log(lpv.game);
// see more in pgnViewer.ts
