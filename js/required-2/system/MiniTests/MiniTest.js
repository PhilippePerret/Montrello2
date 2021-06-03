'use strict'
/**
 * Class MiniTest
 * --------------
 * Gestion de petits tests de l'application
 * depuis l'intérieur
 * 
 */
class MiniTest {

/**
 * Liste des tests à jouer
 * 
 */
static async defineSuiteTests(){
  return loadJS('MiniTests/_tests_list.js')
}
/**
 * Tests à charger
 * 
 * Rappel : pour lancer les tests, il faut commenter et décommenter les lignes
 * spécifiées dans main.js
 * 
 */
static async loadTests(){
  // console.log("-> loadTests");
  const my = this
  const tests_promises = []
  ;this.tests_list.forEach(tname => tests_promises.push(this.loadTest.call(this,tname)))

  return Promise.all(tests_promises)
  console.log("<- loadTests")
}

static loadTest(tpath){
  return loadJS('MiniTests/'+tpath)
}

/**
 * Méthode principale appelée pour lancer les tests
 * 
 */
static async run(){
  await this.defineSuiteTests()
  await this.loadTests()
  // console.log("<-- Retour de loadTests")
  if ( undefined == this.tests || this.tests.length == 0 ) {
    logRougeGras(this.error('no-test-defined', {app:App.name}))
    logRougeGras(this.error('aide-define-test', {app:App.name}))
    return
  }
  this.reset()
  Ajax.send('MiniTest/before_suite.rb')
  .then(this.displayMessages.bind(this))
  .then(this.runNextTest.bind(this))
  .catch(console.error)
}

static reset(){
  this.tests_done = []
  this.success  = []
  this.failures = []
  this.pendings = []
}
static runNextTest(){
  const test = this.tests.shift()
  if ( test ) {
    this.tests_done.push(test)
    test.run().then(this.runNextTest.bind(this))
  } else {
    this.end()
  }
}

/**
 * Appelé à la fin des tests
 * 
 */
static end(){
  this.success_count  = this.success.length
  this.failures_count = this.failures.length
  this.pendings_count = this.pendings.length
  console.log("\n\n")
  let color = this.failures_count ? 'red' : 'green'
  console.log("%c Succès : %i – échecs : %i – attentes : %i", `color:${color};font-weight:bold;font-size:1.1em;`, this.success_count, this.failures_count, this.pendings_count)
  Ajax.send('MiniTest/after_suite.rb').then(this.displayMessages.bind(this)).catch(console.error)
}

/**
 * Pour afficher les messages (pour le moment ceux qui sont retournés
 * à la fin des tests par le after_suite)
 */
static displayMessages(ret){
  if (ret.error ) console.error(ret.error)
  else if (ret.message) console.log(ret.message)
}

/**
 * Pour les erreurs fonctionnelles et courantes
 * 
 */
static error(err_id, params){
  if ( params ) {
    return this.ERRORS[err_id].replace(/#([a-zA-Z0-9_\-]+)/, function(tt,key){return params[key]})
  } else {
    return this.ERRORS[err_id](params)  
  } 
}

static get ERRORS(){
  return this._errors || (this._errors = {
      'no-test-defined': "Aucun test défini pour l’application #app."
    , 'aide-define-test': "Pour définir les tests dans #app, consulter le mode d'emploi du scaffold."
  })
}

static addSuccess(test){
  this.success.push(test)
}
static addFailure(test){
  this.failures.push(test)
}
static addPending(test){
  this.pendings.push(test)
}


static add(testName, testFunction){
  this.tests || (this.tests = [])
  let stack = new Error().stack.split("\n")[1]
  let idx = stack.indexOf('js/MiniTests') + 'js/MiniTests'.length
  let lastIdx = stack.lastIndexOf(':')
  stack = stack.substring(idx, lastIdx)
  this.tests.push(new MiniTest(stack, testName, testFunction))
}

constructor(relpath, name, fonction){
  this.relpath = relpath
  this.name = name
  this.fonction = fonction
}

run(){
  const my = this
  return new Promise(async function(ok,ko){
    Console.output(`--> ./js/MiniTests/${my.relpath}`,{color:'grey', left:50})
    ;let res_appel_fonction, resultat, raison ;
    try {
      res_appel_fonction = await my.fonction.call(my).catch(ret => {
        // console.log("Je passe dans le catch du fonction.call avec", ret)
        /**
         * On passe ici avec les méthodes expect, par exemple, quand
         * un throw est invoqué dans la fonction du test.
         * 
         */
        resultat = ret
      })
    } catch(err) {
      console.log("Je passe dans le catch du run")
      raison = err
      resultat = false
    }
    /**
     * Le résultat estimé est soi celui retourné par la fonction du 
     * test, soit celui défini par un throw (avec les méthodes expect
     * par exemple)
     */
    resultat = resultat || res_appel_fonction
    if ( resultat === true || resultat === null) {
      // Succès
      logGreenBold(my.name)
      my.constructor.addSuccess(my)
    } else if ( resultat === 'pending' ) {
      logOrange(my.name)
      my.constructor.addPending(my)
    } else if ( resultat === false || 'string' == typeof(resultat)) {
      // Échec
      my.raison_failure = resultat
      raison = my.name
      if ('string' == typeof(resultat)) raison += ` (${resultat})`
      logRed(raison)
      my.constructor.addFailure(my)
    } else {
      console.error("resultat invalide :", resultat)
      console.error(`Le test ${my.name} doit absolument retourner une valeur valide.`)
    }
    ok()
  })
}

}//class MiniTest

