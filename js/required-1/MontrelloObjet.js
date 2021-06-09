'use strict'
/**
  * Classe abstraite MontrelloObjet
  *
  * Dans l'idéal, pour tous les objets Montrello
  * 
  */

class MontrelloObjet {

/**
 * @return  les données pour la classe, 
 *          la classe des enfants 
 *          la classe du parent
 * 
 */
static get dataClass(){ return Montrello.type2dataClass(this.dimType)}
static get childClass(){  return this.dataClass.childClass}
static get parentClass(){ return this.dataClass.parentClass}
/**
 * @return Nombre d'items de la classe
 * 
 */
static get count(){
  this.items || (this.items = {})
  return Object.keys(this.items).length
}

/**
 * Retourne une nouvelle instance de l'objet pour le propriétaire
 * (parent) +owner+
 * 
 */
static newItemFor(owner){
  return new this(this.newItemDataFor(owner))
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
    , cho: null // pour l'ordre des enfants
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
  // console.log("-> createItemFor(", owner)
  const newItem = this.newItemFor(owner)
  // console.log("new item = ", newItem)
  // console.log("newItem:", newItem)
  newItem.build_and_observe()
  await newItem.save()
  this.addItem(newItem)
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




// -----------------------------------------------------------------
// -----------------------------------------------------------------
// -----------------------------------------------------------------


/**
 * Instanciation dans la classe abstraite
 * 
 */
constructor(data){
  try {
    this.data = data
  } catch(error) {
    erreur("Erreur systémique (consulter la console)")
    console.error("Problème avec l'objet", this)
    console.error(error)
    return
  }
  if ( !data ) {
    erreur("ERREUR. Consulter la console.")
    console.error("Il faut absoluement des data pour définir ", this)
    return 
  } 
  /**
   * Les valeurs qu'on peut définir tout de suite
   */
  this.domId    = `${this.constructor.dimType}-${data.id}`
  this.children = []
}

/**
 * ----------------------------------------------------------------
 * Méthodes de propriété
 * 
 */

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
 * @sync
 * @async
 * 
 * Sauvegarde synchrone (sauf si params.async est true)
 * 
 */
save(params = {}){

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
 * Méthode principale de destruction de l'élément
 * 
 * Consiste à :
 *  - détruire toutes les cartes de la liste
 *  - détruire l'objet DOM
 *  - détruire l'instance dans le constructeur
 *  - détruire le fichier yaml 
 *  - détruire tous les enfants en cascade
 * 
 * C'est la méthode appelée par le bouton pour détruire l'élément
 * 
 * Certains objet, comme les tableaux, possèdent leur propre méthode,
 * qui ne fait que demander confirmation de la destruction avant 
 * d'appeler cette méthode-ci.
 * 
 */
async destroy(ev){
  this.obj.remove()
  this.constructor.removeItem(this)
  await this.destroyYamlFile()
  this.forEachChild(async (child) => { await child.destroy() })
  this.afterDestroy && this.afterDestroy()
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
 * Méthode générique pour appeler la construction et l'observation
 * de l'objet
 * 
 */
build_and_observe(){
  this.build()
  this.observe()
}

/**
 * Méthode commune pour tous les objets (sauf les tableaux, qui
 * n'appellent pas cette méthode)
 * 
 */
build(){
  if ( null == this.parent ) {
    return erreur(`Désolé, mais l'objet ${this.ref} ne définit pas son parent… Nous ne pouvons pas le construire.`)
  }
  this.obj = DOM.clone(`modeles ${this.constructor.dataClass.modeleName}`, {id: this.domId})
  this.addInParent()
  this.setCommonDisplayedProperties()
}
/**
 * Observation des éléments communs
 * 
 * Ne pas oublier de mettre 'super()' dans l'écouteur de la sous
 * classe
 * 
 */
observe(){
  this.obj.owner = this

  this.btnKill.addEventListener('click', this.destroy.bind(this))

  if ( this.btnAddChild ) {
    this.btnAddChild.addEventListener('click', this.addChild.bind(this))
  }

  if ( this.btnModelise ) {
    this.btnModelise.addEventListener('click', this.makeModele.bind(this))
  }

  // Les autres éléments éditables
  UI.setEditableIn(this.obj)

}

/**
 * Méthode permettant de transformer l'objet en modèle
 * 
 */
makeModele(ev){
  console.error("Je ne sais pas encore transformer l'objet en modèle")
  return
    message("Je dois faire un modèle de cette liste")
  // QUESTION Quid de si c'est déjà un modèle
  // On doit demander le nom du modèle
  // On doit enregistrer la checklist comme un modèle
  // Note : les modèles s'enregistrent comme les autres objets, avec un type ty, mais avec
  // le préfixe 'm-'
  // Donc 'm-cl' pour un modèle checklist
  const modele = MontrelloModele.createFrom(this)
  message("Modèle créé avec succès. Tu pourras l'utiliser avec la prochaine Checklist.")
  message("Cette liste a été associée à ce modèle")

}


/**
 * ============================================================
 * Méthodes pour les Massets de l'objet
 * 
 */

/**
 * Exécute la fonction +fonction+ sur tous les Masset de l'objet
 * 
 */
forEachMasset(fonction){
  this.massets.massets.forEach(fonction)
}

/**
 * @return une instance pluriel de la liste des Masset de l'objet
 * 
 * Note : l'objet est le plus souvent une carte
 * 
 */
get massets(){
  return this._massets || (this._massets = new Massets(this))
}


/**
 * ============================================================
 * Méthodes pour les enfants
 * 
 */


/**
 * Méthode principale appelée quand on doit ajouter un enfant à 
 * l'objet.
 * 
 * Appelée par le bouton 'Ajouter'
 * 
 * Cette méthode n'est pas à confondre avec la méthode 'addChildItem'
 * qui permet d'ajouter un enfant à l'aide de son instance, comme
 * c'est le cas par exemple lorsqu'on ajoute une checkliste à une
 * carte.
 * 
 */
async addChild(ev){
  const child = (await this.childClass.createItemFor(this));
  this.addChildItem(child)
}

async addChildItem(child){
  this.children.push(child)
  this.afterAddChild && this.afterAddChild()
}

/**
 * Ajoute l'objet dans le container enfants de son parent, dans le 
 * DOM
 * 
 */
addInParent(){
  this.parent.childrenContainer.appendChild(this.obj)
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

// Raccourci
get childClass(){return this.constructor.childClass}

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


/**
 * ==============================================================
 * Méthodes d'élément DOM
 */


get childrenContainer(){
  return this._childcont || (this._childcont = DGet('children', this.obj))
}

/**
 * @return le bouton pour détruire l'objet
 * 
 */
get btnKill(){
  return this._btnkill || (this._btnkill = DGet('.btn-self-remove', this.obj))
}

/**
 * Retourne le bouton pour ajouter un enfant
 * 
 */
get btnAddChild(){
  return this._btnaddchild || (this._btnaddchild = DGet('button.btn-add-child', this.obj))
}

/**
 * Le bouton pour créer un modèle de l'objet (if any)
 * 
 */
get btnModelise(){
  return this._btnmodele || (this._btnmodele = DGet('btn-modelise', this.obj))
}

/**
 * / Fin des méthodes d'élément DOM
 * ============================================================== */

}