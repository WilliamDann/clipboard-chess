class Chessgame {
    constructor(fenString, whitePlayer, blackPlayer)
    {
        this.fenString = fenString;
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
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

//Do you want to use this? I did for another project.
/**
 * We should ask the user name and set the cookie to expires in 15 minutes.
 * If the user reload the page, it should show the message welcome the user back.
 * Cookies should be display on the page.
 * @param {*} user_name 
 * @param {*} u_value 
 * @param {*} minutes 
 */
 function settingCookies(user_name, u_value, minutes){

  let date = new Date();
date/setTimeout(date.getTime() + (minutes*60*60*1000));
let cookie_expires = "Cookie expires in " + date.toUTCString();
document.cookie = user_name + ", " + u_value + ". " + cookie_expires + ";path=/";

}
/**
* To get specific cookie from the cookie string
* @param {*} u_name 
* @returns 
*/
function getCookies(u_name){

  let name = u_name + ", ";
  let decodedCookies = decodeURIComponent(document.cookie);
  let decode_do = decodedCookies.split(';');

  for(let i = 0; i = decode_do.length; i++)
  {
      let c = decode_do[i];
      while(c.charAt(0) == ' '){
          c = c.substring(1);
      }

      if(c.indexOf(name) == 0) 
          return c.substring(name.length, c.length);
  }
  return;  
}

/**
* Check if the name is in the cookies.
*/
function ifCookieExists(){
  
  let user_input = getCookies("username");
  if(user_input != "") 
      document.getElementById('message').innerHTML = "Welcome back, " + user_input;
  else 
      document.getElementById('message').innerHTML = "Please enter your name and click send.";
}