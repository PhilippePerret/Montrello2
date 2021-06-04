'use strict'
/**
 * class Expection
 * ----------------
 * Pour toutes les attentes
 * 
 * Pour obtenir la liste "propre" de ces attentes, ouvrir un Terminal
 * au dossier de l'application et jouer 'bin/minitest-expectations'
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

/**
 * doc/
 * eq / not_eq
 *  expect(<sujet>).eq(<valeur>).else(<erreur>)
 * 
 *  Test de l'équalité entre +sujet+ et +valeur+
 * 
 *  Le test de la non égalité se fait avec #{'not_eq'.jaune}.
 * /doc
 */
eq(expected){
  return new ACase(this.sujet == expected, expected, /* actual = */ this.sujet)
}
not_eq(expected){
  return new ACase(this.sujet != expected, expected, /* actual = */ this.sujet)
}

/**
 * doc/
 * has / not_has
 *  expect(page).has(<selector>[,<attributs>]).else(<erreur>)
 * 
 *  Test de l'existence d'un élément dans la page, avec ou
 *  sans les attributs +attributs+.
 * 
 *  Exemple :
 * 
 *    expect(page)
 *      .has("div#mon-div", {class:'hidden'})
 *      .else("La page devrait contenir #expected")
 * 
 *  Le test de l'inexistence se fait avec #{'not_has'.jaune}
 * 
 * /doc
 */
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