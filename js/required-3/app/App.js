'use strict'
/**
	* La classe de l'application
	*
	*/
class App {

/**
 * @async
 * 
 * Méthode utile aux tests pour réinitialiser complètement l'applica-
 * tion, par exemple après un degel
 * 
 * Si MiniTest.config.reset_before_each_test (_config.js) est true, 
 * cette méthode est automatiquement appelée avant chaque test.
 * 
 * @return Une promise
 */
static async resetBeforeTest(){
	log("-> App.resetBeforeTest", 8)
	
	// On détruit tous les écouteurs d'évènement dans les
	// containeurs éditables.
	UI.unsetAllEditableContainers()

	// On efface tous les tableaux (et le menu des tableaux)
	Tableau.eraseAll()

	Montrello.types2class || Montrello.type2class('tb')// Pour forcer la définition
	delete Montrello.lastIds
	delete Montrello.config

	Object.values(Montrello.types2class).forEach(classe => {
		delete classe['items']
		delete classe['_current']
		// console.log("Classe %s remise à zéro.", classe.name)
	})

	await UI.init()
	log("<- App.resetBeforeTest", 8)
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