'use strict'


INTests.define("Création d'une checklist à partir d'un modèle", async function(){

  // *** Valeurs au départ ***
  const ini_task_count = CheckListTask.count


  await intests_action("J'ouvre le carte du Parc")
  const carteParc = DGet('carte#ca-23')
  carteParc.click()

  // Le formulaire de la carte doit exister
  expect(page).has('carte_form#carteform-23').else("La carte du parc devrait exister.")
  const carteForm = DGet('carte_form#carteform-23')

  await intests_action("J'ouvre le menu des checklists modèle")
  const modelesCL = DGet('liste_actions.for-objets menu.modeles-checklists', carteForm)
  modelesCL.click()
  
  await intests_action("Je choisis le modèle pour les livres")
  expect(page).has('li.m-cl-2-name').else("Le modèle de checklist pour la fabrication des livres devrait exister.")
  const itemCL = DGet('li.m-cl-2-name', modelesCL)
  itemCL.click()

  await intests_action("J'attends quelques secondes pour que tout soit enregistré.", 2)

  // *** VÉRIFICATIONS ***

  // Il doit y avoir 5 tâches en plus
  expect(CheckListTask.count).eq(ini_task_count + 5).else(`Il devrait y avoir 5 tâches de plus (#expected au total). Il y en a ${CheckListTask.count - ini_task_count} de plus.`)



  return true
})