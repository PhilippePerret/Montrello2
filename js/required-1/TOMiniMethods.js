'use strict'
/**
	* Méthodes minimales pour absolument tout objet Montrello
	*/
let TOMiniMethods = {

	/**
		*	=== MÉTHODES D'AFFICHAGE ===
		*/
	show(){this.obj.classList.remove('hidden')},
	hide(){this.obj.classList.add('hidden')},

	// Actualisation de l'affichage du titre
	setTitre(titre){
		this.titleField.innerHTML = titre || this.titre
	},


	/**
		*	=== MÉTHODES DE PROPRIÉTÉS ===
		*/
	/**
	 * Actualise les propriétés de l'objet et les sauve
	 */
	set(hdata){
		Object.assign(this.data, hdata)
		// Si c'est un champ autoéditable
		for (var k in hdata) {
			var v = hdata[k]
			let o = this.obj.querySelector(`*[data-prop="${k}"]`)
			// console.log("this.obj dans set", this.obj, this)
			if ( !o && this.constructor.name == 'Carte' ) {
				/** <= 	Le champ n'appartient pas au propriétaire et il
					* 		s'agit d'une carte
					*  =>	C'est le CarteForm, il faut donc mettre en 'o' le
					*			champ concerné
					*/
				o = document.body.querySelector(`carte_form[data-owner-ref="${this.ref}"] *[data-prop="${k}"]`)

			}
			// console.log("container de la donnée : à mettre à ", o,  v)
			o && (o.innerHTML = v)
		}
		this.save()
		if (this.afterSet) this.afterSet(hdata)
	},

	/**
		* La fonction générique qui met le titre en édition avec le
		* mini-éditeur (par exemple à la création de l'élément)
		*/
	editTitle(){
		MiniEditor.edit(this.titleField)
	},

	/**
		* Pour ajouter l'objet +obj+ aux objets de l'élément
		*
		*/
	addObjet(obj){
		const otype = obj.ty
		console.log("Je dois ajouter un élément de type %s à ", otype, this, obj)
		this.objs || (this.objs = {})
		this.objs[otype] || Object.assign(this.objs, {[otype]: []})
		if ( this.objs[otype].indexOf(obj.id) < 0 ) {
			this.objs[otype].push(obj.id)
		}
		this.save()
	},

	addMasset(masset){
		this.addObjet(masset.data)
	},

	/**
		*	Pour positionner les objets positionnables (picker-tags, 
		*	picker-dates)
		*/
	positionne(btn){
		const rect = btn.getBoundingClientRect()
		this.obj.style.top 	= px(rect.top)
		this.obj.style.left = px(rect.left)
		this.show()
	},

	getTitleField(){
		if ( this.constname == 'tableau' ){
			return document.body.querySelector('span.pannel_name')
		} else {
			return this.obj.querySelector('title.editable') || this.obj.querySelector('titre.editable')
		}
	},

}

const TOMiniProperties = {

	ref:{
		enumerable: true,
		get(){return `${this.type}-${this.id}`}
	},

	commonDisplayedProperties:{
		enumerable: true,
		get(){return['id','ty','ti', 'dsc']}
		// Note : la CarteForm possède sa propre liste
	},

	ty:{
		enumerable: true,
		get(){return this.data.ty}
	},
	type:{
		enumerable: true,
		get(){return this.data.ty},
		set(v){this.data.ty = v} // utile ?
	},

	constname:{
		enumerable: true,
		get(){return this.constructor.name.toLowerCase()}
	},

	id: {
		enumerable: true,
		get(){return this.data.id},
		set(v){this.data.id = v}
	},

	titre:{
		enumerable: true,
		get(){return this.data.ti},
		set(v){this.data.ti = v}
	},
	ti:{ // alias de titre, pour l'enregistrement
		enumerable: true,
		get(){return this.data.ti},
		set(v){this.data.ti = v}
	},

	/**
		*	Champ d'édition du titre
		* ------------------------
		* En général, une balise <title> de class 'editable', sauf pour
		* le titre du tableau.
		*
		*/
	titleField:{
		enumerable:true,
		get(){
			return this._titlefield || (this._titlefield = this.getTitleField())
		}
	},

	description:{
		enumerable:true,
		get(){return this.data.dsc},
		set(v){this.data.dsc = v}
	},

	dsc:{ // alias de description
		enumerable:true,
		get(){return this.data.dsc},
		set(v){this.data.dsc = v}
	},

	tags:{
		enumerable:true,
		get(){return this.data.tags || []},
		set(v){
			this.set({tags: v})
			console.log("Régler les tags de l'objet à ", v)
		}
	},

	dates:{
		enumerable:true,
		get(){return this.data.dates || {fr:null, to:null, du:null}},
		set(v){this.data.dates = v}
	},

	container:{
		enumerable:true,
		get(){return this._container || (this.container = this.ct && document.querySelector(this.ct))},
		set(v){this._container = v}
	},

	btnSave:{
		enumerable: true,
		get(){return this.obj.querySelector('button.btn-save')}
	},

	btnClose:{
		enumerable:true,
		get(){return this.obj.querySelector('button.btn-close')}
	},

	/**
		* Les objets contenus par l'objet
		*
		* C'est un hash avec en clé le type de l'objet (deux lettres) et
		* en valeur une liste d'identifiants.
		*/
	objs:{
		enumerable:true,
		get(){return this.data.objs},
		set(v){this.data.objs = v}
	}

}