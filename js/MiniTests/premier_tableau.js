'use strict'

MiniTest.add("Création automatique du premier tableau quand aucune donnée, avec le bon titre", async function(){

  await degel("init")

  // console.error("J'attends 60 secondes pour que tu puisses vérifier les données enregistrées (problème des 3 tableaux")
  // await wait(60)

  expect(Tableau.count).eq(1).else("Il devrait y avoir un seul tableau. Il y en a #actual.")
  expect(page).has('tableau#tableau-1').else("La page devrait contenir la balise <tableau id='tableau-1'>")
  expect(page).not_has('tableau#tableau-2').else("La page devrait contenir la balise tableau d'id #tableau-2")

  expect(page).has('minieditor').else("La page devrait afficher le formulaire pour changer le titre du premier tableau.")
  expect(page).not_has('minieditor[class="hidden]').else("Le formulaire pour changer le titre du premier tableau ne devrait pas être masqué.")
  
  expect(Tableau.current.titre).eq('Mon premier tableau').else("Le premier tableau devrait avoir pour titre '#expected'. Il a '#actual'.")

  return true

})

MiniTest.add("Modification du titre du premier tableau quand aucune donnée", async function(){


  await degel("init")

  expect(page).has('minieditor').else("La page devrait afficher le formulaire pour changer le titre du premier tableau.")

  let new_titre_tableau = ["New Pannel Title","Nouveau Tab","Titre Prem","Nouveau titre de panneau","Tableau Nouveau","Pannel New"][getRandom(6)]

  const tf = DGet('minieditor input#minieditor-text-field')
  expect(tf).not_eq(null).else("Le champ de saisie du mini-éditeur devrait exister.")
  tf.value = new_titre_tableau

  await wait(0.5)

  const btnOk = DGet('minieditor button#minieditor-btn-save')
  expect(btnOk).not_eq(null).else("Le bouton pour sauver le mini-éditeur devrait exister.")
  btnOk.click()

  await wait(1)

  // POURSUIVRE LE TEST POUR VOIR SI :
  expect(page).has('minieditor',{class:'hidden'}).else("Le mini éditeur devrait être fermé")
  this.suivi("Le miniéditeur est bien caché")
  expect(DGet('header span.pannel_name').innerHTML).eq(new_titre_tableau).else("Le titre affiché du tableau devrait être '#expected', or c'est '#actual'.")
  this.suivi("Le nouveau titre est bien affiché")
  let hdata = (await TData.get('tb', 1))
  expect(hdata).has({ti: new_titre_tableau}).else("Le fichier YAML devrait contenir le nouveau titre.")
  this.suivi("Le nouveau titre est bien enregistré dans le fichier")
  // - la nouvelle valeur est bien enregistrée dans le fichier yaml
  // - le titre est changé dans le menu des tableaux

  return true

})