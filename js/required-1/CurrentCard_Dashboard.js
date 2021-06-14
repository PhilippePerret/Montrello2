'use strict'
/*

  Classe abstraite CurrentCard
  ----------------------------
  Une carte courante dans le dashboard
  C'est une classe abstraite dont vont hériter, normalement, les 
  classe RunningCard, OutOfDateCard et CloseToDateCard

*/
class CurrentCard {

constructor(carte){
  this.carte = carte
}

get obj(){return this._obj || this.build() }
set obj(v){this._obj = v}

build(){
  this.obj = DOM.clone('modeles currentcard')
  this.add_clone_original_carte()
  this.add_original_liste_name()
  this.observe()
  return this.obj
}
observe(){
  this.obj.addEventListener('click', this.onClickOnCard.bind(this))
}

/**
 * Méthode appelée quand on clique sur la carte
 * => on doit rejoindre l'original
 *
 * Rejoindre une carte consiste à :
 *  1. afficher son tableau
 *  2. la mettre en exergue (l'éditer ?) 
 */
onClickOnCard(ev){
  Tableau.current = this.carte.tableau
  this.carte.edit()
  return stopEvent(ev)
}


add_clone_original_carte(){
  const clonecard = this.carte.obj.cloneNode(true)
  DGet('action_buttons', clonecard).remove()
  DGet('originalcard', this.obj).replaceWith(clonecard)
}
add_original_liste_name(){
  DGet('listname', this.obj).innerHTML = this.listeName
}

get listeName(){
  return this._listname || ( this._listname = this.carte.parent.titre)
}
get tableauName(){
  return this._tabname || (this._tabname = this.carte.parent.parent.titre)
}
}