'use strict'


INTests.define("Création de plusieurs massets", async function(){
  
  const ocarte1 = HELPER.ocarte1
      , carte1  = HELPER.carte1


  await intests_action("Je vais créer plusieurs massets")

  await intests_action("Je clique sur la carte 1 pour l'ouvrir")
  ocarte1.click()

  await intests_action("Je clique le bouton pour ajouter un fichier joint")
  console.log(carte1.form)
  carte1.form.click_bouton_add_fichier_joint()

  await intests_action("J'ajoute le path du fichier.")

  return true
})