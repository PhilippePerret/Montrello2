'use strict'
class CheckList extends MontrelloObjet {

static get dimType(){ return 'cl' }


static newItemDataFor(owner){
	return this.defaultItemData("Nouvelle Checklist", owner)
}

constructor(data){
	super(data)
}

/**
 * Appelée après la création de la liste
 * 
 */
afterCreate(){
	this.createTask()
}

// *** Données et propriétés ***

get data(){
	if (this.childrenContainer) this._data.tasks = this.getTaskListIds()
	return this._data
}

set data(v){ this._data = v }


/**
 * Modélise la liste, c'est-à-dire la transforme en un modèle
 * qui sera utilisable par d'autres cartes
 * 
 * Note : chaque objet doit définir sa modélisation car elle dépend
 * beaucoup des objets qu'elle contient, comme ici les tâches
 * 
 * Attention : il ne faut pas confondre cette méthode avec la 
 * méthode qui enregistre l'objet en tant que modèle utilisable.
 * Cette méthode-ci retourne les données pour créer la copie.
 * 
 * @return L'instance CheckList de la nouvelle liste, enregistrée
 * 				 qu'il ne reste plus qu'à construire.
 */
async makeCopy(owner){
	var d = {}
	Object.assign(d, this.data)
	delete d.id
	// On doit faire une duplication des tâches
	let task_ids = []
	var copy
	this.tasks.forEach(taskid => {
		const task = CheckListTask.get(taskid)
		// copy = await task.makeCopy() // le texte initial
		await(copy = task.makeCopy())
		console.log("copy", copy)
		copy || raise("La copie doit être définie")
		task_ids.push(copy.id)
	})
	Object.assign(d, {
			owner: 	owner
		, ow: 		owner.ref
		, tasks: 	task_ids
	})
	return this.constructor.createNewItemWith(d)
}

/**
	* Pour ajouter une tâche à la liste
	*
	*/
createTask(){
	CheckListTask.createItemFor(this)
	this.updateDevJauge()
}

/**
 * @return la liste des tâches du checklist
 * 
 */
get tasks(){
	return this.data.cho || []
}

/**
 * Méthode appelée pour retirer la tâche +task+ de la liste des
 * tâches (et enregistrement de la nouvelle liste => méthode asynchrone
 * retournant la promesse)
 * 
 * Cette méthode actualise aussi la jauge associée à la liste.
 * 
 */
removeTask(task){
	var idx = this.tasks.indexOf(task.id)
	if (idx < 0) {
		return erreur("La tâche d'identifiant "+task.id+" est introuvable dans la liste "+this.tasks.join(', ')+"… Je dois renoncer à la suppression.")
	}
	this.data.cho.splice(idx,1)
	this.updateDevJauge()
	return this.saveAsync()
}


// Retourne la liste des identifiants de tâche dans l'ordre relevé
// dans la liste affichée
getTaskListIds(){
	let idlist = []
	this.childrenContainer.querySelectorAll('task').forEach(tk => {
		idlist.push(tk.getAttribute('data-task-id'))
	})
	return idlist
}

/**
 * Cette méthode surclasse la méthode générale car l'inscription de
 * la check list se fait dans le formulaire d'édition des cartes, pas
 * dans la carte elle-même. Donc, à la construction de la checklist,
 * il ne faut pas l'ajouter quelque part pour le moment.
 * Sauf si le formulaire de la carte existe déjà
 * 
 */
addInParent(){
	if ( this.parent instanceof Carte ){

		if ( this.parent.form ) {
		
			this.parent.form.checklistsContainer.appendChild(this.obj)
		
		}
	
	} else {
	
		return erreur("Je ne peux pas afficher les checklists en dehors du formulaire de carte.")
	
	}
}

/**
	* Appelée quand on termine de trier la liste des tâches
	*
	* À la fin du déplacement des tâches, on met en route un compte à 
	* rebours qui, s'il arrive à son terme, enregistre le nouveau
	* classement. Sinon, si on commence à déplacer un autre item (cf.
	* onStartSorting), ça interrompt le compte à rebours (pour ne pas
	* enregistrer plein de fois si plusieurs changements sont opérés)
	* 
	*/
onStopSorting(){
	this.timerSave = setTimeout(this.save.bind(this), 2500)
}
/**
	* Appelée quand on commence à trier les tâches
	*/
onStartSorting(){
	if ( this.timerSave ) {
		clearTimeout(this.timerSave)
		this.timerSave = null
	}
}

observe(){
	super.observe()
	// On rend la liste des tâches classable
	$(this.childrenContainer).sortable({
			axis:'y'
		, stop:this.onStopSorting.bind(this)
		, start:this.onStartSorting.bind(this)
	})

	// 
	// Bouton pour transformer la liste en modèle de liste
	// 
	this.btn_mod
}

updateDevJauge(){
	DevJauge.setIn(this)
}

}// class CheckList

Object.assign(CheckList.prototype, TOMiniMethods)
Object.assign(CheckList.prototype, UniversalHelpersMethods)
Object.defineProperties(CheckList.prototype, TOMiniProperties)