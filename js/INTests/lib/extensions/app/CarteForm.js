'use strict'

Object.assign(CarteForm.prototype, {

  /**
   * Pour simuler le clic sur le bouton pour ajouter une pièce jointe
   */
  click_bouton_add_fichier_joint(){
    this.boutonAddFichierJoint.click()
  },

  /**
   * Pour simuler le click sur le bouton pour ajouter un dossier lié
   */
  click_bouton_add_dossier(){
    this.boutonAddFolder.click()
  }
})

Object.defineProperties(CarteForm.prototype,{

  // Le bouton formulaire pour ajouter un fichier joint
  boutonAddFichierJoint:{
    enumerable: true,
    get:function(){return DGet('liste_actions.for-objets button[data-method="addFileJoint"]', this.obj)}
  },

  // Le bouton formulaire pour ajouter un dossier
  boutonAddFolder:{
    enumerable: true,
    get:function(){return DGet('liste_actions.for-objets button[data-method="addFolder"]', this.obj)}
  },

})