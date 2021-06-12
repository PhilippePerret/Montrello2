'use strict'
/*
  Class MRules
  ------------
  Pour exécuter les rules (les règles)

*/
class MRules {

/**
 * = main =
 * 
 * Méthode principale, appelée au chargement de l'application, qui 
 * exécute toutes les règles définies, à commencer par celle qui 
 * met dans le tableau de bord toutes les informations concernant
 * l'état du travail à tous les niveaux.
 * 
 */
static exec(){
  console.log("-> MRules::exec")
  /**
   * Toutes les cartes qui possèdent l'étiquette rouge doivent
   * être mises dans la liste TODO du tableau de bord.
   * (pour le moment, pour voir, on traite la règle ici pour
   *  voir à quoi pourront ressembler les règles)
   */

  // Le tableau de bord
  // On l'augmente de tous les trucs utiles
  const dashboard = new TableauDeBord()
  
  // On boucle sur toutes les cartes pour trouver les cartes courantes
  Carte.forEachItem(item => {
    if ( item.tags.indexOf(1) > -1 ) {
      console.log("Cette carte est courante :", item)
      tableau.addCurrentCarte(item)
    }
  })

}


}//class MRules