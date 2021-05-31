'use strict'
/**
	* Pour le moment, juste pour les inside-tests
	*
	*/
class App {

// Appelé par InsideTests
static init(){
	return new Promise((ok,ko) => ok())
}

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