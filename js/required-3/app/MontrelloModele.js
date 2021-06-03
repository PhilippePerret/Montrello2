'use strict'
/**
  * Pour gérer les modèles de tout élément
  *
  */
class MontrelloModele {

/**
 * Retourne le modèle de type +modele_type+ et d'identifiant 
 * +modele_id+.
 * 
 */
static get(modele_type, modele_id){
  return this.items[modele_type][modele_id]
}

/**
 * @async
 * 
 * Charge tous les modèles (ou seulement à la demande ?)
 * 
 */
static loadAllModeles(){
  return Ajax.send('load_modeles.rb')
  .then(this.dispatchModeles.bind(this))
}

/**
 * Dispatch les modèles depuis le retour ajax +ret+, c'est-à-dire
 * en fait des instances et les mets dans this.items
 * 
 */
static dispatchModeles(ret){
  const my = this
  if (ret.error) {
    console.error(error)
    erreur("Une erreur est survenue. Consulter la console.")
  } else {
    ret.modeles.forEach(hmodele => {
      const modele = new MontrelloModele(hmodele)
      my.addModele(modele)
      Montrello.addOrNotLastIdFrom(modele)
    })
  }
}

/**
 * Ajoute le modèle nouvellement créé +modele+ à la liste des modèles
 * 
 */
static addModele(modele){
  this.items || (this.items = {})
  this.items[modele.type] || Object.assign(this.items, {[modele.type]: {}})
  Object.assign(this.items[modele.type], {[modele.id]: modele})
}

/**
 * Méthode permettant de créer un modèle à partir de l'objet +objet+
 * 
 * Ça consiste donc à :
 *  - enregistrer l'objet comme un modèle, avec toutes ses
 *    spécificités, sauf son identifiant.
 *  - son type est mis à 'm-<type objet>'
 * 
 */
static createFrom(objet){
  var m = {}
  Object.assign(m, objet.data)
  delete m.id
  delete m.ow
  m.ty = `m-${objet.type}`
  Object.assign(m, {
      id: Montrello.getNewId(m.ty)
    , modele: objet.ref
  })

  // Instance du nouveau modèle
  const newmodele = new MontrelloModele(m)

  // On associe le modèle à l'objet
  objet.modele = newmodele
  this.addModele(newmodele)

  console.log("Données pour le modèle: ", newmodele, m)

  // On peut procéder à l'enregistrement du modèle et de l'objet
  // de référence
  newmodele.saveAsync()
  .then(objet.saveAsync.bind(objet))
  .then(ret => {
    message("Modèle créé avec succès et affecté à l'objet.")
  })
}


constructor(data){
  this.data = data
}

get ref(){return this._ref||(this._ref =`${this.data.ty}-${this.data.id}`)}

saveAsync(){
  return Ajax.send('save.rb',{data:this.data})
}

get id(){return this.data.id}
get type(){return this.data.ty}

}//class MontrelloModele