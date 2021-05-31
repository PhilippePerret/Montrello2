'use strict'
/**
	class PickerTags
	----------------
	Pour l'édition des tags

	Il existe deux sortes de tags : 
		1. 	Les "étiquettes" normales, qu'on peut définir pour ce qu'on 
				veut
		2. 	Les tags qui permettent de déterminer où en est l'élément dans
				son développement (pour le moment, les cartes et les listes)
*/
const DATA_TAGGER = {
	colors:{
			'1': {colorId:1, color: '#FF1111', 	name:''} // rouge
		, '2': {colorId:2, color: 'orange', 	name:''} // orange
		, '3': {colorId:3, color: 'rgb(224, 224, 0)', name:''} // jaune
		, '4': {colorId:4, color: 'rgb(11, 167, 11)', name:''} // vert
		, '5': {colorId:5, color: 'rgb(93, 93, 251)',	name:''} // bleu
	}

}
class PickerTags {

	/**
		* Le picker de couleur pour choisir les étiquettes de la carte
		*/
	static get tagger(){
		return this._tagger || (this._tagger = (new PickerTags(DATA_TAGGER)).build_and_observe() )
	}

	/**
		* Instancier un picker tags pour le propriétaire +owner+
		*/
	static new(owner){
		const p = new PickerTags(DATA_TAGGER)
		p.owner = owner
		p.build_and_observe()
		return p
	}

	/**
		* Dessine les cases de tags pour l'objet +owner+ qui est une
		* instance qui doit :
		*	- posséder la propriété tags renvoyer la liste des ids de tag
		*	- posséder une propriété obj retournant l'objet DOM
		* - posséder dans obj une balise <tags> pour mettre les tags
		*/
	static drawTagsIn(owner){
		try {
			owner.tags || raise("Le propriétaire doit posséder la propriété 'tags' !")
			owner.obj  || raise("Le propriétaire doit posséder la propriété 'obj' !")
			const otags = owner.obj.querySelector('tags')
			otags || raise("Le propriétaire doit posséder une balise &lt;tags>")
			otags.innerHTML = ''
			owner.tags.forEach(colorid => {
				const tag = document.createElement('TAG')
				tag.style.backgroundColor = DATA_TAGGER.colors[colorid].color
				otags.appendChild(tag)
			})
		} catch (error){
			erreur(error)
			console.error(error)
		}
	}

constructor(data){
	this.data = data
}

build_and_observe(){
	this.build()
	this.observe()
	return this
}
build(){
	const o = DOM.clone('modeles pickertags')
	o.classList.remove('hidden')
	const ocontent = o.querySelector('content')

	// Construction des blocks de couleur
	Object.values(this.data.colors).forEach(dcolor => {
		const p = DOM.clone('modeles pickertag')
		p.setAttribute('data-color-id', dcolor.colorId)
		p.addEventListener('click', this.onClickOnColor.bind(this,p))
		const spanBlock = p.querySelector('span.color-block')
		spanBlock.style.backgroundColor = dcolor.color
		const spanName  = spanBlock.querySelector('span.color-name')
		spanName.innerHTML = dcolor.name
		ocontent.appendChild(p)
	})

	document.body.appendChild(o)
	this.obj = o

}
observe(){
	this.btnSave.addEventListener('click', this.onClickSaveButton.bind(this))
	this.btnClose.addEventListener('click', this.hide.bind(this))
}

/**
	*	Cocher les couleurs voulues
	*/
checkColors(colorIdList){
	this.obj.querySelectorAll('content pickertag').forEach(tag => tag.classList.remove('checked'))
	colorIdList.forEach(colorid => {
		this.obj.querySelector(`content pickertag[data-color-id="${colorid}"]`).classList.add('checked')
	})
}

onClickSaveButton(){
	let checks = []
	this.obj.querySelectorAll('content pickertag').forEach(tag => {
		if (tag.classList.contains('checked')){
			checks.push(tag.getAttribute('data-color-id'))
		}
	})
	this.owner.setTags(checks)
	this.hide()
}

onClickOnColor(pickertag, ev){
	pickertag.classList.toggle('checked')
}

}
Object.assign(PickerTags.prototype, TOMiniMethods)
Object.defineProperties(PickerTags.prototype, TOMiniProperties)