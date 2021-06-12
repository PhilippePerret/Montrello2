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
 * Boucle une fonction sur tous les éléments
 * 
 */
static forEachItem(fonction){
  if ( this.items ) {
    Object.values(this.items).forEach( item => fonction(item))
  }
}

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
  await this.createItem(newItem)
  return newItem
}

static async createItem(newItem){
  // console.log("new item = ", newItem)
  // console.log("newItem:", newItem)
  newItem.build_and_observe()
  await newItem.save()
  this.addItem(newItem)
  newItem.afterCreate && newItem.afterCreate.call(newItem)
  this.last_item_id = 0 + newItem.id // pour les tests
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
  // Pour la conservation des identifiants des enfants, pour éviter
  // les doublons.
  this.childrenKeyList = {}
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
  let impactedObjets = [this]
  impactedObjets = this.collectChildrenIn(impactedObjets)

  if ( impactedObjets.length > 5 ) {
    let msg = `${impactedObjets.length} objets vont être détruits (tu peux les voir en console). Dois-je vraiment procéder à cette opération ?`
    console.log("Objets détruits avec la destruction de %s", this.ref, impactedObjets)
    if (false == confirm(msg)) return
  }
  
  /**
   * On détruit chaque objet…
   *  - en tant qu'objet DOM
   *  - dans sa classe parent (items)
   *  - on appelle la méthode afterDestroy si elle existe
   *  - dans son fichier (mais ici, on ne prend que sa référence)
   */
  let references = []
  impactedObjets.reverse().forEach( objet => {
    references.push(objet.ref)
    objet.obj.remove()
    objet.constructor.removeItem(objet)
    objet.afterDestroy && objet.afterDestroy.call(objet)
  })

  // On procède à la destruction de tous les fichiers d'objet
  console.log("Références à détruire", references)
  await Ajax.send('remove.rb', {refs: references})

  // Retire l'objet de son parent, et surtout de sa liste data.cho
  // (ordre des enfants, if any)
  this.removeFromParent()

  // Et on termine en actualisant les nombres
  PanelInfos.update()

  return true
}

/**
 * Récupère tous les enfants et les enfants des enfants en
 * les plaçant dans la liste +liste+ qui est retournée.
 * 
 * La méthode sert pour la destruction.
 * 
 * @return liste actualisée
 * 
 */
collectChildrenIn(liste){
  this.forEachChild(child => {
    liste.push(child)
    child.collectChildrenIn(liste)
  })
  return liste
}


/**
 * Méthode générique pour appeler la construction et l'observation
 * de l'objet
 * 
 */
build_and_observe(){
  if ( this.build() !== false ) this.observe()
}

/**
 * Méthode commune pour tous les objets (sauf les tableaux, qui
 * n'appellent pas cette méthode)
 * 
 */
build(){
  if ( this.parent ) {
    this.obj = DOM.clone(`modeles ${this.constructor.dataClass.modeleName}`, {id: this.domId})
    this.addInParent()
    this.setCommonDisplayedProperties()
  } else {
    let msg ;
    msg = `Désolé, l'objet ${this.ref} `
    if ( this.data.ow ) {
      msg += `définit le parent #${this.data.ow} mais ce parent n'existe plus`
    } else {
      msg += 'ne définit pas son parent (data.ow non défini)'
    }
    msg += '. Nous ne pouvons pas le construire.'
    return erreur(msg)
  }
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

  this.obj.querySelectorAll('.methods-container').forEach(o => o.owner = this)

  UI.setEditableIn(this.obj)

  this.observe_bouton_destroy()

  this.observe_bouton_ajoute_enfant_si_existe()

  this.observe_bouton_modelise_si_existe()

  this.make_children_sortable_if_exist()

}

observe_bouton_destroy(){
  if ( this.btnKill ) {
    this.btnKill.addEventListener('click', this.destroy.bind(this))  
  }
}
observe_bouton_ajoute_enfant_si_existe(){
  if ( this.btnAddChild ) {
    this.btnAddChild.addEventListener('click', this.addChild.bind(this))
  }  
}
observe_bouton_modelise_si_existe(){
  if ( this.btnModelise ) {
    this.btnModelise.addEventListener('click', this.makeModele.bind(this))
  }
}
/**
 * Pour rendre la liste des enfants classable et appeler les bonnes 
 * méthodes pour l'enregistrer
 * 
 */
make_children_sortable_if_exist(){
  if ( this.childrenContainer ) {
    const dataSortable = {
        axis:       (this instanceof Tableau ? 'x' : 'y')
      , stop:       this.onStopSortingChildren.bind(this)
      , start:      this.onStartSortingChildren.bind(this)
      , activate:   function(ev,ui){ui.helper.addClass('moved')}
      , deactivate: function(ev,ui){ui.item.removeClass('moved')}
      // Les instances de tableau comportaient aussi :
      // , items: '> liste'
    }
    $(this.childrenContainer).sortable(dataSortable)
  } 
  // else {
  //   console.log("Cet élément n'a pas de liste enfant : ", this)
  // }
}
/**
 * Méthode permettant de transformer l'objet en modèle
 * 
 * Transformer un objet en modèle consiste simplement à changer son 
 * type en 'm-<type>', à prendre sa référence et à demander un nom
 * pour le spécifier.
 * On obtient donc une données :
 *  {ti: "Le titre du modèle", ty:'m-<type>', ow:'<référence>'}
 */
modelize(ev){
  MontModele.createItemFor(this)
}

lock(){
  console.warn("Je dois verrouiller", this)
}

archive(){
  console.warn("Je dois archiver", this)
}

