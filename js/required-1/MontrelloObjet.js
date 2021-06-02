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
  }

}