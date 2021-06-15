'use strict'
/*
  Puisque MiniTest merde aussi… j'essai encore plus simple : on 
  définit ici le test à jouer et il sera appelé après le chargement 
  de l'application, avec les données voulues
*/

async function activeTableau(x){
  await (Tableau.current=(Tableau.get(x)))
}


// const GEL_FOR_TEST = 'encours'

async function RunThisTest(){

  // return // pour ne pas le jouer

  await wait(2, "J'attends pour activer le tableau des éditions Icare")
  await activeTableau(4)

  await wait(2, "J'attends pour cliquer sur la carte Le Parc")
  const carteParc = DGet('carte#ca-23')
  carteParc.click()

  await wait(2, "J'attends pour cliquer sur le modèle des checklists")
  const menuModelesCL = DGet('carte_form#carteform-23 liste_actions.for-objets menu.modeles-checklists')
  menuModelesCL.click()

  await wait(2, "J'attends pour choisir le modèle pour les livres")
  const modeleLivres = DGet('li.m-cl-2-name[data-id="2"]', menuModelesCL)
  modeleLivres.click()

}