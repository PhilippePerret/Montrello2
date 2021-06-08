'use strict'

class CarteForm {

constructor(carte){
	this.carte 	= carte
	this.data 	= carte.data
}

/**
 * Méthode appelée dès qu'il faut éditer la carte, que ce soit la 
 * première ou la nième fois.
 * 
 */
open(){
	this.obj || this.build_and_observe()
	this.show()
	this.positionne()
	this.setValues()
	this.constructor.current = this
}
positionne(){
	// On positionne toujours la fenêtre au milieu
	const rectO = this.obj.getBoundingClientRect()
	const margeTop 	= parseInt((Window.height - rectO.height)/2,10) - 10
	const margeLeft = parseInt((Window.width - rectO.width)/2,10)
	this.obj.style.top 	= px(margeTop)
	this.obj.style.left = px(margeLeft)
}

/**
	* Quand on demande la référence au propriétaire dans l'éditeur de
	* carte, c'est la référence à la carte éditée qu'on renvoie.
	*/
get ref(){ return this.carte.ref }

/** ================================================================
	*		*** Méthodes répondant aux boutons de la colonne droite
	*/ 

editMembers(){
	erreur("Je ne sais pas encore comment ajouter un membre")
}
addChecklist(bouton){
	CheckList.createFor(this)
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

get tags(){return this._tags || (this._tags = [])}
set tags(v){this._tags = v}

/**
 * /Fin des méthodes répondant aux boutons de la colonne droite
 * =============================================================== */

/**
	****************************************************************/

afterSet(hdata){
	console.log("-> CarteForm#afterSet", hdata)
	this.carte.updateDisplay(hdata)
	hdata.tags && PickerTags.drawTagsIn(this)
}


show(){this.obj.classList.remove('hidden')}
hide(){this.obj.classList.add('hidden')}

/**
 * Un essai de méthode 'save' pour répondre au mini-éditeur quand on 
 * modifie la description de la carte.
 * Pour surclasser la méthode 'set' qui vient de TOMiniMethods
 */
set(hdata){
	console.log("-> set()", hdata)
}

/**
 * Retourne la valeur pour la carte de +key+
 * 
 */
get(key){
	return this.carte.data[key]
}

/**
	*
	*	On place les valeurs de la carte dans le formulaire de carte
	*
	*/
setValues(){
	this.titreField.innerHTML = this.carte.titre
	this.descriptionField.innerHTML = this.carte.description || '[Mettre ici la définition de la carte]'
	// Mettre les tags
	PickerTags.drawTagsIn(this)
	// Mettre la date
	// TODO
	// Mettre les enfants
	// Non, ils sont mis à la construction

}

build_and_observe(){
	this.build()
	this.observe()
}
build(){
	this.obj = DOM.clone('carte_form', {id: this.domId})
	this.obj.setAttribute('data-owner-ref', this.carte.ref)
	this.buildObjets()
	document.body.appendChild(this.obj)
}

observe(){
	$(this.obj).draggable()


	// Notamment tous les boutons de la colonne droite
	this.obj.querySelector('liste_actions.for-objets').owner = this
	this.obj.querySelector('liste_actions.for-carte').owner = this.carte
	UI.setEditableIn(this.obj)
	/**
	 * On définit que le formulaire de carte est le propriétaire des 
	 * bouton utiles, par exemple celui qui permet d'édition la 
	 * description, donc le div description
	 */
	const divDescription = DGet('div#carte-description-div div.description', this.obj)
	divDescription.owner = this

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
	Ajax.send('remove.rb', {ref:{ty:objet.type, id:objet.id}})
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
	* Les « objets », ici, sont les checklist (children) et les
	* Massets
	* 
	*/
buildObjets(){
	
	const my = this

	this.carte.forEachChild(child => {
		console.log("Je dois construire le child :", child)
		child.build_and_observe_for(my)
	})
	
	this.carte.forEachMasset(masset => {
		console.log("Je dois construire le Masset : ", masset)
		masset.build_and_observe_for(my)
		masset.obj.querySelectorAll('button').forEach(b => b.owner = my)
	})

	// La ligne ci-dessous servait pour l'ancienne façon de faire
  // const conteneur = this.obj.querySelector(`content[data-type-objet="${otype}"]`)
}

/**
 * Quand la carte est détruire, il faut aussi détruire son formulaire
 */
remove(){
	this.obj.remove()
	if ( this.isCurrent ) delete this.constructor.current

}

/**
 * @return TRUE si c'est la carte courante
 * 
 */
get isCurrent(){
	return this.constructor.current && this.constructor.current.id == this.id
}

get titreField(){
	return this._titfield || (this._titfield = DGet('span.carte-titre',this.obj))
}
get descriptionField(){
	return this._descfield || (this._descfield = DGet('div.carte-description', this.obj))
}

get domId(){
	return this._domid || (this._domid = `carteform-${this.carte.data.id}`)
}

}

Object.assign(CarteForm.prototype, UniversalHelpersMethods)