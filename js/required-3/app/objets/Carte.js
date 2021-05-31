'use strict'
class Carte {

static get(item_id){ return this.items[item_id] }

// 
// Pour créer une nouvelle carte à la liste
// 
static create(element){
	// console.log("add carte pour", element, element.owner)
	const newItem = new this({
			ct: `#${element.owner.domId}`
		, id: Montrello.getNewId('ca')
		, ty:'ca'
		, ti: 'Nouvelle carte'
		, ow:element.owner.ref
		, objs: {}
	})
	newItem.build()
	newItem.save()
	newItem.editTitle()
	return newItem
}

static get ownerClass(){return Liste}


constructor(data){
	// console.log("data initialisation de la carte :", data)
	this.data = data
}

get ref(){return `${this.ty}-${this.id}`}

build(){
	// this.obj = document.querySelector(`${this.constname}#modele-${this.constname}`).cloneNode(/* deep = */ true)
	this.obj = DOM.clone('modeles carte#modele-carte')
	this.obj.id = this.domId
	this.obj.classList.remove('hidden')
	this.container.querySelector('content > items').appendChild(this.obj)
	this.obj.owner = this
	UI.setEditableIn(this.obj)
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

get massets(){
	return this._massets || (this._massets = new Massets(this))
}

/**
	* Pour actualiser l'affichage de la carte
	*
	* ATTENTION : il s'agit vraiment et seulement de l'actualisation de
	* l'affichage et pas de l'enregistrement des nouvelles données.
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