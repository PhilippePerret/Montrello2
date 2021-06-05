'use strict'
/**
 * Pour le test des modèles de liste
 * 
 */

MiniTest.add("On peut créer une nouvelle liste dans un tableau", async function(){
  
  // Note : pas de dégel, on part de là où on se trouve
  
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
  // console.log("Tableau courant", tbl)
  expect(tbl.obj).has('content buttons button', {class:'btn-add', text:'Ajouter une liste', count:1})
    .else("Le panneau du tableau devrait contenir un bouton pour créer une nouvelle liste")
  this.suivi("Le tableau courant possède un bouton pour créer une nouvelle liste")

  const nombre_listes = tbl.listesCount()
  // console.log("Nombre de liste dans le tableau : ", nombre_listes)
  const btnAdd = DGet('content buttons button.btn-add', tbl.obj)
  btnAdd.click()
  await wait(0.5)
  let newListeTitre = `Ma New Liste ${TODAY_S}`
  TMiniEditor.setText(newListeTitre)
  TMiniEditor.clickSave()
  await wait(1)
  // Incrémentation du nombre de liste
  expect(tbl.listesCount()).eq(nombre_listes + 1)
    .else("Une nouvelle liste devrait avoir été créée pour le tableau")
  const lastListe = tbl.lastListe()
  // Affichage de la liste sur le tableau (mais en fait, elle est
  // forcément affichée puisque c'est comme ça qu'on les compte)
  expect(lastListe instanceof Liste).eq(true).else("La dernière liste devrait être une instance de liste.")
  this.suivi("En cliquant le bouton '+ Ajouter une liste', on ajoute une liste au tableau")

  // La liste est enregistrée et possède le bon titre
  const dliste = (await TData.get('li', lastListe.id))
  expect(dliste).has({id: lastListe.id, ti: newListeTitre})
    .else("La nouvelle liste devrait avoir le bon ID et le bon titre")
  this.suivi("La nouvelle liste est bien enregistrée dans son fichier.")

  // TODO
  this.suivi("On peut mettre la liste en édition")

  return true
  
})

MiniTest.add("On peut détruire une liste en cliquant sur son bouton croix", async function(){

  const initListeCount = Tableau.current.listesCount

  // On prend une liste au hasard
  const liste = Tableau.current.lastListe()

  expect(liste.obj).has('header span.btn-kill').else("Les listes devraient posséder une croix pour les détruire.")
  this.suivi("La liste possède un bouton pour la supprimer")

  console.log("liste.btnKill", liste.btnKill)
  liste.btnKill.click()
  await wait(1)

  expect(page).not_has(`#${liste.domId}`)
    .else("La page ne devrait plus afficher la liste.")

  expect(TData.get('li', liste.id)).eq(null)
    .else("Le fichier de la donnée ne devrait plus exister.")

  expect(Tableau.objs.li).not_has({[liste.id]: liste})
    .else("La liste des objets listes du tableau ne devrait plus contenir la liste.")

  expect(Tableau.current.listesCount).eq(initListeCount - 1)
    .else("Le tableau courante devrait contenir une liste de moins.")
  this.suivi("La liste est détruit quand on clique sur sa croix")


  return true
})
