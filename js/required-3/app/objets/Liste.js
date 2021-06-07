'use strict'
class Liste extends MontrelloObjet {

static get dimType(){ return 'li' }

/**
 * Créer une liste pour le tableau courant
 *
 */
static createFor(element){
	this.createItemFor(element.owner)
}

static initNewItemFor(owner){
	return new Liste(this.defaultItemData("Nouvelle liste", owner))
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

build(){
	//
	// Par mesure de prudence, on doit s'assurer que le tableau proprié-
	// taire de cette liste existe toujours. Dans le cas contraire, on
	// refuse la construction.
	// 
	if (null == this.parent){
		return erreur("Désolé, mais le tableau propriétaire de la liste "+this.titre+" est introuvable… Nous ne pouvons pas construire cette liste.")
	}
	this.obj = DOM.clone('modeles liste')
	this.obj.id = this.domId
	this.addInParent()
	this.setCommonDisplayedProperties()
}

observe(){
	super.observe()
	// On doit pouvoir trier les cartes
	$(this.childrenContainer).sortable({axis:'y'})
}


}// class Liste

Object.assign(Liste.prototype, TOMiniMethods)
Object.defineProperties(Liste.prototype, TOMiniProperties)