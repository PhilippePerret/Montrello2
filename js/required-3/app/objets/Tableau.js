'use strict'
class Tableau {

/**
	* Retourne le tableau d'identifiant +item_id+
	*/
static get(item_id) { 
	this.items || (this.items = {})
	return this.items[item_id]
}

static get current(){ return this._current }

static set current(t){
	if ( this._current ) this._current.hide()
	this._current = t
	Montrello.setConfig({current_pannel_id: t.id})
	t.prepare()
}

/**
	* Méthode pour créer le premier tableau, au premier lancement de l'app
	*
	*/
static create(element){
	console.log("-> Création d'un nouveau tableau avec :", element)
	let pannel_name = ('string' == typeof(element)) ? element : "Nouveau tableau"
	this.current = new Tableau({ty:'tb',ti:pannel_name, id:Montrello.getNewId('tb')})
	this.current.save()
	this.current.editTitle()
	FeedableMenu.get('menu-tableaux').add(this.current)
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

constructor(data){
	this.data = data
}

afterSet(hdata){
	if (hdata.ti){ 
		this.spanName.innerHTML = this.titre
		// TODO Changer le nom dans le menu des titres
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


get ref(){return `${this.ty}-${this.id}`}

show(){ this.obj.classList.remove('hidden')}
hide(){ this.obj.classList.add('hidden')}

build_and_observe(){
	this.build()
	this.observe()
}

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