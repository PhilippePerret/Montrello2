'use strict'
class CheckList extends MontrelloObjet {

static get dimType(){ return 'cl' }


static newItemDataFor(owner){
	return this.defaultItemData("Nouvelle Checklist", owner)
}

constructor(data){
	super(data)
}

build(){
  super.build()
  if ( this.isModele ) {
    const cloche = this.obj.querySelector('buttons .cloche-modele')
    cloche.classList.remove('hidden')
    cloche.addEventListener('click', function(){message("Cette liste est un modèle.")})
    this.obj.querySelector('buttons button.btn-modelise').style.opacity = '0.2'
  } 
}

/**
 * Surclasse la méthode abstraite car pour les checklists, le parent
 * est la carte mais il faut l'afficher dans le formulaire d'édition
 * de la carte
 */
addInParent(){
  this.parent.form && this.parent.form.checklistsContainer.appendChild(this.obj)
  this.parent.addChildItem(this)
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