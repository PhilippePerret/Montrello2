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
 * greater_than / not_greater_than
 *  expect(<sujet>).greater_than(<valeur>).else([<erreur>])
 * 
 *  Produit un succès si <sujet> est plus grand que <valeur>, sinon,
 *  produit un échec.
 * 
 * /doc
 */
greater_than(expected){
  return new ACase(this.sujet > expected, expected, this.sujet, null, `#sujet devrait être plus grand que #expected`)
}
not_greater_than(expected){
  return new ACase(this.sujet <= expected, expected, this.sujet, null, `#sujet ne devrait pas être plus grand que #expected`)
}
/**
 * doc/
 * has / not_has (page)
 *  expect(page).has(<selector>[,<attributs>]).else("<erreur>")
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
 * 
 * doc/
 * has / not_has (Hash)
 *  expect(<hash>).has({<keys: values>}).else("<erreur>")
 * 
 *  Test l'existence d'une clé avec une valeur dans une table de
 *  hashage.
 * 
 *  Exemple :
 * 
 *    expect(hash)
 *      .has({cle: "ma valeur"})
 *      .else("La table hash devrait contenir la clé 'k' de valeur 'ma valeur'")
 * 
 *  Pour obtenir toute la table (attention aux gros objets)
 * 
 *    expect(hash)
 *      .has({cle:"ma valeur"})
 *      .else("La table #actual devrait contenir #expected")
 * 
 * /doc
 */
has(expected, attrs){
  var ok, motif, hsujet, hexpected ;
  if ( 'function' == typeof(this.sujet.has) ) {
    /**
     * La page
     */
    return new ACase(this.sujet.has(expected, attrs), expected, null)
  } else if (this.sujet instanceof HTMLElement) {
    /**
     * Un élément HTML
     */
     hsujet = this.sujet.tagName
     this.sujet.id && (hsujet += `#${this.sujet.id}`)
     ;(!this.sujet.id) && this.sujet.className && (hsujet += `.${this.sujet.className}`)
     return new ACase(HTML.has(this.sujet, expected, attrs), HTML.hsujet)
  } else {
    /**
     * Un Hash
     */
    [ok, motif] = this.hashContains(this.sujet, expected)
    return new ACase(ok, JSON.stringify(expected), JSON.stringify(this.sujet), motif)
  }
}
not_has(expected, attrs){
  return new ACase(false == this.sujet.has(expected, attrs), expected, null)
}

/**
 * doc/
 * responds_to / not_responds_to (class/object)
 * expect(<class|object>).responds_to("<method>").else("<error>")
 * 
 *  Test que la classe ou l'instance donnée en argument répond bien
 *  à la méthode <method>. Sinon produit le message <error> et un
 *  échec.
 * 
 *  Exemple :
 * 
 *    expect(MaClasse).responds_to("maMethode")
 *      .else("La classe #sujet devrait répondre à la méthode #expected")
 * 
 * /doc
 */
responds_to(method){
  const isClass = this.sujet.constructor.name == 'Function'
  var hsujet = isClass ? this.sujet.name : this.sujet.constructor.name ;
  return new ACase('function' == typeof(this.sujet[method]), method, hsujet)
}
not_responds_to(method){
  const isClass = this.sujet.constructor.name == 'Function'
  var hsujet = isClass ? this.sujet.name : this.sujet.constructor.name ;
  return new ACase('function' != typeof(this.sujet[method]), method, hsujet)
}
/**
 * ---------------------------------------------------------------
 *  Private methods
 */

/**
 * @return  [resultat, raison_echec_if_any]
 *          resultat est true si la table +hash+ contient toutes les
 *          clés/valeurs de hexpe
 */
hashContains(hash, hexpe){
  var raisons = [], actual
  for(var k in hexpe){
    if ( hash[k] != hexpe[k] ) {
      actual = (undefined === hash[k]) ? 'est indéfinie' : `vaut '${hash[k]}'` ;
      raisons.push(`la clé '${k}' devrait valoir '${hexpe[k]}', elle ${actual}`)
    }
  }
  let ok = raisons.length == 0
  if (raisons.length) {
    raisons = raisons.join(', ')
  } else {
    raisons = undefined 
  }
  return [ok, raisons]
}//hashContains

}//Class Expectation






class ACase {
constructor(resultat, expected, actual, motif, message_failure_default){
  this.resultat = resultat
  this.expected = expected
  this.actual   = actual
  this.motif    = motif
  this.message_failure_default = message_failure_default
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
    failure_message || (failure_message = message_failure_default)
    // Pour obtenir la ligne de l'erreur
    let stack = new Error().stack.split("\n")[1]
    let idx = stack.indexOf('js/MiniTests/') + 'js/MiniTests/'.length
    let lastIdx = stack.lastIndexOf(':')
    stack = stack.substring(idx, lastIdx)
    if ( this.actual ){
      failure_message = failure_message.replace(/\#actual/g, this.actual)
      failure_message = failure_message.replace(/\#sujet/g, this.actual)
    }
    if ( this.expected) failure_message = failure_message.replace(/\#expected/g, this.expected)
    if ( this.motif)    failure_message += "\nRaison : " + this.motif
    throw `${failure_message}\n--> ${stack}`
  }
}
}