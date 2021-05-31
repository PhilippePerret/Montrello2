'use strict'
class CheckList {

static get(item_id){ return this.items[item_id]}

/**
	* Création d'une check-list
	* (dans le formulaire de carte)
	*
	* Note : le propriétaire +owner+ est la CarteForm et doit le rester
	* pour écrire les éléments, etc. En revanche, c'est owner.carte qui
	* doit recevoir les modifications de données, selon le principe du
	* pipe.
	*
	*/
static createFor(owner){
	const clist = new CheckList({
			ow: 		null
		, owner: 	owner
		, ty: 		'cl'
		, id: 		Montrello.getNewId('cl')
		, tasks:  []
	})
	clist.build_and_observe()
	clist.createTask()
	clist.save()
	// On doit ajouter la liste à la carte
	owner.carte.addObjet(clist)
}

static get ownerClass(){ return Carte }

constructor(data){
	// console.log("Instanciation CheckList avec :", data)
	this._data = data /** Quand une donnée doit être modifiée dans les
											* données avant enregistrement, comme ici la
											* liste des tâches, on passe par cette formule
											* au lieu de this.data = data et on crée la
											* méthode get data(){...} qui retournera _data
											* modifié
											*/
}


// *** Données et propriétés ***

get data(){
	if (this.ul) this._data.tasks = this.getTaskListIds()
	return this._data
}

/**	
	* Retourne la liste des tâches DANS LES DONNÉES (*)
	*
	* (*) Pour obtenir la liste des tâches dans l'affichage, il faut
	*			impérativement utiliser la méthode getTaskListIds().
	*
	*/
get tasks(){ return this._data.tasks }

// Retourne la liste des identifiants de tâche
getTaskListIds(){
	let idlist = []
	this.ul.querySelectorAll('task').forEach(tk => {
		idlist.push(tk.getAttribute('data-task-id'))
	})
	return idlist
}

// *** Construction et observation ***

build_and_observe(){
	this.build()
	this.observe()
}

/**
	*	Construction de la checklist
	*
	* C'est un élément complexe de l'interface, avec beaucoup de 
	* veilleurs d'évènements.
	*
	*/
build(){
	const o = DOM.clone('modeles checklist')
	o.id = `checklist-${this.id}`
	this.ul = o.querySelector('ul')

	this.btn_add = o.querySelector('button.btn-add')
	this.btn_sup = o.querySelector('button.btn-sup')
	this.btn_mod = o.querySelector('button.btn-to-modele') // => pour faire un modèle de liste

	// On rend la liste classable
	$(this.ul).sortable({
			axis:'y'
		, stop:this.onStopSorting.bind(this)
		, start:this.onStartSorting.bind(this)
	})

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
	 	*/
	if (this.owner && this.owner.obj){ 
		this.owner.obj.querySelector('div#carte-taches-div > content').appendChild(o)
		o.classList.remove('hidden')
	} else {
		document.body.appendChild(o)
	}
}

/**
	* Appelée quand on termine de trier la liste des tâches
	*
	* À la fin du déplacement des tâches, on met en route un compte à 
	* rebours qui, s'il arrive à son termen, enregistre le nouveau
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
}

/**
	* Pour ajouter une tâche à la liste
	*
	*/
createTask(){
	CheckListTask.createFor(this)
	this.updateDevJauge()
}

updateDevJauge(){
	DevJauge.setIn(this)
	DevJauge.setIn(this.carte)
}

/**
	* À l'instanciation de Montrello, associe la CheckList courante
	* à ses tâches
	*/
ownerise(){
	const my = this
	this.tasks.forEach(tkid => CheckListTask.get(tkid).checklist = my)
}

}
Object.assign(CheckList.prototype, TOMiniMethods)
Object.defineProperties(CheckList.prototype, TOMiniProperties)