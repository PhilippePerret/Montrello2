'use strict'
/**
 * Class Console
 * -------------
 * Gestion des sorties en console, notamment pour les messages en couleur
 * 
 */
function logRed(msg){Console.output(msg,{color:'red'})}
function logRouge(msg){return logRed(msg)}
function logGreen(msg){Console.output(msg,{color:'green'})}
function logVert(msg){return logGreen(msg)}
function logYellow(msg){Console.output(msg,{color:'yellow'})}
function logJaune(msg){return logYellow(msg)}
function logGrey(msg){Console.output(msg,{color:'grey'})}
function logGris(msg){return logGrey(msg)}
function logOrange(msg){Console.output(msg,{color:'orange'})}

function logBold(msg){Console.output(msg,{bold:true})}
function logRedBold(msg){Console.output(msg,{color:'red', bold:true})}
function logRougeGras(msg){return logRedBold(msg)}
function logGreenBold(msg){Console.output(msg,{color:'green', bold:true})}
function logVertGras(msg){return logGreenBold(msg)}
function logYellowBold(msg){Console.output(msg,{color:'yellow', bold:true})}
function logJauneGras(msg){return logYellowBold(msg)}
function logGreyBold(msg){Console.output(msg,{color:'grey', bold:true})}
function logGrisGras(msg){return logGreyBold(msg)}
function logOrangeBold(msg){Console.output(msg,{color:'orange', bold:true})}
function logOrangeGras(msg){logOrangeBold(msg)}

class Console {

/**
 * Écrit en console un texte formaté
 * 
 * +style+    Soit le string du style css à employer
 *            Soit une table définissant :
 *              :color    La couleur
 *              :align    L'alignement (left, right, center)
 *              :bold     La graisse (true)
 *              :left     La marge gauche (nombre de pixels)
 *              :right    La marge droite (nombre de pixels)
 * 
 */
static output(msg, style){
  if ( 'object' == typeof style){
    style =   (style.color  ? `color:${style.color};` : '')
            + (style.bold   ? `font-weight:bold;` : '')
            + (style.align  ? `text-align:${style.align};` : '')
            + (style.left   ? `margin-left:${style.left}px;` : '')
            + (style.right  ? `margin-right:${style.right}px;` : '')
  }
  var dlog = ['%c'+msg, style]
  this.isModeTest && store.addConsoleLine(dlog)
  console.log(...dlog)
}

static get isModeTest(){
  return this._is_mode_test || (this._is_mode_test = 'undefined' != typeof(MiniTest))
}
}