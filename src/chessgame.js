class Chessgame {
    constructor(fenString, whitePlayer, blackPlayer)
    {
        this.fenString   = fenString;
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;

        this.chat             = [];
    }
}
module.exports = Chessgame;