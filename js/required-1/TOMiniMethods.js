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
	save(params){

		if (undefined == this.data) this.data = {}

		// 
		// Le 'constname', le constructeur en minuscule => type
		// 
		this.data.ty || (this.data.ty = this.constname)

		// 
		// Si l'identifiant n'est pas défini
		this.data.id ||= (this.data.id = Montrello.getNewId(this.data.type))

		// 
		// Certains valeurs sont à retirer
		const data4save = {}
		Object.assign(data4save, this.data)
		delete data4save.owner
		delete data4save.cr // régression

		// console.log("Data à sauvegarder : ", data4save)

		Ajax.send('save.rb', {data: data4save}).then(ret => {
			// console.log("Retour d'ajax : ", ret)
			if (ret.erreur) erreur(ret.erreur)
			else {
				// console.log("Données sauvegardées :", data4save)
				// message("Donnée sauvegardée avec succès.")
			}
		})
	},

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

	editTags(btn, ev){
		this.pickertags || (this.pickertags = PickerTags.new(this))
		this.pickertags.checkColors(this.tags)
		this.pickertags.positionne(btn)
	},

	setTags(tagListIds){
		this.tags = tagListIds
	},

	editDates(btn, ev){
		this.pickerdates || (this.pickerdates = PickerDates.new(this))
		this.pickerdates.displayDates()
		this.pickerdates.positionne(btn)
	},

	setDates(hvalues) { this.set({dates: hvalues}) },

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

	/**
		* Pour régler la jauge de développement que peut posséder l'objet
		*/
	setJaugeDev(){

	},

	/**
		* Méthode qui règle dans la carte (*) les propriétés communes, par
		* exemple le titre ou l'identifiant.
		*
		* (*) Ou dans l'édition de la carte.
		*/
	setCommonDisplayedProperties(){
		const verbose = false
		verbose && console.log("-> setCommonDisplayedProperties", this)
		this.commonDisplayedProperties.forEach(prop => {
			const o = this.obj.querySelector(`*[data-prop="${prop}"]`)
			if ( undefined == o ) return
			if ( ! this[prop] ) return
			verbose && console.log("Mettre la propriété %s à '%s' dans", prop, this[prop], o)
			o.innerHTML = this[prop]
		})
		verbose && console.log("<- setCommonDisplayedProperties")
	},

	getTitleField(){
		if ( this.constname == 'tableau' ){
			return document.body.querySelector('span.pannel_name')
		} else {
			return this.obj.querySelector('title.editable')
		}
	},

	getOwner(){
		if ( this.data.ow ) {
			const [type, id] = this.data.ow.split('-')
			return Montrello.type2class(type).get(id)
		} else if (this.constructor.ownerClass){
			const owner = this.constructor.ownerClass.get(this.owner_id)
			console.log("owner trouvé :", owner)
			return owner
		} else {
			console.log("ownerClass n'est pas définit pour %s", this.constructor.name)
		}
	}
}

const TOMiniProperties = {

	commonDisplayedProperties:{
		enumerable: true,
		get(){return['id','ty','ti','ct','dsc']}
	},

	domId:{
		enumerable: true,
		get(){return this._domid || (this._domid = `${this.constname}-${this.id}`)}
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


	owner:{
		enumerable:true,
		get(){return this._owner || (this._owner = this.data.owner || this.getOwner())},
		set(v){this._owner = v}
	},

	owner_id:{
		enumerable: true,
		get(){return this.data.owner_id},
		set(v){this.data.owner_id = v}
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
	ct:{ // Selector du container
		enumerable:true,
		get(){return this.data.ct},
		set(v){ this.data.ct = v }
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