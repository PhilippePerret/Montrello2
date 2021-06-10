'use strict'
class Tableau extends MontrelloObjet {

static get dimType(){ return 'tb' }

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


// Édite les préférences du panneau courant
static editPrefsCurrent(){
	message("Je ne sais pas encore éditer les préférences du panneau courant")
}

// Actualise la liste des tableaux
static updateFeedableMenu(){
	const fmenu = FeedableMenu.get('menu-tableaux')
	fmenu.update()
}
// (pour la feedable menu)
static onChooseItem(item){
	this.current = item // ça fait tout
}

// ========================== INSTANCE =============================

constructor(data){
	super(data)
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

/**
	* Construction du tableau (masqué, par défaut)
	*/
build(){
	this.obj = DOM.clone('modeles tableau', {id: this.domId})
	Tableau.container.appendChild(this.obj)
	this.hide()
}

/**
 * Méthode appelée après la destruction du tableau
 * 
 * On doit le supprimer du menu des tableaux
 * 
 */
afterDestroy(){

}

}
Object.assign(Tableau.prototype, TOMiniMethods)
Object.assign(Tableau.prototype, UniversalHelpersMethods)
Object.defineProperties(Tableau.prototype, TOMiniProperties)