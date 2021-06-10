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

/**
 * Pour actualiser la jauge
 */
updateDevJauge(){
	DevJauge.setIn(this)
}


}// class CheckList

Object.assign(CheckList.prototype, TOMiniMethods)
Object.assign(CheckList.prototype, UniversalHelpersMethods)
Object.defineProperties(CheckList.prototype, TOMiniProperties)