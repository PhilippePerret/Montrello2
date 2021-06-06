'use strict'

//*
MiniTest.add("On peut créer une nouvelle checklist dans la carte", async function(){

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

  return 'pending'

})
//*/