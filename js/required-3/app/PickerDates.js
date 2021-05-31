'use strict'
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
	const dates = this.owner.dates
	this.setDateFrom(dates.fr)
	this.setDateTo(dates.to)
	this.setDateDuree(dates.du)
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

getDateFrom(){return stringOrNull(this.spanDateFrom.value)}
getDateTo(){return stringOrNull(this.spanDateTo.value)}
getDateDuree(){return stringOrNull(this.spanDateDuree.value)}

setDateFrom(v){this.spanDateFrom.value = v || ""}
setDateTo(v){this.spanDateTo.value = v || ""}
setDateDuree(v){this.spanDateDuree.value = v || ""}

get spanDateFrom(){return DGet('#date-from', this.obj)}
get spanDateTo(){return DGet('#date-to', this.obj)}
get spanDateDuree(){return DGet('#date-duree', this.obj)}

}
Object.assign(PickerDates.prototype, TOMiniMethods)
Object.defineProperties(PickerDates.prototype, TOMiniProperties)

