'use strict'
/*
  class Dashboard
  ---------------

*/

class Dashboard {

static toggle(button, ev){
  this.current || this.prepareNewDashboard()
  const closeIt = this.current.isOpened
  this.current[closeIt?'hide':'show']()
  Tableau[`${closeIt?'show':'hide'}Current`]()
  return ev && stopEvent(ev)
}
static prepareNewDashboard(){
  this.current = new this()
  this.current.prepare()
}


show(){
  this.obj.classList.remove('hidden')
  Header.setSpanTableau(false)
}
hide(){
  this.obj.classList.add('hidden')
  Header.setSpanTableau(true)
}
get isOpened(){return false == this.obj.classList.contains('hidden')}

prepare(){

  // On teste l'état de chaque carte existante pour mettre de côté
  // celles qui sont en cours, en dépassement d'échéance ou à 
  // proximité d'échéance
  Carte.forEachItem(carte => {

    if ( carte.isRunning ) {

      this.listingRunningCards.addCard(carte)

    } else if ( carte.isOutOfDate ) {

      this.listingOutOfDateCards.addCard(carte)
    
    } else if ( carte.isCloseToDate ){
    
      this.listingCloseToDateCards.addCard(carte)
    
    }

  })
}

build(){

}

observe(){

}


get listingRunningCards(){
  return this._lstruncards || (this._lstruncards = new DBListingCard({id:'runningcards', cardsContainer: this.runningContainer}))
}
get listingOutOfDateCards(){
  return this._lstoutofdate || (this._lstoutofdate = new DBListingCard({id:'outofdate', cardsContainer: this.outOfDateContainer}))
}
get listingCloseToDateCards(){
  return this._lstclosedate || (this._lstclosedate = new DBListingCard({id:'closetodate', cardsContainer: this.closeToDateContainer}))
}

/**
 * === Les DOM Elements ===
 * 
 */

/**
 * @return Container des échéances proches
 */
get closeToDateContainer(){
  return this.getDom('close_to_date')
}
/**
 * @return Le container des échéances dépassées
 */
get outOfDateContainer(){
  return this.getDom('out_of_date')
}
/** 
 * @return le container des tâches courantes
 */
get runningContainer(){
  return this.getDom('running_cards')
}

getDom(dom_id){
  return this[`_${dom_id}`] || (this[`_${dom_id}`] = DGet(`#db_${dom_id}`, this.obj))
}

get obj(){return this._obj || (this._obj = DGet('dashboard#main'))}


} // class Dashboard