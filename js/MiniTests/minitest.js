'use strict'
MiniTest.add("L'helper wait permet d'attendre", async function(){
  log("Je dois attendre 2 secondes", 3)
  const depart = new Date().getTime()
  await wait(2)
  const fin   = new Date().getTime()
  expect(fin - depart).greater_than(1500).else(/* message par défaut */)
  
  return true
})

MiniTest.add("eq et not_eq doivent produire le bon résultat", async function(){

  expect(2+2).eq(4).else('#actual devrait être égal à #expected')

  expect(3+2).not_eq(4).else('#actual ne devrait pas être égal à #expected')

  return true
})

MiniTest.add("Mon troisième test pour un test en attente", async function(){
  
  return 'pending'

})

MiniTest.add("Test de waitFor avec un texte attendu", async function(){
  console.log("Je vais écrire le message %s dans quelques secondes, patience…")
  let msg = `Mon message sans caractères difficiles`
  setTimeout(function(){message(msg)}, 4000)
  let msgSearched = escapeRegExp(msg)
  await waitFor(function(){return page.contains(msgSearched)})
  console.log("J'ai bien attendu jusqu'à ce que le texte apparaisse.")

  msg = `Mon message avec caractères difficiles (${new Date()})`
  console.log("Je vais écrire le message difficile '%s' dans quelques secondes, patience…")
  setTimeout(function(){message(msg)}, 4000)
  msgSearched = escapeRegExp(msg)
  await waitFor(function(){return page.contains(msgSearched)})
  console.log("J'ai bien attendu jusqu'à ce que le texte apparaisse.")

  return true
})

MiniTest.add("Test de waitFor avec un DOMElement (aka test de 'page.has(...)'')", async function(){

  let raison_echec = null

  console.log("Je vais ajouter le div#mon-mini-test dans quelques secondes…")
  setTimeout(function(){
    document.body.appendChild(DCreate('DIV',{id:'mon-mini-test'}))
    console.log("J'ai ajouté le div#mon-mini-test.")
  }, 3000)
  await waitFor(page.has.bind(page, 'div#mon-mini-test'), 5).catch(ret => {
    raison_echec = "le 'div#mon-mini-test' est introuvable"
  })

  return raison_echec
})