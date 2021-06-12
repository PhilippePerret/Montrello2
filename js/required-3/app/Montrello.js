'use strict'


class Montrello {


/**
 * @return La classe objet du type +type+
 * 
 * +type+ {String} Le type sous forme de deux lettres
 * 
 */
static type2class(type){
	return this.type2dataClass(type).classe
}

/**
 * @return les données du type +type+
 * 
 * +type+ {String} Le type sous forme de deux lettres
 * 
 */
static type2dataClass(type){
	return this.dataObjets[type]
}

/**
 * Les données des objets Montrello
 * 
 */
static get dataObjets(){
	return this._dataObjets || (this._dataObjets = {
			'tb': {type:'tb', classe: Tableau, parentClass:null, childClass: Liste, modeleName:'tableau'}
		, 'li': {type:'li', classe: Liste, parentClass:Tableau, childClass:Carte, modeleName:'liste'}
		, 'ca': {type:'ca', classe: Carte, parentClass:Liste, childClass:CheckList, modeleName:'carte'}
		, 'cl': {type:'cl', classe: CheckList, parentClass:Carte, childClass:CheckListTask, modeleName:'checklist'}
		, 'tk': {type:'tk', classe: CheckListTask, parentClass:CheckList, childClass:Masset, modeleName:'task'}
		, 'ma': {type:'ma', classe: Masset, parentClass:null, childClass: null, modeleName: 'masset'}
		, 'm-li': {type:'m-li', classe: MontModele, parentClass:null, childClass:null, modeleName:null}
		, 'm-ca': {type:'m-ca', classe: MontModele, parentClass:null, childClass:null, modeleName:null}
		, 'm-cl': {type:'m-cl', classe: MontModele, parentClass:null, childClass:null, modeleName:null}
	})
}

/**
 * Pour faire tourner la fonction +fonction+ sur toutes les classes
 * d'objets Montrello
 */
static forEachClassObjet(fonction){
	Object.values(this.dataObjets).forEach(dobjet => fonction(dojet.classe))
}

/**
 * @return n'importe quel objet de type +type+ et d'identifiant +id+
 * 
 * +type+		Le type (2 lettres) ou la référence (<type>-<id>)
 * +id+			Identifiant ou rien (si type est référence)
 * 
 */
static get(type, id) { 
	if ( !id ) [type, id] = type.split('-')
	return this.type2class(type).get(id) 
}

/**
	* Retourne un nouvel identifiant pour le type +type+
	*/
static getNewId(type){
	this.lastIds || (this.lastIds = {})
	this.lastIds[type] || Object.assign(this.lastIds, {[type]: 0})
	++ this.lastIds[type]
	return this.lastIds[type]
}

/**
 * Permet d'actualiser le dernier identifiant d'un type
 * 
 * Cette méthode a été inaugurée pour les modèles et elle n'est 
 * employée que pour eux pour le moment.
 * 
 */
static addOrNotLastIdFrom(item){
	this.lastIds || (this.lastIds = {})
	this.lastIds[item.type] || Object.assign(this.lastIds, {[item.type]: 0})
	if ( this.lastIds[item.type] < item.id ){
		this.lastIds[item.type] = item.id
	}
}

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
static init(){
	this.resetProps()
	return this.loadConfig()
	.then(this.loadAllObjets.bind(this))
	.then(this.buildAllObjets.bind(this))
	.then(this.sortAllChildren.bind(this))
	.then(this.setJaugesInCarte.bind(this))
	.then(ret => {
		PanelInfos.init() // panneau des informations (nombre de…)
		App._isUpAndRunning = true
		log("Application prête", 1)
	})
	.catch(erreur)
}

static resetProps(){
	this.lastIds = {}
}


/**
 * Chargement de tous les objets
 * 
 * C'est le premier temps du nouveau fonctionnement :
 * 
 * 	- Chargement de tous les objets 			<<<<<<<
 * 	- Construction de tous les objets
 */
static async loadAllObjets(){
	// console.log("this.load_and_dispatch_objet_type('tb')", this.load_and_dispatch_objet_type('tb'/* Tableaux */))
	return this.load_and_dispatch_objet_type('tb'/* Tableaux */)
	 .then(this.load_and_dispatch_objet_type.bind(this, 'ca'/* cartes */))
	 .then(this.load_and_dispatch_objet_type.bind(this, 'li'/* listes */))
	 .then(this.load_and_dispatch_objet_type.bind(this, 'cl'/* checkLists */))
	 .then(this.load_and_dispatch_objet_type.bind(this, 'tk'/* tasks de checkList */))
	 .then(this.load_and_dispatch_objet_type.bind(this, 'ma'/* massets */))
	 .then(this.load_and_dispatch_objet_type.bind(this, 'm-ca'/* modèles de cartes */))
	 .then(this.load_and_dispatch_objet_type.bind(this, 'm-li'/* modèles de listes */))
	 .then(this.load_and_dispatch_objet_type.bind(this, 'm-cl'/* modèles de checkLists */))
}

static load_and_dispatch_objet_type(type){
	// console.log("-> load_and_dispatch_objet_type(type = '%s')", type)
	return Ajax.send('load.rb',{type:type}).then(this.dispatch_data.bind(this, type))
}


static dispatch_data(type, ret){
	// console.log("-> dispatch_data(type='%s', ret=)", type, ret)
	const my = this
	return new Promise((ok,ko) => {
		if ( (undefined == ret.data) || (ret.data.length == 0)) return ok()
		const data = ret.data
		if ( !type ) { return systemError("[Montrello#dispatch_data] l'argument +type+ doit être défini à l'appel de dispatch_data.") }
		if ( !data ) { return systemError("[Montrello#dispatch_data] l'argument +data+ doit être défini à l'appel de dispatch_data.") }
		Object.assign(my.lastIds, {[type]: 0})
		if ( data.length == 0 ) return ok() // aucun élément
		const Classe = this.type2class(type)
		Classe.items = {}
		data.forEach(hdata => {
			if (my.lastIds[type] < hdata.id) my.lastIds[type] = Number(hdata.id)
			const item = new Classe(hdata)
			if ( item instanceof MontModele ) {
				// Si l'item est un modèle, on le précise sur le référent
				item.parent.isModele = true
			}
			Object.assign(Classe.items, {[hdata.id]: item})
		})
		ok()
	})
}

/**
 * Construction de tous les objets
 * 
 * Inscrite dans le nouveau fonctionnement :
 * 
 * 	- Chargement de tous les objets
 * 	- Construction de tous les objets 		<<<<<<<
 */
static buildAllObjets(){
	return this.buildItemsOf(Tableau)
	.then(this.ensureCurrentTableau.bind(this))
	.then(this.buildItemsOf.bind(this, Liste))
	.then(this.buildItemsOf.bind(this, Carte))
	.then(this.buildItemsOf.bind(this, CheckList))
	.then(this.buildItemsOf.bind(this, CheckListTask))
	.then(this.buildItemsOf.bind(this, Masset))
}

/**
 * Après la construction de tous les éléments, classe
 * leurs enfants s'il y en a.
 * QUESTION : faut-il renvoyer une promesse ?
 */
static sortAllChildren(){
	Object.values(this.dataObjets).forEach(dclass => {
		dclass.classe.forEachItem(item => item.sortChildren.call(item))
	})
}


/**
 * Les jauges des cartes ne peuvent être réglées que lorsque toutes
 * les tâches sont chargées et dispatchées dans les chekclists
 * 
 */
static setJaugesInCarte(){
	Carte.forEachItem(carte => { carte.draw_jauge_if_necessary() })
}

static loadConfig(){
	return Ajax.send('load.rb',{type:'config'})
	.then(this.dispatch_config.bind(this))
}

static dispatch_config(ret){
	const my = this
	const data = ret.data
	this.config = data || this.default_config
}

static setConfig(hdata){
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
}

static buildItemsOf(classe){
	// console.log("-> buildItemsOf", classe)
	return new Promise((ok,ko) => {
		if ( classe.items ) {		
			const items = Object.values(classe.items)
			if ( items.length > 0 ) {
				// console.log("J'appelle build_and_observe pour", items)
				items.forEach(item => item.build_and_observe.call(item))
			}
		}
		ok()
	})
}

/**
	* Méthode qui s'assure qu'il existe un tableau courant et le crée
	* si nécessaire.
	*
	*/
static ensureCurrentTableau(){
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
}

static get default_config(){
	return {
		current_pannel_id: null,
		tableaux_order: []
	}
}

} // class Montrello

