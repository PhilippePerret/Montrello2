'use strict'
/**
  * Classe PanelInfos
  * -----------------
  * Gestion des informations générales de l'application qui sont
  * affichées en bas à droite de l'écran
  *
  */
class PanelInfos {

/**
 * Initiation du panneau, à la fin du chargement de l'application
 * 
 */
static init(){
  this.build()
  this.update()
}

/**
 * Construction du panneau
 * 
 */
static build(){
  erreur("Je ne sais pas encore construire le panneau")
}

/**
 * Actualise l'affichage des informations
 * Doit être appelée après chaque création/suppression
 * 
 */
static update(){
  erreur("Je ne sais pas encore actualiser les informations.")
}

}