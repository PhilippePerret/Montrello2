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

}// class Liste

Object.assign(Liste.prototype, TOMiniMethods)
Object.assign(Liste.prototype, UniversalHelpersMethods)
Object.defineProperties(Liste.prototype, TOMiniProperties)