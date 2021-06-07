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

build(){
	super.build()
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
	if ( undefined == this.obj ) return // erreur de construction
	super.observe()
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
	hdata.ti && this.setTitre(hdata.ti)
	hdata.tags &&	PickerTags.drawTagsIn(this)
}

/**
	* Retourne toutes les tâches de la carte
	* Attention : ici, il s'agit des instances CheckListTask
	*/
get tasks(){return this._tasks || (this._tasks = this.getAllTasks())}

getAllTasks(){
	if ( this.children.length == 0 ) return []
	let ts = []
	this.forEachChild(child => {
		ts += child.children
	})
	return ts
}


}// class Carte
Object.assign(Carte.prototype, TOMiniMethods)
Object.defineProperties(Carte.prototype, TOMiniProperties)