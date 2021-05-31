'use strict'
/**
	* Massets - Pour M - assets, liste d'assets Montrello
	*
	*/
class Massets extends MList {

constructor(owner){
	super()
	this.owner = owner
}

get massets(){
	if ( this.owner.data.objs && this.owner.data.objs.ma ) {
		var l = []
		this.owner.data.objs.ma.forEach(maid => l.push(Masset.get(maid)))
		return l
	} else {
		return []
	}
}

/**
	* Retourne tous les pictos des types de massets que contient
	* le propriétaire.
	*/
getPictos(){
	if ( this.massets.length == 0 ) return ''
	var pictos = []
	var mtypes_traited = {}
	this.massets.forEach(masset => {
		if ( mtypes_traited[masset.mtype] ) return
		else Object.assign(mtypes_traited, {[masset.mtype]: true})
		pictos.push(MASSET_TYPES[masset.mtype].picto)
	})
	return pictos.join('')
}

}