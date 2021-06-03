'use strict'
/**
	* La classe de l'application
	*
	*/
class App {

/**
 * Méthode utile aux tests pour réinitialiser complètement l'applica-
 * tion, par exemple après un degel
 * 
 * @return Une promise
 */
static async reset(){
	
	DGet('tableaux').innerHTML = ""

	Montrello.types2class || Montrello.type2class('tb')// Pour forcer la définition
	delete Montrello.lastIds
	delete Montrello.config

	Object.values(Montrello.types2class).forEach(classe => {
		delete classe['items']
		delete classe['_current']
		// console.log("Classe %s remise à zéro.", classe.name)
	})

	await UI.init()
	return Montrello.init.call(Montrello)
}

static get name(){return 'Montrello'}

/**
	* Pour les tests (uniquement ?) pour savoir si l'application est
	* prête, c'est-à-dire, principalement, si le chargement est fait
	*/
static isReady(nombre_secondes) {
	const my = this
	return new Promise((ok,ko) => {
		// Le timeout
		var d = new Date()
		d.setTime(d.getTime + (nombre_secondes||30)*1000)
		this.readyTimeout = d
		// On lance l'intervale de surveillance
		my.interReady = setInterval(my.testIfIsReady.bind(my, ok, ko),1000)

	})
}
static testIfIsReady(ok, ko){
	if ( this._isUpAndRunning ) {
		ok()
	} else {
		if ( new Date() > this.readyTimeout ) {
			console.error("L'application devrait être prête…")
			ko()
		}
	}
}

}