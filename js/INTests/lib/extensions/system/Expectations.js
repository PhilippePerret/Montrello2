'use strict'

Object.assign(Expectation.prototype, {

/**
 * doc/
 * has_child / not_has_child
 *  expect(<instance>).hasChild(<child>).else("<erreur>")
 * 
 *  Produit un succès si l'objet <instance> possède l'enfant <child>
 * 
 *  Par exemple :
 * 
 *    expect(Tableau.current).hasChild(laliste)
 *      .else() // message d'erreur par défaut
 * 
 * /doc
 */
hasChild(child){
  if ( 'function' == typeof this.sujet.hasChild ){
    return new ACase(this.sujet.hasChild(child), `enfant ${child.ref}`, `parent ${this.sujet.ref}`, null, 'Le #sujet devrait posséder l’#expected.')
  } else {
    throw "Le sujet fourni doit répondre à la méthode hasChild() pour utiliser cette expectation."
  }
}

})