'use strict'
/**
 * class Expection
 * ----------------
 * Pour les attentes des tests, par exemple :
 * 
 *    expect(maSomme).eq(12)
 * 
 * ou
 * 
 *    expect(page).has('div#mon-div')
 * 
 * 
 */

/**
 * La méthode qui permet d'instancier une expectation
 * 
 */
function expect(sujet){return new Expectation(sujet)}

class Expectation {

constructor(sujet){
  this.sujet = sujet
}

/**
 * --- LES MÉTHODES DE TEST ---
 * 
 */

eq(expected){
  return new ACase(this.sujet == expected, expected, /* actual = */ this.sujet)
}
not_eq(expected){
  return new ACase(this.sujet != expected, expected, /* actual = */ this.sujet)
}

has(expected, attrs){
  return new ACase(this.sujet.has(expected, attrs), expected, null)

}
not_has(expected, attrs){
  return new ACase(false == this.sujet.has(expected, attrs), expected, null)
}

}//Class Expectation

class ACase {
constructor(resultat, expected, actual){
  this.resultat = resultat
  this.expected = expected
  this.actual   = actual
}
else(failure_message){
  if ( this.resultat ) {
    /**
     * OK, tout est bon
     */
    return true
  } else {
    /**
     * === FAILURE ===
     */
    // Pour obtenir la ligne de l'erreur
    let stack = new Error().stack.split("\n")[1]
    let idx = stack.indexOf('js/MiniTests/') + 'js/MiniTests/'.length
    let lastIdx = stack.lastIndexOf(':')
    stack = stack.substring(idx, lastIdx)
    if ( this.actual )  failure_message = failure_message.replace(/\#actual/g, this.actual)
    if ( this.expected) failure_message = failure_message.replace(/\#expected/g, this.expected)
    throw `${failure_message}\n--> ${stack}`
  }
}
}