'use strict'
class Liste extends MontrelloObjet {

static get dimType(){ return 'li' }

/**
 * @return les données par défaut d'une nouvelle liste
 * 
 */
static newItemDataFor(owner){
	return this.defaultItemData("Nouvelle liste", owner)
}

constructor(data){
	super(data)
}

/**
 * Appelée après la création de la liste
 */
afterCreate(){
  this.editTitle()
}

observe(){
	super.observe()
	// On doit pouvoir trier les cartes
	$(this.childrenContainer).sortable({axis:'y'})
}


}// class Liste

Object.assign(Liste.prototype, TOMiniMethods)
Object.defineProperties(Liste.prototype, TOMiniProperties)