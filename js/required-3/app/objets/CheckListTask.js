'use strict'

class CheckListTask extends MontrelloObjet {

static get dimType(){ return 'tk' }

/**
 * @return des données par défaut pour une nouvelle tâche
 * 
 */
static newItemDataFor(owner){
	return this.defaultItemData("Nouvelle tâche à exécuter", owner)
}

/**
 * @return liste des instances de tâches trouvées dans le 
 * container +container+
 * 
 */
static getIn(container){
	var l = []
	container.querySelectorAll('task').forEach(otask => {
		l.push(otask.object)
	})
	return l
}

// -----------------------------------------------------------------
// -----------------------------------------------------------------
// -----------------------------------------------------------------

constructor(data){
	super(data)
}

/**
 * @async
 * 
 * Produit une copie de la tâche (sans l'enregistrer et sans
 * la construire -- c'est le propriétaire qui le fera)
 * Note : on ne peut pas la construire car le propriétaire n'existe
 * peut-être pas encore.
 * 
 * Note : cette méthode sert à la gestion des modèles
 * 
 * @return L'instance de la tâche produite
 * 
 */
duplicateWith(hdata){
	var newData = Object.assign({}, this.data)
	Object.assign(newData, hdata)
	Object.assign(newData, {
			id: Montrello.getNewId('tk')
		, on: false
	})
	return new CheckListTask(newData)
}

// *** Propriétés ***

get data(){
	return this._data
}
set data(v){this._data = v}

// *** Construction et observation ***

build(){
	if ( false === super.build() ){
		console.log("super.build() a renvoyé false pour", this)
		return false
	}
	this.obj.object = this
	const cb_id = `${this.domId}-cb`
	this.checkbox 	= this.obj.querySelector('span.checkmark')
	this.checkbox.id = cb_id
	this.label = DGet('label[data-prop="ti"]', this.obj)
	this.label.setAttribute('for', cb_id)
	this.label.innerHTML = this.data.ti
	this.obj.setAttribute('data-task-id', this.id)
	this.parent.childrenContainer.appendChild(this.obj)

	return true
}

/**
 * Après la création de la tâche, il faut tout de suite la mettre
 * en édition.
 */
afterCreate(){
	// console.log("-> afterCreate", this)
	this.edit()
}

/**
	* Pour observer la tâche
	*
	*/
observe(){
	super.observe()
	this.setState()
	this.observe_case_a_cocher()
	this.observe_label_editable()	
}

observe_case_a_cocher(){
	this.checkbox.addEventListener('click', this.onClickCheckTask.bind(this))
}
observe_label_editable(){
	this.label.addEventListener('click', this.onClickCheckTask.bind(this))
	this.label.owner = this
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
		this.parent.updateDevJauge()
	}
}

setState(chk){
	if (undefined == chk) chk = this.data.on
	this.checkbox.classList[chk?'add':'remove']('checked')
	// this.li.classList[chk?'add':'remove']('checked')
	this.obj.classList[chk?'add':'remove']('checked')
}

edit(){
	MiniEditor.edit(this.label)
}

/**
 * Méthode appelée quand on veut détruire la tâche
 * Cette destruction implique :
 * 	- l'enregistrement de la checklist parente pour tenir compte de
 * 		la nouvelle liste.
 *  - l'actualisation de la jauge dans la carte éditée
 * 	- l'actualisation de la jauge dans la carte sur le bureau
 * 	- actualiser les infos générales sur Montrello
 * 	- la destruction de l'objet de la tâche dans la carte éditée
 */
afterDestroy(){
	console.warn("Il faut poursuivre la destruction de la tâche")
}

get checked(){ return this.data.on === true }

}//class CheckListTask
Object.assign(CheckListTask.prototype, TOMiniMethods)
Object.assign(CheckListTask.prototype, UniversalHelpersMethods)
Object.defineProperties(CheckListTask.prototype, TOMiniProperties)
