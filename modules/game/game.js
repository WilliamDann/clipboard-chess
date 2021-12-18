const { Chess } = require("chess.js");
const Watchable = require("../watchable/watchable");
const START_POS = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

class Game extends Watchable {
    constructor() {
        super('update');

        this.gameID = null;

        this.fenString   = START_POS;
        this.whitePlayer = null;
        this.blackPlayer = null;

        this.chat = [];
    }

    setPosition(fen) {
        const parser     = new Chess();
        const isValidFen = parser.load(fen);

        if (!isValidFen)
            return false;

        this.fenString = fen;
        return true;
    }

    addPlayer(playerName, white=true) {
        if (white)
            this.whitePlayer = playerName;
        else
            this.blackPlayer = playerName;
    }

    openSeats() {
        const seats = [];

        if (!this.whitePlayer)
            seats.push(true);
        if (!this.blackPlayer)
            seats.push(false);

        return seats;
    }

    move(moveString, playerName) {
        const parser     = new Chess(this.fenString);
        const legalMoves = parser.moves();

        if (parser.turn() == 'w') {
            if (playerName != this.whitePlayer)
                return false;
        }
        else
            if (playerName != this.blackPlayer)
                return false;

        const result = parser.move(moveString, {sloppy: true});
        if (!result)       
            return false;
        // because .move allows moves with check, we must make sure that the move was legal here
        if (legalMoves.indexOf(result.san) == -1)
            return false; 

        this.fenString = parser.fen();
        return true;
    }
} module.exports = Game;