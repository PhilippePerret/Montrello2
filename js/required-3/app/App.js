'use strict'
/**
	* La classe de l'application
	*
	*/
class App {

static async init(){
	const ret = await Ajax.send('INTests/runner.rb')
	console.log("retour de INTests/runner.rb", ret)
	if ( ret.run_intests ) {
		await this.prepareInTests(ret.start)
	}
	await UI.init()
	await Montrello.init.call(Montrello)
	if ( ret.run_intests ) {
		await INTests.run_test(ret.intest_name)
		if (ret.has_next_intest) { 
			document.location.reload()
		} else {

			// *** FIN DES TESTS ***

			INTests.report()

		}
	}
}

/**
 * Préparation des tests INTests
 * On charge le module
 */
static async prepareInTests(start){
	await loadJS('INTests/INTests.js')
	if (start) {
		await INTests.prepare()
	}
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