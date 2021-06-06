'use strict'
/*

  await wait(<nombre secondes>)

  await waitFor(<function>[,<time out>]).catch(ret => {motif_echec = "..."})

  await gel("<gel-name>"[, "<description>"])

  await degel("<gel-name>")

*/

function log(msg, level = 5){
  if ( level > MiniTest.config.debug_level ) return
  var dlog = ['%c'+"\t"+msg, 'color:#888;font-style:italic;font-size:0.85em;']
  store.addConsoleLine(dlog)
  console.log(...dlog)
}

/**
 * Un test qui doit être implémenté
 * 
 */
function pending(msg){
  throw `PENDING:${msg}`
}
/**
 * Pour attendre un certain nombre de secondes
 * 
 */
function wait(secondes, message){
  store.addDureeWait(secondes * 1000)
  message && console.warn(message)
  return new Promise((ok,ko) => {
    setTimeout(ok, secondes * 1000)
  })
}

/**
 * Pour attendre qu'une condition soit remplie
 * 
 * +timeout+ Nombre de secondes max d'attente
 */
function waitFor(fct, timeout = 30, message){
  message && console.warn(message)
  const now = new Date()
  let finAttente = new Date()
  finAttente.setTime(now.getTime() + timeout*1000)
  finAttente = finAttente.getTime()
  return new Promise((ok,ko) => {
    const timer = setInterval(function(){
      const evaluation = fct.call()
      // console.log("evaluation", evaluation)
      if ( evaluation === true ){ 
        clearInterval(timer)
        ok()
      } else if ( new Date().getTime() > finAttente) {
        clearInterval(timer)
        ko("Le Timeout est dépassé")
      }
    }, 100 /* tous les dixièmes de seconde */)
  })
}

function escapeRegExp(string){
  // $& correspond à la chaîne correspondante
  // dans son intégralité
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


// function degel(gel_name){
//   return Ajax.send('MiniTest/degel.rb',{gel_name:gel_name})
// }
async function degel(gel_name){
  await Ajax.send('MiniTest/degel.rb',{gel_name:gel_name})
  document.location.reload()
}

function gel(gel_name, gel_description){
  return Ajax.send('MiniTest/gel.rb', {gel_name:gel_name, gel_description:gel_description})
}