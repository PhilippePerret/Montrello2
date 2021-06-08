'use strict'

const UNIT2MULTIPLICATEUR = {
 	'"': 1,
 	'h': 60,
 	'j': 24*60,
 	'm': 30*24*60,
 	'a': 365*24*60,
}

class PickerDates {

static new(owner){
	const p = new PickerDates(owner)
	p.build_and_observe()
	return p
}

constructor(owner){
	this.owner = owner
}

/**
	* Retourne la version affichable dans la carte (ou autre)
	*/
get asHuman(){
	const complexeDate = new ComplexeDate(this.data)
	return complexeDate.asShortString
}

/**
	* Mets les dates du propriétaire dans les champs
	*/
displayDates(){
	const dates = this.owner.dates || this.owner.get('dates')
	console.log("-> displayDates (owner, dates)", this.owner, dates)
	if (dates) {
		this.setDateFrom(dates.fr)
		this.setDateTo(dates.to)
		this.setDateDuree(dates.du)		
	}
}

build_and_observe(){
	this.build()
	this.observe()
}

build(){
	const o = DOM.clone('modeles pickerdates')
	document.body.appendChild(o)

	this.obj = o

}
observe(){
	this.btnSave.addEventListener('click', this.onClickSaveBtn.bind(this))
	this.btnClose.addEventListener('click', this.hide.bind(this))
}

/**
	* Pour enregistrer les date
	*/
onClickSaveBtn(ev){
	this.hide()
	this.owner.setDates(this.data)
}

get data(){
	return {
			fr: this.getDateFrom()
		, to: this.getDateTo()
		, du: this.getDateDuree()
	}
}

getDateFrom(){
	return this.formalizeDate(stringOrNull(this.spanDateFrom.value))
}
getDateTo(){return this.formalizeDate(stringOrNull(this.spanDateTo.value))}
getDateDuree(){return this.formalizeDuree(stringOrNull(this.spanDateDuree.value))}

/**
 * Prend une date +d+ qui peut être incomplète et retourne
 * la date JJ/MM/AAAA
 */
formalizeDate(d){
	if ( d ) {
		var [jour, mois, annee] = d.split('/')
		mois 	|| (mois = this.moisCourant);
		annee || (annee = this.anneeCourante);
		jour 	= String(jour).padStart(2,'0')
		mois 	= String(mois).padStart(2,'0')
		annee = String(annee).padStart(4,'20')
		return `${jour}/${mois}/${annee}`
	}
	return d
}

/**
 * Reçoit une durée exprimée de façon pseudo-humaine
 * et retourne la valeur en minutes
 * 
 * 	12"	= 12 minutes
 *  12h = 12 heures
 *  12j = 12 jours
 * 	12m = 12 mois
 *  12a = 12 ans
 * 
 */
formalizeDuree(d){
	if ( d ) {
		d = d.replace(/ /g, '')
		var unit = d.substring(d.length - 1, d.length)
		var mult = UNIT2MULTIPLICATEUR[unit]
		if ( mult ) {
			var nombre = parseInt(d.substring(0, d.length - 1), 10)
			if ( isNaN(nombre) ) {
				erreur("Il faut donner un nombre de " + unit + " (par exemple 12"+h+")")
			} else {
				return nombre * mult
			}
		} else {
			erreur("Je ne connais pas l'unité donnée. Choisir \" (minutes), h (heures), j (jours), m (mois) ou a (années).")
		}
	}
}

get moisCourant(){
	return this.dateCourante.getMonth() + 1
}
get anneeCourante(){
	return this.dateCourante.getFullYear()
}
get dateCourante(){
	return this._curdate || (this._curdate = new Date())
}

setDateFrom(v){this.spanDateFrom.value = v || ""}
setDateTo(v){this.spanDateTo.value = v || ""}
setDateDuree(v){this.spanDateDuree.value = v || ""}

get spanDateFrom(){return DGet('#date-from', this.obj)}
get spanDateTo(){return DGet('#date-to', this.obj)}
get spanDateDuree(){return DGet('#date-duree', this.obj)}

}
Object.assign(PickerDates.prototype, TOMiniMethods)
Object.defineProperties(PickerDates.prototype, TOMiniProperties)

