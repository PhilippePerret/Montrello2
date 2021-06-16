'use strict'


INTests.define("Création d'une checklist à partir d'un modèle", async function(){

  // *** Valeurs au départ ***
  const ini_task_count = CheckListTask.count


  await intests_action("J'ouvre le carte du Parc")
  carteParc.click()

  // Le formulaire de la carte doit exister
  expect(page).hasFormCartParc().else(null) 

  await intests_action("J'ouvre le menu des checklists modèle")
  modelesCLinParcForm.click()
  
  await intests_action("Je choisis le modèle pour les livres")
  expect(page).has_modele_checklist_pour_fabrication_livre().else(null)
  itemCL_FabricationLivre.click()

  await intests_action("J'attends quelques secondes pour que tout soit enregistré.", 2)

  // *** VÉRIFICATIONS ***

  // Il doit y avoir 5 tâches en plus
  expect(CheckListTask.count).eq(ini_task_count + 5).else(`Il devrait y avoir 5 tâches de plus (#expected au total). Il y en a ${CheckListTask.count - ini_task_count} de plus.`)



  return true
})