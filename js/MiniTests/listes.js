'use strict'
/**
 * Pour le test des modèles de liste
 * 
 */

/* [Ajouter/supprimer un/le '/' en début de ligne pour dé/commenter le test]
MiniTest.add("On peut créer une nouvelle liste dans un tableau", async function(){
  
  // Note : pas de dégel, on part de là où on se trouve
  
  expect(Liste).responds_to('createFor')
    .else("La classe #sujet devrait répondre à la méthode #expected")
  this.suivi("La class Liste répond à la méthode #createFor")
  expect(Liste).responds_to('defaultItemData')
    .else("La classe #sujet devrait répondre à la méthode #expected")
  this.suivi("La class Liste répond à la méthode .defaultItemData")
  expect(Liste).responds_to('createItemFor')
    .else("La classe #sujet devrait répondre à la méthode #expected")
  this.suivi("La class Liste répond à la méthode .createItemFor")

  expect(new Liste()).responds_to('build')
    .else("Une instance #sujet doit répondre à la méthode #expected.")
  expect(new Liste()).responds_to('observe')
    .else("Une instance #sujet doit répondre à la méthode #expected.")
  expect(new Liste()).responds_to('build_and_observe')
    .else("Une instance #sujet doit répondre à la méthode #expected.")
  this.suivi("Une instance Liste doit répondre à build, observe, build_and_observe")    


  const tbl = Tableau.current
  // console.log("Tableau courant", tbl)
  expect(tbl.obj).has('content buttons button', {class:'btn-add', text:'Ajouter une liste', count:1})
    .else("Le panneau du tableau devrait contenir un bouton pour créer une nouvelle liste")
  this.suivi("Le tableau courant possède un bouton pour créer une nouvelle liste")

  const nombre_listes = tbl.countListes()
  // console.log("Nombre de liste dans le tableau : ", nombre_listes)
  tbl.btnAdd.click()
  await wait(0.5)

  let newListeTitre = `Ma New Liste ${TODAY_S}`
  TMiniEditor.setText(newListeTitre)
  TMiniEditor.clickSave()
  await wait(1)


  // *** Vérifications ***

  expect(tbl.countListes()).eq(nombre_listes + 1)
    .else("Une nouvelle liste devrait avoir été créée pour le tableau")
  this.suivi("Le nombre de listes du tableau a été incrémentée")

  const lastListe = Liste.getLastItem()
  // console.log("laliste", lastListe)

  expect(tbl).hasChild(lastListe)
    .else("La nouvelle liste devrait faire partie des enfants du tableau")
  this.suivi("La liste a été ajoutée en enfant (child) du tableau")

  expect(Liste.items[lastListe.id]).not_eq(null)
    .else("La nouvelle liste devrait être enregistrée dans les items de son constructeur.")
  this.suivi("La liste est consignée dans les items de son constructeur")

  // La liste est enregistrée et possède le bon titre
  const dliste = (await TData.get('li', lastListe.id))
  expect(dliste).has({id: lastListe.id, ti: newListeTitre})
    .else("La nouvelle liste devrait avoir le bon ID et le bon titre")
  this.suivi("La nouvelle liste est bien enregistrée dans son fichier.")

  return true
  
})
//*/


//* [Ajouter un '/' en début de ligne pour débloquer le test]
MiniTest.add("On peut détruire une liste en cliquant sur son bouton croix", async function(){

  const initListeCount = Tableau.current.countListes()

  // On prend la dernière liste
  // QUESTION : Quid s'il n'y en a pas ?
  const liste = Tableau.current.lastListe()

  expect(liste.obj).has('header span.btn-kill')
    .else("Les listes devraient posséder une croix pour les détruire.")
  this.suivi("La liste possède un bouton pour la supprimer")

  // Toutes les assertions qui devront être inversées
  expect(page).has(`#${liste.domId}`)
    .else("La page ne devrait plus afficher la liste.")

  let dliste = await TData.get('li', liste.id)
  expect(dliste).not_eq(null)
    .else("Le fichier de la donnée devrait exister.")
  expect(Liste.items[liste.id]).not_eq(undefined)
    .else("La liste devrait être retirée des items de Liste")

  await wait(3, "Je vais cliquer sur la croix")
  liste.btnKill.click()
  await wait(3, "J'ai cliqué sur la croix")
  await wait(1)

  expect(page).not_has(`#${liste.domId}`)
    .else("La page ne devrait plus afficher la liste.")

  dliste = await TData.get('li', liste.id)
  expect(dliste).eq(null)
    .else("Le fichier de la donnée ne devrait plus exister.")

  expect(Liste.items[liste.id]).eq(undefined)
    .else("La liste devrait être retirée des items de Liste")

  expect(Tableau.current.countListes()).eq(initListeCount - 1)
    .else("Le tableau courant devrait contenir une liste de moins.")

  liste.children.forEach(async (child) => {
    dchild = (await TData.get('ca', child.id));
    expect(dchild).eq(null)
      .else("Les enfants de la liste devraient être détruits. Or il reste la carte #"+child.id)
  })
  
  this.suivi("La liste est détruite quand on clique sur sa croix")


  return true
})

//*/