'use strict'
/**
 * Pour le test des modèles de liste
 * 
 */

/*
MiniTest.add("On peut créer un modèle de liste à partir d'une checklist", async function(){
  
  // On part d'un dégel où il existe déjà un modèle de liste
  degel('encours')
  
  expect(CheckList).responds_to('createFor')
    .else("La classe #sujet devrait répondre à la méthode #expected")
  this.suivi("La class Checklist répond à la méthode #createFor")

  expect(new CheckList()).responds_to('build')
    .else("Une instance #sujet doit répondre à la méthode #expected.")
  expect(new CheckList()).responds_to('observe')
    .else("Une instance #sujet doit répondre à la méthode #expected.")
  expect(new CheckList()).responds_to('build_and_observe')
    .else("Une instance #sujet doit répondre à la méthode #expected.")
  this.suivi("Une instance CheckList doit répondre à build, observe, build_and_observe")    

  const tbl = Tableau.current
  const nombre_listes = tbl.countListes()
  const btnAdd = DGet('content buttons button.btn-add', tbl.obj)
  btnAdd.click()
  await wait(0.5)
  let newListeTitre = `Liste pour modèle Checklist`
  TMiniEditor.setText(newListeTitre)
  TMiniEditor.clickSave()
  await wait(1)
  const laliste = tbl.lastListe()
  this.suivi("En cliquant le bouton '+ Ajouter une liste', on ajoute une liste au tableau")

  // On doit créer une nouvelle carte
  await wait(2)
  laliste.clickButtonNewCarte()
  console.log("J'ai cliqué sur le bouton pour ajouter une carte")
  await wait(5)
  this.suivi("On peut mettre la liste en édition")

  // TODO
  this.suivi("On trouve un bouton 'Check liste'")

  // TODO
  this.suivi("En cliquant le bouton 'Check Liste', on crée une nouvelle Checklist")

  // TODO
  this.suivi("La check-list possède un bouton pour en faire un modèle")

  // TODO
  this.suivi("En cliquant sur le bouton pour faire un modèle, on crée un modèle de checklist")

  // TODO
  this.suivi("Le modèle de check-list est bien enregistré dans un fichier")
  return true
  
})
//*/



//*/
MiniTest.add("On peut créer une checklist à partir d'un modèle", async function(){


  log("Je vais dégeler", 0)
  await degel('encours')
  log("J'ai dégelé", 0)


  this.suivi("On met le tableau courant aux éditions Icare (#4)")
  Tableau.current = await Tableau.get(4)

  // this.suivi("On édite la carte du Parc (#23)")
  // const carteParc = DGet('carte#ca-23')
  // carteParc.click()

  // await wait(4, "J'attends pour voir si la carte a été éditée.")


  // console.log("Je sors")

  return true  
})
//*/