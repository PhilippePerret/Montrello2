'use strict'
/*

  await wait(<nombre secondes>)

  await waitFor(<function>[,<time out>]).catch(ret => {motif_echec = "..."})

  await gel("<gel-name>"[, "<description>"])

  await degel("<gel-name>")

*/

function log(msg, level = 5){
  if ( level > MiniTest.config.debug_level ) return
  console.log('%c'+"\t"+msg, 'color:#888;font-style:italic;font-size:0.85em;')
}

/**
 * Pour attendre un certain nombre de secondes
 * 
 */
function wait(secondes){
  return new Promise((ok,ko) => {
    setTimeout(ok, secondes * 1000)
  })
}

/**
 * Pour attendre qu'une condition soit remplie
 * 
 * +timeout+ Nombre de secondes max d'attente
 */
function waitFor(fct, timeout = 30){
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
  if (MiniTest.config.reset_before_each_test){
    log(`Réinitialisation de l'app après le dégel de '${gel_name}'`, 5)
    await App.resetBeforeTest()
  }
}

function gel(gel_name, gel_description){
  return Ajax.send('MiniTest/gel.rb', {gel_name:gel_name, gel_description:gel_description})
}