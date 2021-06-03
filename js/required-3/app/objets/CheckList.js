'use strict'
class CheckList extends MontrelloObjet {

/**
	* Création d'une check-list
	* (dans le formulaire de carte)
	*
	* Note : avant, le propriétaire de la checklist était le formulaire
	* d'édition de la carte, maintenant c'est la carte elle-même pour
	* simplifier les opérations.
	*
	*/
static createFor(owner){
	return this.createItemFor(owner.carte)
}

static initNewItemFor(owner){
	return new CheckList({
			ow: 		owner.ref
		, owner: 	owner
		, ty: 		'cl'
		, id: 		Montrello.getNewId('cl')
		, tasks:  []
	})
}

static get ownerClass(){ return Carte }

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

/**	
	* Retourne la liste des tâches DANS LES DONNÉES (*)
	*
	* (*) Pour obtenir la liste des tâches dans l'affichage, il faut
	*			impérativement utiliser la méthode getTaskListIds().
	*
	*/
get tasks(){ return this._data.tasks }
set tasks(v){this._data.tasks = v}

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
	const o = DOM.clone('modeles checklist')
	o.id = this.domId
	this.ul = o.querySelector('ul')

	this.btn_add = o.querySelector('button.btn-add')
	this.btn_sup = o.querySelector('button.btn-sup')
	this.btn_mod = o.querySelector('button.btn-to-modele') // => pour faire un modèle de liste

	this.obj = o

	/** Construction des tâches
		*	-----------------------
		* À la première construction, la check-list n'a pas de tâche. Mais
		* ensuite, elle en a et il faut les ajouter.
		*
		*/
	// console.log("this.tasks", this.tasks)
	if ( this.tasks.length ) {
		this.tasks.forEach(taskId => {
			const task = CheckListTask.get(taskId)
			task.checklist = this
			task.build_and_observe()
		})
	}

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

	// On rend la liste classable
	$(this.ul).sortable({
			axis:'y'
		, stop:this.onStopSorting.bind(this)
		, start:this.onStartSorting.bind(this)
	})

	// 
	// Bouton pour ajouter une tâche
	// 
	this.btn_add.addEventListener('click', this.onClickAddTask.bind(this))

	// 
	// Bouton pour supprimer la liste
	// 
	this.btn_sup.addEventListener('click', this.onClickRemoveList.bind(this))

	// 
	// Bouton pour transformer la liste en modèle de liste
	// 
	this.btn_mod.addEventListener('click', this.onClickMakeModele.bind(this))
}

onClickAddTask(ev){
	this.createTask()
}

onClickRemoveList(ev){
	message("Je dois détruire la liste de tâche")
}

onClickMakeModele(ev){
	message("Je dois faire un modèle de cette liste")
	// QUESTION Quid de si c'est déjà un modèle
	// On doit demander le nom du modèle
	// On doit enregistrer la checklist comme un modèle
	// Note : les modèles s'enregistrent comme les autres objets, avec un type ty, mais avec
	// le préfixe 'm-'
	// Donc 'm-cl' pour un modèle checklist
	const modele = MontrelloModele.createFrom(this)
	message("Modèle créé avec succès. Tu pourras l'utiliser avec la prochaine Checklist.")
	message("Cette liste a été associée à ce modèle")
}


updateDevJauge(){
	return // pour le moment ça ne va pas TODO à régler ensuite
	DevJauge.setIn(this)
	this.owner.form && DevJauge.setIn(this.owner.form)
}

/**
	* À l'instanciation de Montrello, associe la CheckList courante
	* à ses tâches
	*/
ownerise(){
	const my = this
	var newListTaskIds = [] // pour mettre la nouvelle liste, si elle a changé
	this.tasks.forEach(tkid => {
		const task = CheckListTask.get(tkid)
		if ( task ) {

			task.checklist = my
			newListTaskIds.push(tkid)

		} else {

			// La tâche n'existe plus
			console.log("[Erreur composition] La tâche %s n'existe plus. On retire son ID de la liste.", tkid)

		}
	})

	//
	// Si la liste a changé (suite à la destruction manuelle d'une
	// tâche par exemple), on doit la modifier.
	// 
	if ( this.tasks.length > newListTaskIds.length ) {
		this.tasks = newListTaskIds
	}

}

}
Object.assign(CheckList.prototype, TOMiniMethods)
Object.defineProperties(CheckList.prototype, TOMiniProperties)