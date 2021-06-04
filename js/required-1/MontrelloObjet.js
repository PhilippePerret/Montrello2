'use strict'
/**
  * Classe abstraite MontrelloObjet
  *
  * Dans l'idéal, pour tous les objets Montrello
  * 
  */

class MontrelloObjet {

/**
 * @return Nombre d'items de la classe
 * 
 */
static get count(){
  this.items || (this.items = {})
  return Object.keys(this.items).length
}

/**
 * Méthode génénique de création d'un objet
 * 
 * Il faut fournir son propriétaire
 * L'objet doit définir la méthode de classe initNewItemFor qui recevra
 * le propriétaire
 * 
 * Si l'objet définit une méthode d'instance 'afterCreate', elle est
 * appelée. Elle sert par exemple à mettre tout de suite en édition
 * le titre de l'objet.
 * 
 * @return L'instance du nouvel item créé
 * 
 */
static createItemFor(owner){
  const newItem = this.initNewItemFor(owner)
  newItem.build_and_observe()
  newItem.save()
  this.addItem(newItem)
  newItem.afterCreate && newItem.afterCreate.call(newItem)
  return newItem
}

/**
 * @async
 * 
 * Création d'un nouvel item à partir des données +hdata+
 * Utile à la gestion des modèles (pour produire les copies)
 * 
 * Note : contrairement à la méthode createItemFor, seule l'instance
 * est produit ici, mais l'objet n'est pas créé ni observé.
 * 
 * @return L'instance créé
 */
static async createNewItemWith(hdata){
  hdata.id || Object.assign(hdata, {id: Montrello.getNewId(hdata.ty)})
  const newItem = new this(hdata)
  this.addItem(newItem)
  await newItem.saveAsync()
  return newItem
}
/**
 * Ajoute un item à la liste des items de l'objet
 * 
 */
static addItem(item) {
  if (undefined == this.items) this.items = {}
  Object.assign(this.items, {[item.id]: item})
  PanelInfos.update()
}

/**
 * Retire l'item +item+ de la liste des itemps
 * (par exemple après sa destruction)
 * 
 */
 static removeItem(item){
    if ( this.items[item.id] ) {
      this.items[item.id] = undefined
      delete this.items[item.id]
      PanelInfos.update()
    } else {
      return erreur("Impossible de détruire l'item "+item.ref+" : il est inconnu de la liste des items du constructor…")
    }
 }


/**
  * Retourne l'item d'identifiant +item_id+
  * 
  */
static get(item_id) { 
  this.items || (this.items = {})
  return this.items[item_id]
}

/**
 * Instanciation dans la classe abstraite
 * 
 * [1]  On doit faire cette vérification pour les classes, comme 
 *      Carte, qui ne définissent pas this.data mais this._data (cf.
 *      pourquoi dans la classe)
 * 
 */
constructor(data){
  data && (this.data = data) // [1]
}

/**
 * ----------------------------------------------------------------
 * Méthodes de propriété
 * 
 */


save(params){

  params = params || {}

  this.saved = false

  try {
    this.data     || raise("Les données doivent être définies avant l'enregistrement")
    if (undefined == this.data) this.data = {}
    this.data.ty  || raise("Le type de l'objet doit être défini avant l'enregistrement")
    this.data.id  || raise("L'identifiant doit être défini avant l'enregistrement")
  } catch(err) {
    return erreur(err)
  }

  // 
  // Certains valeurs sont à retirer
  const data4save = {}
  Object.assign(data4save, this.data)
  delete data4save.owner
  delete data4save.cr // régression

  // console.log("Data à sauvegarder de façon %s: ", (params.async?'a':'')+'synchrone', data4save)

  if ( params.async ) {
    return Ajax.send('save.rb', {data: data4save})
  } else {
    Ajax.send('save.rb', {data: data4save}).then(ret => {
      // console.log("Retour d'ajax : ", ret)
      if (ret.erreur) erreur(ret.erreur)
      else { return this.saved = true }
    })
  }
}

/**
 * Sauver de façon asynchrone, c'est-à-dire en retournant une
 * promesse.
 * 
 */
saveAsync(params){
  params = params || {}
  Object.assign(params, {async: true})
  return this.save(params)
}


/**
 * Méthode générique pour appeler la construction et l'observation
 * de l'objet
 * 
 */
build_and_observe(){
  this.build()
  this.observe()
}


/**
 * Récupération et définition du modèle
 * 
 * À quoi ça sert ? Maintenant, un modèle est juste une copie non
 * liée (sinon le traitement est trop compliqué)
 * 
 **/
get modele(){ return this.data.mo }
set modele(m){ 
  if ( this._data ) this._data.mo = m.ref
  else this.data.mo = m.ref
}
}