copy(){
  console.warn("Je dois copier", this)
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
 * Méthode principale appelée quand on doit créer un enfant pour
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


/**
 * Méthode ajoutant l'enfant à la liste de son parent, que ce soit
 * à sa création ou à son chargement et sa construction
 * 
 * La méthode tient à jour une liste des clés pour ne pas ajouter
 * deux fois le même enfant
 */
addChildItem(child){
  if ( this.childrenKeyList[child.id] ) return // l'enfant est déjà consigné
  Object.assign(this.childrenKeyList, {[child.id]: true})
  this.children.push(child)
  this.afterAddChild && this.afterAddChild()
}

/**
 * Méthode d'enfant qui retirer l'objet de son parent
 * 
 */
removeFromParent(){
  this.parent && this.parent.removeChildItem(this)
}

/**
 * Méthode de parent qui supprime l'enfant +child+ de sa liste
 * d'objets ainsi que de sa liste de classement si l'objet est
 * classé.
 * 
 * +child+  Instance (héritée de {MontrelloObjet}) de l'enfant à
 *          détruire.
 *
 * Noter que lorsque cette méthode est invoquée, depuis le 'destroy'
 * de l'objet, l'objet a déjà été détruit entièrement.
 * 
 */
removeChildItem(child){
  var newChildren = []
  this.forEachChild(enf => {
    if ( child.id == enf.id ) return
      newChildren.push(enf)
  })
  this.children = newChildren

  var idxChild = this.data.cho && this.data.cho.indexOf(child.id)
  console.log("this.data.cho avant suppression", JSON.stringify(this.data.cho))
  if ( idxChild && idxChild > -1 ) {
    this.data.cho.splice(idxChild, 1)
    this.save()
    console.log("this.data.cho APRÈS suppression", JSON.stringify(this.data.cho))
  }
}

/**
 * Ajoute l'objet dans le container enfants de son parent, dans le 
 * DOM
 *  - Ajoute dans le DOM
 *  - Ajoute à la liste des enfants 
 * 
 * Ce qu'il faut comprendre ici, c'est que l'enfant n'est relié à son
 * parent qu'au chargement ou à la création de l'enfant.
 * 
 */
addInParent(){
  this.parent.childrenContainer.appendChild(this.obj)
  this.parent.addChildItem(this)
}


forEachChild(fonction){
  this.children && this.children.forEach(fonction)
}

/**
  * Appelée quand on termine de trier la liste des enfants de l'objet
  *
  * À la fin du déplacement, on met en route un compte à rebours qui, 
  * s'il arrive à son terme, enregistre le nouveau classement. Sinon, 
  * si on commence à déplacer un autre item (onStartSortingChildren), 
  * ça interrompt le compte à rebours (pour ne pas enregistrer plein 
  * de fois si plusieurs changements sont opérés)
  * 
  */
onStopSortingChildren(){
  this.timerSave = setTimeout(this.saveChildrenOrder.bind(this), 2500)
}
/**
  * Appelée quand on commence à trier les tâches
  */
onStartSortingChildren(){
  if ( this.timerSave ) {
    clearTimeout(this.timerSave)
    this.timerSave = null
  }
}

/**
 * Méthode pour classer les enfants après leur construction
 * 
 */
sortChildren(){
  if ( this.data.cho ) {
    let sortList = [...this.data.cho].reverse()
      , currChild
      , prevChild;
    for(var i = 1, len = sortList.length; i < len; ++i){
      currChild = this.childClass.get(sortList[i]) || raise(`L'enfant #${sortList[i]} n'existe plus dans ${this.ref}`)
      prevChild = this.childClass.get(sortList[i - 1]) || raise(`L'enfant #${sortList[i - 1]} n'existe plus dans ${this.ref}`)
      if ( currChild.obj && prevChild.obj ) {
        // console.log("L'enfant ... doit être placé avant l'enfant ...", currChild, prevChild)
        prevChild.obj.before(currChild.obj)
      } else {
        console.error("Problème de classement pour", this)
        console.error("currChild ... ou prevChild ... n'a pas d'obj", currChild, prevChild)
        erreur("Problème de classement (cf. la console)")
      }
    }
  }// else {
    // console.log("L'élément ne possède pas de classement d'enfants :", this)
  //}
}

/**
 * Pour enregistrer le nouvel ordre des enfants
 * quels que soient leur classe
 * 
 */
saveChildrenOrder(){
  this.set({cho: this.getChildrenListIds()})
}

// Retourne la liste des identifiants des enfants dans l'ordre relevé
// dans la liste actuelle
getChildrenListIds(){
  let idlist = []
  Array.from(this.childrenContainer.children).forEach(ochild => {
    idlist.push(parseInt(ochild.id.split('-')[1],10))
  })
  return idlist
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
 *          ou true si child n'est pas donné et que des enfants 
 *          existent (pour un test comme if (objet.hasChild()) then…)
 * 
 * +child+ Instance de l'enfant qui doit appartenir au sujet
 */
hasChild(child){
  if ( null == this.children ) return false

  if ( child ) {
    var enf
    for(enf of this.children ) {
      if ( enf.id == child.id ) return true
    }
    return false
  } else {
    return this.children.length > 0
  }
}

/**
 * / Fin des méthodes d'instance utiles aux tests
 * ============================================================== */


/**
 * ==============================================================
 * Méthodes d'élément DOM
 */


get childrenContainer(){
  if ( this.obj ) {
    return this._childcont || (this._childcont = DGet('children', this.obj))
  } else {
    raise("this.obj n'est pas défini pour la classe ... Impossible de définir son childrenContainer", this)
  }
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