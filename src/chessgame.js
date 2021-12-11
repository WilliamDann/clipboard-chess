class Chessgame {
    constructor()
    {
        this.fenString   = null;
        this.whitePlayer = null;
        this.blackPlayer = null;

        this.useClock    = false;
        this.whiteTime   = null;
        this.blackTime   = null;
        
        this.increment = 0;
        this.delay     = 0;

        this.chat        = [];
    }
}
module.exports.Chessgame = Chessgame;

const START_POS = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

function blankGame() {
    const game = new Chessgame()

    game.fenString = START_POS;

    return game;
} 
module.exports.blankGame = blankGame;

function timeControlGame(timeControl, increment, delay) {
    const game = blankGame();

    game.useClock = true;

    game.whiteTime   = timeControl;
    game.blackTime   = timeControl;

    game.increment = increment;
    game.delay     = delay;

    return game;
} 
module.exports.timeControlGame = timeControlGame;