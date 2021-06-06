'use strict'
class Carte extends MontrelloObjet {

/**
 * Pour créer une nouvelle carte dans la liste
 * 
 * @return L'instance de la carte créée
 */
static create(element){
	return this.createItemFor(element.owner)
}
static initNewItemFor(owner){
	return new this({
			ct: `#${owner.domId}`
		, ow: owner.ref
		, id: Montrello.getNewId('ca')
		, ty:'ca'
		, ti: 'Nouvelle carte'
		, objs: {}
	})
}

static get ownerClass(){return Liste}


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
	if ( ! this.container ) {
		/**
		 * Cela se produit lorsque la liste qui contient la carte (ou
		 * autre container) a été supprimer au niveau du fichier
		 * 
		 */
		 erreur("Une erreur est survenue avec la carte "+this.ref+". Consulter la console.")
		 console.error("Le container de la carte %s n'existe plus. Impossible de construire la carte.", this.ref)
		 console.error("La liste qui la contient a dû être détruite à la main…")
		 return
	}
	this.obj = DOM.clone('modeles carte#modele-carte')
	this.obj.id = this.domId
	this.obj.classList.remove('hidden')
	this.container.querySelector('content > items').appendChild(this.obj)
	this.setCommonDisplayedProperties()
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
	this.obj.owner = this
	UI.setEditableIn(this.obj)
}


get massets(){
	return this._massets || (this._massets = new Massets(this))
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
	if ( undefined == this.objs.cl || this.objs.cl.length == 0) return []
	let ts = []
	this.objs.cl.forEach(cl_id => {
		CheckList.get(cl_id).tasks.forEach(task_id => ts.push(CheckListTask.get(task_id)))
	})
	return ts
}

/**
	* Pour définir le propriétaire de ses éléments
	*/
ownerise(){
	const my = this
	// Les checklists (souvent une seule)
	if ( undefined == this.objs.cl || this.objs.cl.length == 0) return
	this.objs.cl.forEach(clid => CheckList.get(clid).carte = my)
}


}// class Carte
Object.assign(Carte.prototype, TOMiniMethods)
Object.defineProperties(Carte.prototype, TOMiniProperties)