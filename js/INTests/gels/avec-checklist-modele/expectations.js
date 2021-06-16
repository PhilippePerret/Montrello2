'use strict'

Object.assign(Expectation.prototype, {

hasFormCartParc(){
  return new ACase(this.sujet.has('carte_form#carteform-23'), "la page", "le formulaire de carte du Parc", null, "#sujet devrait contenir #expected.")
},

has_modele_checklist_pour_fabrication_livre(){
  return new ACase(itemCL_FabricationLivre != null, "la page", "l'item du modèle de checklist pour la fabrication d'un livre", null, "#sujet devrait contenir #expected.")
},

})