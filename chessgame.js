class Chessgame {
    constructor(fenString)
    {
        this.fenString = fenString;
    }
}

function generatorID() {
    return '7yxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
