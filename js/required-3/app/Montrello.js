'use strict'


const Montrello = {


type2class:function(type){
	this.types2class = this.types2class || {
			'tb': Tableau
		, 'li': Liste
		, 'ca': Carte
		, 'cl': CheckList
		, 'tk': CheckListTask
		, 'ma': Masset
	}
	return this.types2class[type]
},

/**
	* Retourne un nouvel identifiant pour le type +type+
	*/
getNewId:function(type){
	this.lastIds || (this.lastIds = {})
	this.lastIds[type] || Object.assign(this.lastIds, {[type]: 0})
	++ this.lastIds[type]
	return this.lastIds[type]
},

/**
 * Permet d'actualiser le dernier identifiant d'un type
 * 
 * Cette méthode a été inaugurée pour les modèles et elle n'est 
 * employée que pour eux pour le moment.
 * 
 */
addOrNotLastIdFrom:function(item){
	this.lastIds || (this.lastIds = {})
	this.lastIds[item.type] || Object.assign(this.lastIds, {[item.type]: 0})
	if ( this.lastIds[item.type] < item.id ){
		this.lastIds[item.type] = item.id
	}
},

/**
	* Initialisation de Montrello (au chargement de l'application)
	*
	* On charge toutes les données et on les dispatche dans les 
	* différents tableaux. 
	*
	* QUESTION Peut-être qu'une technique possible pourrait être
	* de ne s'occuper que du tableau actif et de faire les autres les
	* un après les autres quand le premier est prêt.
	*
	*/
init:function(){
	this.resetProps()

	return Ajax.send('load.rb',{type:'config'})
	.then(this.dispatch.bind(this, 'config'))
	.then(Ajax.send.bind(Ajax,'load.rb',{type:'tb' /* Tableau */}))
	.then(this.dispatch.bind(this, 'tb'))
	.then(this.buildItemsOf.bind(this, Tableau))
	.then(this.ensureCurrentTableau.bind(this))
	.then(Ajax.send.bind(Ajax,'load.rb',{type:'ma' /* masset */}))	
	.then(this.dispatch.bind(this, 'ma'))
	.then(Ajax.send.bind(Ajax,'load.rb',{type:'tk' /* task de checklist */}))	
	.then(this.dispatch.bind(this, 'tk'))
	.then(Ajax.send.bind(Ajax,'load.rb',{type:'cl' /* checklist */}))	
	.then(this.dispatch.bind(this, 'cl'))
	.then(Ajax.send.bind(Ajax,'load.rb',{type:'li' /* liste */ }))
	.then(this.dispatch.bind(this, 'li'))
	.then(this.buildItemsOf.bind(this, Liste))
	.then(Ajax.send.bind(Ajax,'load.rb',{type:'ca' /* carte */}))	
	.then(this.dispatch.bind(this, 'ca'))
	.then(this.buildItemsOf.bind(this, Carte))
	.then(MontrelloModele.loadAllModeles.bind(MontrelloModele)) // les modèles
	.then(ret => {
		PanelInfos.init() // panneau des informations (nombre de…)
		App._isUpAndRunning = true
		log("Application prête", 5)
		// console.log("This.lastIds", this.lastIds)
	})
	.catch(console.error)
},

resetProps(){
	this.lastIds = {}
},

dispatch(type, ret){
	// console.log("dispatch(type = %s, ret = )", type, ret)
	return new Promise((ok,ko) => {
		if ( type == 'config' ) {
			this.dispatch_config(ret.data)
		} else {
			if ( (undefined == ret.data) || (ret.data.length == 0)) ok()
			this.dispatch_data(ret.data, ret.type)
		}
		ok()
	})
},

dispatch_config(data){
	const my = this
	this.config = data || this.default_config
},


setConfig(hdata){
	Object.assign(this.config, hdata)
	// console.log("Enregistrement de la configuration : ", this.config)
	Ajax.send('save.rb', {data: this.config})
	.then(ret => {
		if (ret.error) return erreur(ret.error)
		// console.log("Configuration enregistrée avec succès.")
	})
	.catch(ret => {
		erreur("Impossible d'enregistrer la configuration : " + ret.error + ' (consulter la console')
		console.error("Données envoyées pour sauvegarde :", this.config)
	})
},


dispatch_data(data, type){
	// console.log("dispatch_data(type = %s) with data", type, data)
	const my = this
	if ( !type ) { return systemError("[Montrello#dispatch_data] +type+ devrait être défini.") }
	if ( !data ) { return systemError("[Montrello#dispatch_data] +data+ devrait être défini.") }
	Object.assign(my.lastIds, {[type]: 0})
	if ( data.length == 0 ) return // aucun élément
	const Classe = this.type2class(data[0].ty)
	Classe.items = {}
	data.forEach(hdata => {
		// console.log("Construction de l'objet %s: ", hdata.type, hdata)
		if (my.lastIds[type] < hdata.id) my.lastIds[type] = Number(hdata.id)
		const item = new Classe(hdata)
		Object.assign(Classe.items, {[hdata.id]: item})
		// Associe les enfants au parent. Par exemple, associe les tasks
		// aux CheckLists. +item+ ci-dessous est une CheckList
		item.ownerise && item.ownerise()
	})
},

buildItemsOf(classe,ret){
	return new Promise((ok,ko) => {
		if ( !classe.items ) return ok() ;
		const items = Object.values(classe.items)
		if ( items.length == 0 ) return
		const aItem = items[0]
		const method = 'function' == typeof(aItem.build_and_observe) ? 'build_and_observe' : 'build'
		items.forEach(item => item[method]())
		ok()
	})
},

/**
	* Méthode qui s'assure qu'il existe un tableau courant et le crée
	* si nécessaire.
	*
	*/
ensureCurrentTableau:function(){
	return new Promise((ok,ko) => {
		let current ;
		if ( this.config.current_pannel_id ){
			current = Tableau.get(this.config.current_pannel_id)
		} 
		if ( current ) {
			Tableau.setCurrent(current)
		}
		else {
			// Si aucun tableau courant n'est défini ou n'existe plus, il 
			// faut en créer un
			Tableau.create("Mon premier tableau")
		}
		// Peuplement du menu des tableaux dans l'header
		Tableau.updateFeedableMenu()
		ok()
	})
},

}//Montrello

Object.defineProperties(Montrello, {
	default_config:{
		enumerable: true,
		get(){return {
			current_pannel_id: null
		}}
	},
		
})