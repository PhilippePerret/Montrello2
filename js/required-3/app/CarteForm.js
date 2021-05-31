'use strict'

class CarteForm {

/**
	* Méthode appelée quand on clique sur la carte dans sa liste
	* pour l'éditer
	*/
static edit(element){
	const carte = element.owner
	const cform = new this(carte.data)
	/** On met cette instance en instance courante pour les boutons
		*
		*/
	this.current = cform
	cform.carte = carte
	cform.build()
	cform.setOwner(carte)
	cform.edit(carte)
	UI.setEditableIn(cform.obj)
	cform.obj
		.querySelector('header > span.close-btn')
		.addEventListener('click', cform.close.bind(cform))
	// Mettre les tags
	PickerTags.drawTagsIn(cform)
}

constructor(data){
	this.data = data
}

/**
	* Quand on demande la référence au propriétaire dans l'éditeur de
	* carte, c'est la référence à la carte éditée qu'on renvoie.
	*/
get ref(){ return this.carte.ref }

/**
	*		*** Méthodes répondant aux boutons de la colonne droite
	*/ 

editMembers(){
	message("Je dois ajouter un membre")
}
addChecklist(bouton){
	CheckList.createFor(bouton.owner)
}

// Actualisation de la jauge de la carte et de la liste
updateDevJauge(checklist){
	DevJauge.setIn(this.carte)
}

addLien(btn, ev){
	Masset.create('url', this, btn)
}
addFileJoint(btn, ev){
	Masset.create('flj', this, btn)
}
addCommande(btn, ev){
	Masset.create('cmd', this, btn)
}
addFolder(btn, ev){
	Masset.create('fld', this, btn)
}

// Pas encore utilisé
addRule(){
	message("Je dois ajouter une règle pour cette carte")
}
/**
	****************************************************************/

afterSet(hdata){
	this.carte.updateDisplay(hdata)
	hdata.tags && PickerTags.drawTagsIn(this)
}

setOwner(owner){
	this.carte = owner
}

edit(carte){
	this.show()
	this.setValues()
}

/**
	*
	*	On place les valeurs de la carte dans le formulaire de carte
	*
	* - le titre (common display property)
	* - la description (common display property)
	*
	*/
setValues(){
	this.setCommonDisplayedProperties()
}

close(){ this.obj.remove()}

build(){
	const o = document.querySelector('carte_form').cloneNode(true)
	o.owner = this
	o.setAttribute('data-owner-ref', this.carte.ref)
	document.body.appendChild(o)
	$(o).draggable()
	this.obj = o
	this.buildObjets()
}

/**
	* Destruction de l'objet +objet+ qui peut être une checklist,
	* un Masset, etc.
	*
	* La destruction correspond à deux opérations :
	*		1. suppression de l'objet dans la carte éditée (this.carte)
	*		1. destruction du fichier de l'objet.
	*
	* Pour se faire, on envoie les informations par ajax
	*
	*/
removeObjets(objet){
	// 1. suppression de l'objet dans la carte
	let objs = this.carte.objs[objet.type]
	console.log("Les objets au départ : ", objs)
	let idx = objs.indexOf(objet.id)
	if ( idx < 0 ) {
		console.log("Objet à détruire :", objet)
		console.log("Carte contenant l'objet : ", this.carte)
		console.log("Objets de la carte : ", carte.objs)
		return erreur("Désolé, mais je ne trouve pas l'objet… (consulter la console)")
	} else {
		objs.splice(idx,1)
		this.carte.objs = objs
	}
	// 2. destruction de l'objet
	Ajax.send('remove.rb', {type:objet.type, id:objet.id})
	.then(ret => {
		// 3. Enregistrement de la carte
		this.carte.save()
		// 4. Destruction de l'objet dans le DOM
		objet.obj && objet.obj.remove()
	})
	.catch(ret => {
		console.error(ret.error)
		return erreur("Une erreur s'est produite. Consultez l'inspecteur.")
	})
}

/**
	* Construction des objets de la carte
	*
	* QUESTION Faudrait-il généraliser à tous les objets ?
	*/
buildObjets(){

	if (!this.carte.objs || Object.keys(this.carte.objs).length == 0){
		console.log("Aucun objet de carte à afficher")
		return
	}
	for(var otype in this.carte.objs) {
		const aryObjets = this.carte.objs[otype]
		// console.log("Afficher les objets de type %s :", otype, aryObjets)
		const classe = Montrello.type2class(otype)
		const conteneur = this.obj.querySelector(`content[data-type-objet="${otype}"]`)
		// console.log("Conteneur : ", conteneur)
		aryObjets.forEach(objet_id => {
			const objet = classe.get(objet_id)
			// console.log("objet = ", objet)
			objet.obj || objet.build_and_observe()
			conteneur.appendChild(objet.obj)
			if ( otype == 'ma' /* masset */){
				objet.obj.querySelectorAll('button').forEach(btn => btn.owner = this)
			}
			objet.show()
		})
	}
}
}
Object.assign(CarteForm.prototype, TOMiniMethods)
Object.defineProperties(CarteForm.prototype, TOMiniProperties)