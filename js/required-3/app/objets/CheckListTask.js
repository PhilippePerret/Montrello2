'use strict'

class CheckListTask extends MontrelloObjet {

/**
	* Pour créer une nouvelle tâche dans +owner+
	*/
static createFor(owner){
	const newtask = new CheckListTask({
			owner:owner
		, ow:owner.ref
		, ty: 	'tk'
		, id: 	Montrello.getNewId('tk')
		, lab: 	"Nouvelle tâche"
		, on: 	false
	})
	newtask.build_and_observe()
	newtask.edit()
	owner.save()
	this.addItem(newtask)
}

constructor(data){
	super()
	data.owner && (this.checklist = data.owner)
	this._data = data /** Cf. l'explication dans CheckList */
}

/**
 * @async
 * 
 * Produit une copie de la tâche (en l'enregistrant, mais sans
 * la construire -- c'est le propriétaire qui le fera)
 * 
 * Note : cette méthode sert à la gestion des modèles
 * 
 * @return L'instance de la tâche produite
 * 
 */
async makeCopy(){
	var d = {}
	Object.assign(d, this._data)
	delete d.id
	Object.assign(d, {
			on: 		false
		, owner: 	undefined
		, ow: 		undefined
	})
	const newTask = await this.constructor.createNewItemWith(d)
	return newTask
}

// *** Propriétés ***

get data(){
	this.lab && (this._data.lab = this.lab.innerHTML)
	return this._data
}

// *** Construction et observation ***

build(){
	const o 	= DOM.clone('modeles task')
	const cb 	= o.querySelector('span.checkmark')
	const lab = o.querySelector('label')
	
	const o_id 	= `task-${this.id}`
	const cb_id = `${o_id}-cb`

	o.setAttribute('data-task-id', this.id)
	o.id 	= o_id
	o.classList.remove('hidden')
	cb.id = cb_id
	lab.setAttribute('for', cb_id)
	lab.innerHTML = this._data.lab

	// On met la tâche dans la liste
	this.checklist.ul.appendChild(o)

	// [1] Sert pour la méthode set() générale
	this.li = this.obj /* [1] */ = o
	this.btn_sup 	= o.querySelector('button.btn-sup')
	this.lab 			= lab
	this.cb 			= cb

	// On règle l'état
	this.setState()

}//build


/**
	* Pour observer la tâche
	*
	*/
observe(){
	this.cb.addEventListener('click', this.onClickCheckTask.bind(this))
	this.lab.addEventListener('click', this.onClickCheckTask.bind(this))
	this.btn_sup.addEventListener('click', this.onClickSupTask.bind(this))
	// Pour le label (éditable), il faut en plus indiquer le propriétaire
	this.lab.owner = this
}

onClickCheckTask(ev){
	if (ev.metaKey) {
		// <= 	La touche commande est appuyée
		//  =>	On doit éditer le texte
		this.edit()
	} else {
		const chk = !this.data.on
		this.setState(chk)
		this.set({on: chk})
		this.checklist.updateDevJauge()
	}
}

setState(chk){
	if (undefined == chk) chk = this.data.on
	this.cb.classList[chk?'add':'remove']('checked')
	this.li.classList[chk?'add':'remove']('checked')
}

edit(){
	MiniEditor.edit(this.lab)
}

/**
 * Méthode appelée quand on veut détruire la tâche
 * Cette destruction implique :
 * 	- la destruction de son fichier dans les données enregistrées
 * 	- la suppression dans la checklist parente
 * 	- l'enregistrement de la checklist parente pour tenir compte de
 * 		la nouvelle liste.
 *  - l'actualisation de la jauge dans la carte éditée
 * 	- l'actualisation de la jauge dans la carte sur le bureau
 * 	- la destruction de l'item dans le constructor (items)
 * 	- actualiser les infos générales sur Montrello
 * 	- la destruction de l'objet de la tâche dans la carte éditée
 */
onClickSupTask(ev){
	message("Destruction de la tâche en cours…")
	Ajax.send('remove.rb', {ref:{ty:'tk', id:this.id}})
	.then(this.checklist.removeTask.bind(this.checklist, this))
	.then(ret => {
		this.constructor.removeItem(this)
		this.obj.remove() // pour finir
		message("Tâche détruit avec succès", {keep:false})
	})
	.catch(console.error)
}

get checked(){ return this.data.on === true }

}//class CheckListTask
Object.assign(CheckListTask.prototype, TOMiniMethods)
Object.defineProperties(CheckListTask.prototype, TOMiniProperties)
