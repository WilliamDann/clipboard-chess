class Chessgame {
    constructor(fenString, whitePlayer, blackPlayer)
    {
        this.fenString = fenString;
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;

        this.chat = [];
    }
}
module.exports.Chessgame = Chessgame;

function generatorID() {
    return '7yxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
module.exports.generatorID = generatorID;