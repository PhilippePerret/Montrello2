'use strict'
class CheckList extends MontrelloObjet {

static get dimType(){ return 'cl' }


static newItemDataFor(owner){
	var d = this.defaultItemData("Nouvelle Checklist")
	Object.assign(d, {tasks:[]})
	return d
}

constructor(data){
	super(null) /** formule pour ne pas définir this.data dans 
								* MontrelloObjet
								*/
	// console.log("Instanciation CheckList avec :", data)
	this._data = data /** Quand une donnée doit être modifiée dans les
											* données avant enregistrement, comme ici la
											* liste des tâches, on passe par cette formule
											* au lieu de this.data = data et on crée la
											* méthode get data(){...} qui retournera _data
											* modifié
											*/
}

/**
 * Appelée après la création de la liste
 * 
 */
afterCreate(){
	this.createTask()
	this.owner.carte.addObjet(this)
}

// *** Données et propriétés ***

get data(){
	if (this.ul) this._data.tasks = this.getTaskListIds()
	return this._data
}


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
	CheckListTask.createFor(this)
	this.updateDevJauge()
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
	this._data_tasks.splice(idx,1)
	this.updateDevJauge()
	return this.saveAsync()
}


// Retourne la liste des identifiants de tâche dans l'ordre relevé
// dans la liste affichée
getTaskListIds(){
	let idlist = []
	this.ul.querySelectorAll('task').forEach(tk => {
		idlist.push(tk.getAttribute('data-task-id'))
	})
	return idlist
}

// *** Construction et observation ***

/**
	*	Construction de la checklist
	*
	* C'est un élément complexe de l'interface, avec beaucoup de 
	* veilleurs d'évènements.
	*
	*/
build(){
	const o = DOM.clone('modeles checklist', {id: this.domId})
	this.obj = o

	/** Le conteneur de la liste de tâche
		* ---------------------------------
	 	* Pour le moment, je fonctionne comme ça : si this.owner.obj existe
	 	* (i.e. si on appelle la création depuis une édition d'une carte)
	 	* alors on prend cet objet, sinon (i.e. on appelle la construction
	 	* depuis l'instanciation de l'application) alors on construit les
	 	* éléments dans le document. NON, pour le mmoment, on ne les
	 	* ajoute pas.
	 	* 
	 	* Note : maintenant, ici, +owner+ est une Carte. Il faut tester 
	 	* sa propriété @form pour savoir si elle est éditée
	 	*/
	if (this.owner && this.owner.form && this.owner.form.obj){ 
		this.owner.form.obj.querySelector('div#carte-taches-div > content').appendChild(o)
		o.classList.remove('hidden')
	} else {
		document.body.appendChild(o)
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
/**
	* Place les observeur d'évènement (de click principalement)
	*
	*/
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
	return // pour le moment ça ne va pas TODO à régler ensuite
	DevJauge.setIn(this)
	this.owner.form && DevJauge.setIn(this.owner.form)
}


}// class CheckList

Object.assign(CheckList.prototype, TOMiniMethods)
Object.assign(CheckList.prototype, UniversalHelpersMethods)
Object.defineProperties(CheckList.prototype, TOMiniProperties)