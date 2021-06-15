'use strict'
/*
  Le premier test pour essai

*/

// async function creer_tableauTest(){
//   await wait(3, "J'attends 3 petites secondes pour créer le tableau")
//   return 2 + 2 == 4
// }

INTests.define("Mon test pour créer un tableau", async function(){

  await wait(3, "Trois petites secondes avant de créer le tableau.")

  return true
})