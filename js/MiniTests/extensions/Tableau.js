'use strict'

Object.assign(Tableau.prototype, {

/**
 * Retourne le nombre de listes
 * 
 * ATTENTION : c'est une fonction, pas une propriété
 *              listeCount()
 */
countListes(){
  return this.allListes().length
},

/**
 * Retourne la dernière liste, en tant qu'instance Liste
 */
lastListe(){
  const listes = this.allListes()
  const nb_listes = listes.length
  const last_liste = listes[nb_listes - 1]
  const liste_id = last_liste.id.split('-')[1]
  return Liste.get(liste_id)
},

allListes(){
  return this.obj.querySelectorAll('content items.listes liste')
},

})