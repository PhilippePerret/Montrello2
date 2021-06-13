'use strict'
/*
  class Dashboard

*/

class Dashboard {

static toggle(button, ev){
  this.current || this.prepareNewDashboard()
  const closeIt = this.current.isOpened
  this.current[closeIt?'hide':'show']()
  Tableau[`${closeIt?'show':'hide'}Current`]()
}
static prepareNewDashboard(){
  this.current = new this()
  this.current.prepare()
}


show(){
  this.obj.classList.remove('hidden')
}
hide(){
  this.obj.classList.add('hidden')
}
get isOpened(){return false == this.obj.classList.contains('hidden')}

prepare(){
  this.checkCurrentCartes()
}
build(){

}

observe(){

}

// On boucle sur toutes les cartes pour trouver les cartes courantes
checkCurrentCartes(){
  Carte.forEachItem(item => {
    if ( item.tags.indexOf(1) > -1 ) {
      this.addCurrentCarte(item)
    }
  })
}

addCurrentCarte(carte){
  const curcard = new CurrentCard(carte)
  const tableau = carte.tableau
  this.tableauContainer(tableau.id) || this.buildTableauContainerFor(carte)
  this.tableauContainer(tableau.id).appendChild(curcard.obj)
}

/**
 * Méthode retournant le container de tableau pour le tableau d'id
 * +tableau_id+
 * 
 */
tableauContainer(tableau_id){
  return DGet(`tableaucontainer#tbcont-${tableau_id}`, this.currentCardsContainer)
}

/**
 * Méthode pour construire le container correspondant au tableau
 * Rappel : toutes les cartes d'un même tableau sont rassemblées
 * dans le même container
 * 
 */
buildTableauContainerFor(carte){
  const tableau = carte.tableau
  const cont = DCreate('TABLEAUCONTAINER', {id:`tbcont-${tableau.id}`, 'data-tableau-id':tableau.id})
  const header = DCreate('HEADER')
  header.appendChild(DCreate('TITRE',{text:tableau.titre, class:'tableau-name'}))
  cont.appendChild(header)
  this.currentCardsContainer.appendChild(cont)
}

/**
 * === Les DOM Elements ===
 * 
 */
get obj(){return this._obj || (this._obj = DGet('dashboard#main'))}

get currentCardsContainer(){
  return this._curcarcont || (this._curcarcont = DGet('currentcards', this.obj))
}

} // class Dashboard