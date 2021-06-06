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
 * @return  Les données par défaut pour un nouvel item de la classe
 *          en lui mettant +titre+ comme titre et +owner+ comme
 *          parent si cette donnée est définie.
 * 
 */
static defaultItemData(titre, owner){
  return {
      ti: titre
    , ty: this.dimType
    , id: Montrello.getNewId(this.dimType)
    , ow: (owner && owner.ref)
  }
}

/**
 * Méthode génénique de création d'un objet
 * 
 * Il faut fournir son propriétaire
 * L'objet doit définir la méthode de classe initNewItemFor qui recevra
 * le propriétaire et instanciera un nouvel objet
 * 
 * Si l'objet définit une méthode d'instance 'afterCreate', elle est
 * appelée. Elle sert par exemple à mettre tout de suite en édition
 * le titre de l'objet.
 * 
 * @return L'instance du nouvel item créé
 * 
 */
static async createItemFor(owner){
  const newItem = (await this.initNewItemFor(owner));
  // console.log("newItem:", newItem)
  newItem.build_and_observe()
  await newItem.save()
  this.addItem(newItem)
  owner && owner.addChild(newItem)
  newItem.afterCreate && newItem.afterCreate.call(newItem)
  this.last_item_id = 0 + newItem.id // pour les tests
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
static async duplicateItemWith(hdata){
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
 * ==============================================================
 * Méthodes de classe utiles aux tests 
 */

/**
 * Retourne le dernier élément créé (utile aux tests)
 * 
 */
static getLastItem(){ return this.get(this.last_item_id) }

/**
 * / Fin des méthodes utiles aux tests
 * ============================================================== */

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
  this.children = []
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
 * @async
 * 
 * Pour détruire le fichier yaml
 * 
 */
async destroyYamlFile(){
  await Ajax.send('remove.rb', {ref:{ty:this.type, id:this.id}})
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
 * ============================================================
 * Méthodes pour les enfants
 * 
 */

addChild(child){
  this.children.push(child)
}

forEachChild(fonction){
  this.children.forEach(fonction)
}

get parent(){
  return this._parent || (this._parent = this.getParent())
}
get owner(){ // régression
  console.warn("'owner' est déprécié. Utiliser 'parent'", new Error().stack)
  return this.parent
}

/**
 * @private
 * Retourne le parent de l'objet s'il existe
 */
getParent(){
  return this.data.ow ? Montrello.get(this.data.ow) : null ;
}

/**
 * /Fin des méthodes pour les enfants
 * ============================================================ */


/**
 * ==============================================================
 * Méthodes d'instance utiles aux tests 
 */

/**
 * @return true si l'instance contient l'enfant +child+
 * 
 * +child+ Instance de l'enfant qui doit appartenir au sujet
 */
hasChild(child){
  if ( null == this.children ) return false
  var enf
  for(enf of this.children ) {
    if ( enf.id == child.id ) return true
  }
  return false
}

/**
 * / Fin des méthodes d'instance utiles aux tests
 * ============================================================== */


}