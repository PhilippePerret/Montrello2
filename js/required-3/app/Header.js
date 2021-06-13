'use strict'
/*

  Pour gérer l'header
*/
class Header {

static setSpanTableau(state = true){
  this.spanTableau.classList[state?'remove':'add']('hidden')
}
  
static get obj(){
  return this._obj || (this._obj = DGet('header.main'))
}
static get spanTableau(){
  return this._spantab || (this._spantab = DGet('span#header-tableaux', this.obj))
}

}