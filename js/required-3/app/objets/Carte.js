'use strict'
class Carte extends MontrelloObjet {

static get dimType(){ return 'ca' }

static newItemDataFor(owner){
	return this.defaultItemData('Nouvelle carte', owner)
}

constructor(data){
	// console.log("data initialisation de la carte :", data)
	super(data)
}

get ref(){return `${this.ty}-${this.id}`}

// Appelée après la création de l'objet
afterCreate(){
	this.editTitle()
}

afterDestroy(){
	// Si la carte était en édition, il faut aussi détruire son 
	// formulaire
	this.form && this.form.remove()
}

build(){
	if ( false === super.build() ) return false
	// Les tags
	PickerTags.drawTagsIn(this)
	// La Jauge d'avancée
	DevJauge.setIn(this)
	// Les dates
	if ( this.dates ) {
		var compDate = new ComplexeDate(this.dates)
		this.obj.querySelector('infosdate').innerHTML = compDate.asShortString
	}
	// Les Massets
	this.obj.querySelector('pictosmassets').innerHTML = this.massets.getPictos()
}

/**
 * Observation de la carte
 */
observe(){
	if ( undefined == this.obj ){  // erreur de construction
		console.error("Impossible d'observer la carte %s : son objet n'a pas pu être construit", this.ref)
		return
	}
	super.observe()
	// Quand on clique sur la carte (n'importe où, on l'édite)
	this.obj.addEventListener('click', this.edit.bind(this))
}

/**
 * Pour éditer la carte
 * 
 * On place les checklists (children) dans le formulaire si elles
 * ne s'y trouvent pas déjà.
 */
edit(){
	this.form || (this.form = new CarteForm(this))
	this.form.open()
	if ( this.childrenContainer.children.length ) {
		Array.from(this.childrenContainer.children).forEach(cl => {
			this.form.checklistsContainer.appendChild(cl)
		})
	}
}

/**
	* Pour actualiser l'affichage de la carte
	*
	* ATTENTION : il s'agit vraiment et seulement de l'actualisation de
	* l'affichage et pas de l'enregistrement des nouvelles données.
	* 
	* TODO Ne faudrait-il pas traiter l'actualisation de la jauge ici
	* plutôt que dans CheckList ?
	* 
	*/
updateDisplay(hdata){
	hdata.ti 		&& this.setTitre(hdata.ti)
	hdata.tags 	&&	PickerTags.drawTagsIn(this)
}

/**
 * Méthode appelée après avoir créé une checklist à la carte
 * Il faut s'assurer que la jauge existe dans la carte.
 */
afterAddChild(){
	DevJauge.setIn(this)
}


get devjaugeElement(){
	return this._devjaug || (this._devjaug = DGet('devjauge', this.obj))
}

/**
 * ===============================================================
 * Méthodes répondant aux boutons du formulaire de carte
 */

 
copy(){
	erreur("Je ne sais pas encore copier la carte")
}

follow(){
	erreur("Je ne sais pas encore suivre une carte")
}

archive(){
	erreur("Je ne sais pas encore archiver une carte")
}

lock(){
	erreur("Je ne sais pas encore verrouiller une carte")
}

/**
 * /Fin des méthodes répondant aux boutons du formulaire de carte
 * =============================================================== */


}// class Carte
Object.assign(Carte.prototype, TOMiniMethods)
Object.assign(Carte.prototype, UniversalHelpersMethods)
Object.defineProperties(Carte.prototype, TOMiniProperties)