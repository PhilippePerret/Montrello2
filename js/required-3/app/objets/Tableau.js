'use strict'
class Tableau extends MontrelloObjet {

static get current(){ return this._current }

/**
 * Mettre le tableau +t+ en tableau courant
 * 
 * Note : cette procédure, contrairement à #setCurrent, enregistre
 * la configuration avec le nouveau tableau courant. Il ne faut donc
 * pas l'utiliser au chargement.
 * 
 */
static set current(t){
	if ( this._current ) this._current.hide()
	Montrello.setConfig({current_pannel_id: t.id})
	this.setCurrent(t)
}

static setCurrent(t){
	this._current = t
	t.prepare()
}

/**
	* Méthode pour créer le premier tableau, au premier lancement de l'app
	*
	*/
static create(element){
	// console.log("-> Création d'un nouveau tableau avec :", element)
	this.current = this.createNewItemWith(element)
	this.current.save()
	this.current.editTitle()
	this.addItem(this.current)
	FeedableMenu.get('menu-tableaux').add(this.current)
}

static createNewItemWith(element){
	let pannel_name = ('string' == typeof(element)) ? element : "Nouveau tableau"
	return new Tableau({
			ty: 'tb'
		,	ti: pannel_name
		, id: Montrello.getNewId('tb')
	})
}
/**
	* Le container <tableaux> contenant tous les tableaux
	*/
static get container(){
	return this._container || (this._container = DGet('tableaux'))
}

// Détruit le tableau courant
static destroyCurrent(){
	this.current.destroy()
}

// Édite les préférences du panneau courant
static editPrefsCurrent(){
	message("Je ne sais pas encore éditer les préférences du panneau courant")
}

// Actualise la liste des tableaux
static updateFeedableMenu(){
	const fmenu = FeedableMenu.get('menu-tableaux')
	fmenu.prepare()
}
// (pour la feedable menu)
static onChooseItem(item){
	this.current = item // ça fait tout
}

/**
 * Sert au reset de l'application
 * (pour les mini-tests par exemple)
 * 
 */
static eraseAll(){
	DGet('tableaux').innerHTML = ""
	// Le menu des tableaux courants (normalement, il n'y en a qu'un, mais bon…)
	const menuTableaux = DGet('menu#menu-tableaux')
	DGet('content', menuTableaux).querySelectorAll('ul.feeded-menu').forEach(ul => ul.remove())
	// On supprime tous les observers de ce menu en en faisant un clone
	UI.clone(menuTableaux)
	console.log("menuTableaux:", menuTableaux)
}

constructor(data){
	super()
	this.data = data
}

afterSet(hdata){
	if (hdata.ti){ 
		this.spanName.innerHTML = this.titre
		// On change le nom du tableau partout où il est affiché
		document.body.querySelectorAll(`.${this.ref}-name`).forEach(o => o.innerHTML = this.titre)
	}
}

prepare(){
	this.spanName.innerHTML = this.titre
	this.spanName.owner = this
	this.obj || this.build_and_observe()
	this.show()
}

get spanName(){
	return this._spanName || (this._spanName = document.body.querySelector('span.pannel_name'))
}


// get ref(){return `${this.ty}-${this.id}`}

show(){ this.obj.classList.remove('hidden')}
hide(){ this.obj.classList.add('hidden')}

// build_and_observe(){
// 	this.build()
// 	this.observe()
// }

/**
	* Construction du tableau
	*/
build(){
	this.obj = DOM.clone('modeles tableau')
	this.obj.id = this.domId
	Tableau.container.appendChild(this.obj)
	this.obj.owner = this
	this.hide()
}

/**
	* Observe
	*/
observe(){

	/**
	 * Les objets doivent être éditable
	 */
	UI.setEditableIn(this.obj)

	/**	
	 	* La liste des listes doit être sortable
	 	*/
	$(this.obj.querySelector('items')).sortable({
			axis:'x'
		, items: '> liste'
		, activate: function(ev,ui){ui.helper.addClass('moved')}
		, deactivate: function(ev,ui){ui.item.removeClass('moved')}
	})
}

/**
	* Méthode pour détruire le tableau
	*/
destroy(){
	if(!confirm("Voulez-vous vraiment détruire ce tableau ET TOUTES SES LISTES ?")) return

}

}
Object.assign(Tableau.prototype, TOMiniMethods)
Object.defineProperties(Tableau.prototype, TOMiniProperties)