'use strict'
/**
	* La classe de l'application
	*
	*/
class App {

static async init(){

	// Début première partie pour la gestion des INTests

	const intests_params = await Ajax.send('INTests/runner.rb')

	this.intests_running = !!intests_params.run_intests

	if ( intests_params.run_intests ) {

		await loadJS('INTests/INTests.js')
		await INTests.restart(intests_params)

	}

	// Fin première partie pour la gestion des INTests
	
	await UI.init()
	await Montrello.init.call(Montrello)
	

	// Début seconde partie pour la gestion des INTests

	if ( intests_params.run_intests ) {

		await INTests.run_test_and_suite()

	}

	// Fin seconde partie pour la gestion des INTests

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
		this.intests_running || log("Application prête", 1)
		ok()
	} else {
		if ( new Date() > this.readyTimeout ) {
			console.error("L'application devrait être prête…")
			ko()
		}
	}
}

}