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

const UNIT2MULTIPLICATEUR = {
 	'"': 1,
 	'h': 60,
 	'j': 24*60,
 	'm': 30*24*60,
 	'a': 365*24*60,
}

class ComplexeDate {
constructor(data){
	this.data = data
}

/**
	* Retourne TRUE si la date est dépassée
	*/
isOutOfDate(){
	return this.dateTo && (new Date() > this.dateTo)
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

get asComplete(){
	var segs = ['<span class="picto">🕣</span>']
	if ( this.dateFrom ) {
		segs.push(`du ${humanDateFor(this.dateFrom)}`)
	}
	if ( this.dateTo ) {
		segs.push(`au ${humanDateFor(this.dateTo)}`)
	}
	if ( this.duree) {
		segs.push(`(${this.duree.asHumanDuree})`)
	}
	segs = segs.join(' ')
	const color = this.isOutOfDate() ? 'bad' : 'bon'
	return `<span class="${color}">${segs}</span>`
}


get dateFrom(){
	if (this.from) return this.from.asDate
	else if ( this.to && this.duree ) {
		var d = new Date()
		d.setTime( this.to.asDate.getTime() - this.duree.asMillisecondes ) 
		return d
	}
}
get dateTo(){
	if ( this.to ) return this.to.asDate
	else if ( this.from && this.duree ) {
		var d = new Date()
		d.setTime( this.from.asDate.getTime() + this.duree.asMillisecondes)
		return d
	}
}


get from()	{return this.data.fr && (new MDate(this.data.fr))}
get to()		{return this.data.to && (new MDate(this.data.to))}
get duree()	{return this.data.du && (new MDuree(this.data.du))}


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
 * Class MDuree
 * ------------
 * Pour la gestion d'une durée
 * 
 * La durée peut être fournie par '12"', '12 h', '12jr', etc.
 */
class MDuree {
constructor(str){
	this.init_value = str
	this.parse(str)
}

/**
 * Méthode qui parse la chaine pour obtenir le nombre et l'unité
 * 
 */
parse(str){
	if ( false == isNaN(str) ) {
		// <= +str+ ne contient que des chiffres
		// => C'est une durée envoyée par minutes
		this._multiplicateur = 1
		this._unit = '"'
		this._number = str
		return
	}
	str = str.replace(/ /g, '')
	var unit = str.substring(str.length - 1, str.length)
	var mult = UNIT2MULTIPLICATEUR[unit]
	if ( mult ) {
		var nombre = parseInt(str.substring(0, str.length - 1), 10)
		if ( isNaN(nombre) ) {
			erreur("Il faut donner un nombre de " + unit + " (par exemple 12"+h+")")
		} else {
			this._number = Number(nombre)
			this._unit   = unit
			this._multiplicateur = mult
		}
	} else {
		erreur("Je ne connais pas l'unité donnée. Choisir \" (minutes), h (heures), j (jours), m (mois) ou a (années).")
	}
}

get unit()	{return this._unit}
get number(){return this._number}
get multiplicateur(){return this._multiplicateur}

// Retourne la durée en minutes, en secondes ou en millisecondes
get asMinutes(){ return this.number * this.multiplicateur }
get asSecondes(){ return this.asMinutes * 60 }
get asMillisecondes(){return this.asSecondes * 1000}

get asHumanDuree(){
	var d = this.asMinutes
	var y = Math.floor(d / UNIT2MULTIPLICATEUR.a)
	d = d % UNIT2MULTIPLICATEUR.a
	var m = Math.floor(d / UNIT2MULTIPLICATEUR.m)
	d = d % UNIT2MULTIPLICATEUR.m
	var j = Math.floor(d / UNIT2MULTIPLICATEUR.j)
	d = d % UNIT2MULTIPLICATEUR.j
	var h = Math.floor(d / 60)
	d = d % 60

	var dh = []
	if ( y ) dh.push(`${y} an` + (y>1?'s':''))
	if ( m ) dh.push(`${m} mois`)
	if ( j ) dh.push(`${j} jour`+(j>1?'s':''))
	if ( d ) dh.push(`${d} minute`+(d>1?'s':''))
	switch(dh.length){
		case 1: return dh[0];
		case 2: return dh.join('et')
		default: 
			var last = dh.pop()
			return dh.join(', ') + ' et ' + last
	}
}
}





/**
  Retourne le temps en secondes
  @documented
**/
function humanDateFor(timeSeconds){
  if (undefined === timeSeconds){ timeSeconds = new Date()}
  if ('number' != typeof(timeSeconds)) timeSeconds = parseInt(timeSeconds.getTime() / 1000)
  var d = new Date(timeSeconds * 1000)
  return `${String(d.getDate()).padStart(2,'0')} ${MOIS[d.getMonth()].long} ${d.getFullYear()}`;
  // return `${String(d.getDate()).padStart(2,'0')} ${(String(d.getMonth()+1)).padStart(2,'0')} ${d.getFullYear()}`;
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
  // Unités sur une lettre
  , '"': 60, 'h': 3600, 'j':24*3600, 'm':24*3600*31, 'a':365*24*3600
}
function dureeString2Secondes(str){
	let len = 3
  let u = str.substring(str.length - len, str.length)

  if ( null == Unity2Secondes[u] ) {
  	len = 1
  	u = str.substring(str.length - len, str.length)
  }
  let n = str.substring(0, str.length - len)


  console.log("str = '%s', len = %i, n = ", str, len, n)
  n = parseInt(n, 10) 
  if ( Unity2Secondes[u] ) {
    return n * Unity2Secondes[u]
  } else {
    erreur("Impossible de calculer la durée " + str + " (les unités possibles sont : 'sc', 'mn', 'hr', 'jr', 'mo', 'an'")
  }
}

Date.prototype.isOutOfDate = function(){
	return this < new Date()
}

/**
 * @return true si la date est proche à interval de +interval+ qui
 * est une durée exprimée en string (p.e. "2j")
 * 
 * Par défaut, l'intervalle est de 1 jour
 */
Date.prototype.isCloseToDate = function(interval =  "1j" /* durée string */){
	interval = dureeString2Secondes(interval) * 1000
	const now = new Date()
	const dif = this.getTime() - now.getTime()
	// console.log({inverval: interval, now: now, dif: dif})
	return dif > 0 && dif < interval
}
