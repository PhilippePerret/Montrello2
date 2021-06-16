'use strict'


INTests.define("Création d'une checklist à partir d'un modèle", async function(){

  // *** Valeurs au départ ***
  const ini_task_count = CheckListTask.count
  const ini_task_count_on_disk = await CheckListTask.count_on_disk


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

  // Il doit y avoir 5 tâches en plus, dans les items de CheckListTask
  // ainsi que sur le disque
  const new_task_count_on_disk = await CheckListTask.count_on_disk
  expect(new_task_count_on_disk).eq(ini_task_count_on_disk).else(`Il devrait y avoir 5 tâches en plus sur le disque (#expected au total). Il y a en a ${new_task_count_on_disk - init_task_count_on_disk} de plus.`)
  expect(CheckListTask.count).eq(ini_task_count + 5).else(`Il devrait y avoir 5 tâches de plus dans les items (#expected au total). Il y en a ${CheckListTask.count - ini_task_count} de plus.`)

  return true
})