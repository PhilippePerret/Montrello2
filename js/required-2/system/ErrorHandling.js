'use strict'
/** ---------------------------------------------------------------------
*   Gestion des erreurs
*
*** --------------------------------------------------------------------- */
// window.onerror = function(){
//   // __d()
//   console.trace()
//   console.error(arguments)
//   erreur("Une erreur est survenue. Merci de consulter la console.")
// }

/**
 * Génère en console un affichage humain du backtrace
 * 
 */
function stack(){
  let bt = new Error().stack
  bt = bt.split("\n")
  // On retire le premier qui est cette méthode
  bt.shift()
  bt.reverse()
  // On parcours chaque méthode pour retirer la colonne et isoler
  // la ligne si elles existent
  var i = 0, len, found ;
  for(len = bt.length; i < len; ++ i){
    var line = bt[i]
    if ( found = line.match(/^(.*?)@(.*?):([0-9]+):[0-9]+$/) ){
      var method    = found[1]
      var fullpath  = found[2]
      var dpath     = found[2].split('/')
      var file      = dpath.pop()
      var line_num  = found[3]
      line =  `${method}() in ${file}:${line_num} (${fullpath}:${line_num})`
    } else if ( found = line.match(/^(.*?)@(.*?)$/)) {
      line = `${found[1]}() in ${found[2]}`
    }
    bt[i] = "" + (i + 1) + ". " + line // + "\n\t" + bt[i]
  }
  console.warn(bt.join("\n"))
}