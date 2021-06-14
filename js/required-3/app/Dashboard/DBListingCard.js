'use strict'
/*

  Class DBListingCard
  --------------------

  Classe pour les trois tableaux du dashboard affichant les cartes
  en cours, les cartes en dépassement d'échéance et les cartes à
  proximité d'échéance.

*/
class DBListingCard {

constructor(data){
  
  // Le fieldset recevant les cartes
  this.cardsContainer = data.cardsContainer
  this.id = data.id // p.e. 'runningcards'

}

/**
 * = main =
 * 
 * Méthode principale ajoutant la carte +carte+ au listing de cartes
 * 
 */
addCard(carte){
  const curcard = new CurrentCard(carte)
  this.tableauCardContainerFor(carte).appendChild(curcard.obj)
}

cleanUp(){
  this.cardsContainer.innerHTML = ''
}

/**
 * Méthode retournant le container de tableau pour le tableau d'id
 * +tableau_id+ (qui contiendra toutes les cartes de ce tableau)
 * C'est par exemple le tableau des icariens.
 * 
 */
tableauCardContainerFor(carte){
  const tableau_id = carte.tableau.id
  let tcc = DGet(`tableaucontainer#tbcont-${this.id}-${tableau_id}`, this.cardsContainer)
  tcc || ( tcc = this.buildTableauCardContainerFor(carte))
  return tcc
}

/**
 * Méthode pour construire le container correspondant au tableau
 * Rappel : toutes les cartes d'un même tableau sont rassemblées
 * dans le même container
 * 
 */
buildTableauCardContainerFor(carte){
  const tableau = carte.tableau
  const cont = DCreate('TABLEAUCONTAINER', {id:`tbcont-${this.id}-${tableau.id}`, 'data-tableau-id':tableau.id})
  const header = DCreate('HEADER')
  header.appendChild(DCreate('TITRE',{text:tableau.titre, class:'tableau-name'}))
  cont.appendChild(header)
  this.cardsContainer.appendChild(cont)
  return cont
}

}