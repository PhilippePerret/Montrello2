'use strict'
class Tableau extends MontrelloObjet {

static get dimType(){ return 'tb' }

static get current(){ return this._current }

/**
 * Les deux méthodes permettant de masquer tous les tableaux ou de
 * ré-afficher le courant, utile pour le tableau de bord
 * 
 */
static hideCurrent(){this.current.hide()}
static showCurrent(){this.current.show()}
/**
 * Mettre le tableau +t+ en tableau courant
 * 
 * Note : cette procédure, contrairement à #setCurrent, enregistre
 * la configuration avec le nouveau tableau courant. Il ne faut donc
 * pas l'utiliser au chargement.
 * 
 */
static set current(t){
	t instanceof Tableau || raise("Il faut une instance Tableau pour définir le tableau courant (set tableau::current")
	Dashboard.current.hide() // toujours
	if ( this._current ) this._current.hide()
	Montrello.setConfig({current_pannel_id: t.id}).then(this.setCurrent.bind(this, t))
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
	this.current.afterCreate()
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
	FeedableMenu.get('menu-tableaux').update(Montrello.config.tableaux_order)
}
// (pour le feedable menu)
static onChooseItem(item){
	this.current = item // ça fait tout
}

// (pour le feedable menu)
static saveOrder(orderedIds){
	Montrello.setConfig({tableaux_order: orderedIds})
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
	// stack()
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
 * Méthode appelée après la création du tableau
 * 
 */
afterCreate(){
	FeedableMenu.get('menu-tableaux').add(this)	
	// Cette méthode enregistre automatiquement le nouvel ordre des
	// éléments.
}

/**
 * Méthode appelée après la destruction du tableau
 * 
 * On doit le supprimer du menu des tableaux et de l'ordre enregistré
 * 
 */
afterDestroy(){
	FeedableMenu.get('menu-tableaux').remove(this)
	// Cette méthode enregistre automatiquement le nouvel ordre des
	// éléments.
}

}
Object.assign(Tableau.prototype, TOMiniMethods)
Object.assign(Tableau.prototype, UniversalHelpersMethods)
Object.defineProperties(Tableau.prototype, TOMiniProperties)