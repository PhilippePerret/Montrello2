'use strict'
class Liste extends MontrelloObjet {

/**
 * Créer une liste pour le tableau courant
 *
 */
static create(element){
	this.createItemFor(element.owner)
}

static initNewItemFor(owner){
	return new Liste({
			owner:owner
		, ti:"Nouvelle liste"
		, ct:'tb'
		, ty:'li'
		, ow:owner.ref
		, id:Montrello.getNewId('li')})
}

static get ownerClass(){return Tableau}


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
	if (!this.owner){
		return erreur("Désolé, mais le tableau propriétaire de la liste "+this.titre+" est introuvable… Nous ne pouvons pas construire cette liste.")
	}
	this.obj = DOM.clone('modeles liste')
	this.obj.id = this.domId
	DGet('items.listes', this.owner.obj).appendChild(this.obj)
	this.setCommonDisplayedProperties()
}

observe(){
	this.obj.owner = this
	UI.setEditableIn(this.obj)	
	// La liste des cartes doit être sortable
	$(this.obj.querySelector('content > items')).sortable({
		axis:'y'
	})
	this.btnKill.addEventListener('click', this.onClickKillButton.bind(this))
}

/**
 * @async
 * 
 * Méthode détruisant la liste
 *
 * Cela consiste à :
 * 	- détruire toutes les cartes de la liste
 * 	- détruire l'objet DOM
 * 	- détruire l'instance dans le constructeur
 * 	- détruire le fichier yaml 
 */
async destroy(){
	this.obj.remove()
	this.constructor.removeItem(this)
	await this.destroyYamlFile()
}

/**
 * Méthode appelée quand on clique sur le bouton (croix) permettant
 * de détruire la liste
 */
onClickKillButton(ev){
	this.destroy()
}

get btnKill(){
	return this._btnkill || (this._btnkill = DGet('header .btn-kill', this.obj))
}

}// class Liste

Object.assign(Liste.prototype, TOMiniMethods)
Object.defineProperties(Liste.prototype, TOMiniProperties)