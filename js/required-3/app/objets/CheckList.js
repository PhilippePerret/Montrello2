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
 * Appelée après la création de la liste, mais seulement si elle n'a
 * pas déjà des enfants (créée à partir d'un modèle)
 */
afterCreate(){
	this.hasChild() || this.createTask()
}

// *** Données et propriétés ***

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