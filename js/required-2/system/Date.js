'use strict'
/**
	* Handy-methods pour les dates
	*
	*	class MDate
	* class ComplexeDate
	*
	*/

const NOW = new Date()

const JOURS = {
    0: {long: 'dimanche', short:'dim'}
  , 1: {long: 'lundi', short:'lun'}
  , 2: {long: 'mardi', short:'mar'}
  , 3: {long: 'mercredi', short:'mer'}
  , 4: {long: 'jeudi', short:'jeu'}
  , 5: {long: 'vendredi', short:'ven'}
  , 6: {long: 'samedi', short:'sam'}
}

const MOIS = [
	  {long:'janvier', 	 short:'janv'}
	, {long:'février', 	 short:'fév'}
	, {long:'mars', 		 short:'mars'}
	, {long:'avril', 		 short:'avr'}
	, {long:'mai', 			 short:'mai'}
	, {long:'juin',			 short:'juin'}
	, {long:'juillet',	 short:'juil'}
	, {long:'aout',			 short:'aout'}
	, {long:'septembre', short:'sept'}
	, {long:'octobre',	 short:'oct'}
	, {long:'novembre',	 short:'nov'}
	, {long:'décembre',	 short:'déc'}
]
class ComplexeDate {
constructor(data){
	this.data = data
}

/**
	* Retourne TRUE si la date est dépassée
	*/
isOutOfDate(){
	return this.readDateFin && (new Date() > this.readDateFin)
}


get asShortString(){
	if ( !this.from ) return ""
	var segs = ['<span class="picto">🕣</span>']
	segs.push(`du ${MDate.asHumanShort(this.dateFrom)}`)
	if ( this.realDateFin ) {
		segs.push(` au ${MDate.asHumanShort(this.realDateFin)}`)
	}
	segs = segs.join('')
	const color = this.isOutOfDate() ? 'bad' : 'bon'
	return `<span class="${color}">${segs}</span>`
}


get dateFrom(){
	if(!this.from) return
	return this.from.asDate
}
get dateTo(){
	if(!this.to) return
	return this.to.asDate
}
get realDateFin(){
	if ( this.dateTo ){ 
		return this.dateTo
	}	else if ( this.dateFrom && this.duree ) {
		const dureeS = dureeString2Secondes(this.duree)
		let d = new Date()
		d.setTime(this.dateFrom.getTime() + dureeS * 1000)
		return d
	}
	return 
}


get from()	{return this.data.fr && (new MDate(this.data.fr))}
get to()		{return this.data.to && (new MDate(this.data.to))}
get duree()	{this.data.du}


}// class ComplexeDate

class MDate {

static asHumanShort(date){
	const dmois = MOIS[date.getMonth()]
	return `${date.getDate()} ${dmois.short}`	
}

constructor(str){
	this.str = str
}
get asDate(){
	return this._asdate || (this._asdate = dateString2Date(this.str) )
}
get asHumanShort(){
	const dmois = MOIS[this.asDate.getMonth()]
	return `${this.asDate.getDate()} ${mois.short}`
}

}// class MDate
/**
  Retourne le temps en secondes
  @documented
**/
function humanDateFor(timeSeconds){
  if (undefined === timeSeconds){ timeSeconds = new Date()}
  if ('number' != typeof(timeSeconds)) timeSeconds = parseInt(timeSeconds.getTime() / 1000)
  var d = new Date(timeSeconds * 1000)
  return `${String(d.getDate()).padStart(2,'0')} ${(String(d.getMonth()+1)).padStart(2,'0')} ${d.getFullYear()}`;
}


/**
  * Reçoit une date au format JJ/MM/AAAA (tronquée ou non) et 
  * retourne un objet Date.
  */
function dateString2Date(str){
  const now = new Date()
  let [j,m,a] = str.split('/')
  a = integerOrNull(a) || now.getFullYear()
  m = integerOrNull(m) || now.getMonth() + 1
  j = integerOrNull(j)
  // console.log("Jour:%s, Mois:%s, Année:%s", j, m, a)
  return new Date(a, m - 1, j, 0, 0, 0)
}

/**
  * Reçoit une durée string au format "4s", "5j", "3m", "7a" et
  * retourne la durée correspondante, en secondes
  *
  */
const Unity2Secondes = {
  'sc' : 1, 'mn': 60, 'hr':3600, 'jr':24*3600, 'mo':24*3600*31, 'an':365*24*3600
}
function dureeString2Secondes(str){
  const u = str.substring(str.length - 3, str.length)
  let n = str.substring(0, str.length - 3)
  console.log("n = ", n)
  n = parseInt(n, 10) 
  if ( Unity2Secondes[u] ) {
    return n * Unity2Secondes[u]
  } else {
    erreur("Impossible de calculer la durée " + str + " (les unités possibles sont : 'sc', 'mn', 'hr', 'jr', 'mo', 'an'")
  }
}
