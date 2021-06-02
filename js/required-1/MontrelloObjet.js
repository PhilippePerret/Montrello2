'use strict'
/**
  * Classe abstraite MontrelloObjet
  *
  * Dans l'idéal, pour tous les objets Montrello
  * 
  */

class MontrelloObjet {
  
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

}