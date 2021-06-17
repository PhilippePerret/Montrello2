'use strict';
/**

Méthodes d'helper pour le gel 'simple'

oliste1       Objet DOM de la liste 1
oliste2       Objet DOM de la liste 2
ocarte1       Objet DOM de la carte 1 (de la liste 1)

*/
const HELPER = {}

Object.defineProperties(HELPER, {

  oliste1:{
    enumerable: true,
    get(){ return this._oliste1 || (this._oliste1 = DGet('liste#li-1'))}
  },

  oliste2:{
    enumerable: true,
    get(){ return this._oliste2 || (this._oliste2 = DGet('liste#li-2'))}
  },

  ocarte1:{
    enumerable: true,
    get(){return this._ocarte1 || (this._ocarte1 = DGet('carte#ca-1'))}
  },

  carte1: {
    get(){ return Carte.get(1) }
  }

})