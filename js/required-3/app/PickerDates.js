'use strict'

class PickerDates {

static new(owner){
	const p = new PickerDates(owner)
	p.build_and_observe()
	return p
}

/**
 * Reçoit une durée exprimée en minutes et retourne une durée
 * humaine
 */
static dureeHumaine(d){
	const mduree = new MDuree(d)
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
		, du: this.getDuree()
	}
}

getDateFrom(){
	return this.formalizeDate(stringOrNull(this.spanDateFrom.value))
}
getDateTo(){return this.formalizeDate(stringOrNull(this.spanDateTo.value))}
getDuree(){return stringOrNull(this.spanDateDuree.value)}

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

