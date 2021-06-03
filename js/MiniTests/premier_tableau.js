'use strict'

// MiniTest.add("Création automatique du premier tableau quand aucune donnée, avec le bon titre", async function(){

//   await degel("init")
//   await App.reset()

//   console.log("L'application est initiée")

//   // await wait(1)

//   expect(Tableau.count).eq(1).else("Il devrait y avoir un seul tableau. Il y en a #actual.")
//   expect(page).has('tableau#tableau-1').else("La page devrait contenir la balise <tableau id='tableau-1'>")
//   expect(page).not_has('tableau#tableau-2').else("La page devrait contenir la balise tableau d'id #tableau-2")

//   expect(page).has('minieditor').else("La page devrait afficher le formulaire pour changer le titre du premier tableau.")
//   expect(page).not_has('minieditor[class="hidden]').else("Le formulaire pour changer le titre du premier tableau ne devrait pas être masqué.")
  
//   expect(Tableau.current.titre).eq('Mon premier tableau').else("Le premier tableau devrait avoir pour titre '#expected'. Il a '#actual'.")

//   return true

// })

MiniTest.add("Modification du titre du premier tableau quand aucune donnée", async function(){

  // return true

  // DOCUMENTER DANS LE MANUEL LES DEUX LIGNES CI-DESSOUS
  await degel("init")
  await App.reset()


  expect(page).has('minieditor').else("La page devrait afficher le formulaire pour changer le titre du premier tableau.")

  const tf = DGet('minieditor input#minieditor-text-field')
  expect(tf).not_eq(null).else("Le champ de saisie du mini-éditeur devrait exister.")
  tf.value = "Nouveau titre tableau"

  await wait(1)

  const btnOk = DGet('minieditor button#minieditor-btn-save')
  expect(btnOk).not_eq(null).else("Le bouton pour sauver le mini-éditeur devrait exister.")
  btnOk.click()

  await wait(2)

  // POURSUIVRE LE TEST POUR VOIR SI :
  // - le mini éditeur est bien fermé
  // - la nouvelle valeur est bien affichée
  // - la nouvelle valeur est bien enregistrée dans le fichier yaml
  // - le titre est changé dans le menu des tableaux

  return true

})