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
 * Méthode principale appelée pour lancer les tests
 * 
 * Dans un premier temps, lorsque les tests ne sont pas prêts, on
 * lance leur relève (cf. l'annexe du manuel pour comprendre pourquoi
 * cette opération est nécessaire)
 * 
 * [1] Le laisser tout en haut, surtout pas d'appel log avant.
 *     Note : cette valeur sera écrasée en chargeant le _config.js de
 *            l'application.
 */
static async run(){
  this.config = {debug_level:0} // [1]
  log("-> MiniTest.run", 5)


  /**
   * Est-ce que c'est le démarrage du test ?
   * On le sait grâce à la valeur de storage qui ne doit pas être
   * définie.
   * 
   */
  const isStartSuiteTests = null === localStorage.getItem('minitest_last_case_index')
  

  log("--> MiniTest.loadConfig", 6)
  await this.loadConfig()
  log("<-- MiniTest.loadConfig", 6)

  if ( isStartSuiteTests ){
    await this.startSuite()
  }

  
  log("tests_list : " + JSON.stringify(this.tests_list), 4)
  this.current_file = this.tests_list[store.test_index]
  log("current_file = " + this.current_file, 4)

  if (this.current_file){
    log(`Je joue le fichier courant (${this.current_file})`)
  } else {
    log("current_file null => FIN DES TESTS", 3)
    this.endSuite()
    return
  }


  log("--> MiniTest.loadCurrentFile", 6)
  await this.loadCurrentFile()
  log("<-- MiniTest.loadCurrentFile", 6)

  log("Nombre de cases dans ce test : " + this.cases_list.length, 4)

  log("Index de case à prendre : " + String(1 + store.last_case_index), 4)
  this.current_case = this.cases_list[1 + store.last_case_index]

  if ( this.current_case ) {

    /**
     * 
     * On peut jouer ce case
     */

    await this.runCurrentCase()

  } else {
    
    /**
     * 
     * On a est arrivé à la fin des cases du fichier courant, on doit
     * passer au suivant et recharger la page.
     *
     */
    
    store.incrementeTestIndex()
    document.location.reload()

  }
}

/**
 * 
 * Chargement de la configuration de l'application courante
 * 
 */
static loadConfig(){
  return loadJS('MiniTests/_config.js')
}

/**
 * 
 * Chargement des Helpers définis dans les _config.js de l'app.
 * 
 */
static async loadHelpers(){
  log("-> MiniTest.loadHelpers", 5)
  var helper ;
  this.helpers_list.reverse()
  while( helper = this.helpers_list.pop() ) {
    await loadJS('MiniTests/'+ helper)
  }
  log("<- MiniTest.loadHelpers", 5)
}

/**
 * Méthode qui joue le case courant, enregistre le résultat puis 
 * recharge la page.
 * 
 */
static async runCurrentCase(){
  log("-> MiniTest.runCurrentCase", 5)
  log("--> Initialisation de l'application", 6)
  await App.init()
  log("<-- Initialisation de l'application", 6)
  log("--> MiniTest.loadHelpers", 6)
  await this.loadHelpers()
  log("<-- MiniTest.loadHelpers", 6)
  await this.current_case.run()
  store.incrementeCaseIndex()
  this.config.reset_before_each_test && document.location.reload()
  log("<- MiniTest.runCurrentCase", 5) // normalement, jamais atteint
}

/**
 * Méthode qui charge le fichier test courant, pour en tirer les
 * Cases qui seront placés dans this.cases_list
 *
 */
static async loadCurrentFile(){
  log("-> MiniTest.loadCurrentFile", 5)
  this.cases_list = []
  await loadJS('MiniTests/'+this.current_file)
  log("<- MiniTest.loadCurrentFile", 5)
}

/**
 * Démarrrage de la suite de tests
 * 
 */
static async startSuite(){
  // console.clear()
  log("=== Démarrage des tests ===", 1)
  await Ajax.send('MiniTest/before_suite.rb')
  this.dureeWait = 0
  store.startAt = new Date().getTime()
}

/**
 * Appelé à la fin des tests
 * 
 */
static endSuite(){

  store.endAt = new Date().getTime()

  this.displayReport()

  console.warn("Enregistrer aussi les résultats du test avec after_suite.rb")
  Ajax.send('MiniTest/after_suite.rb', {tests: store.getData()})
  .then(this.displayMessages.bind(this))
  .then(App.init.bind(App))
  .catch(console.error)
  store.clear()
}

/**
 * Pour écrire le rapport de test final
 * 
 */
static displayReport(){
  let success_count  = store.success.length
    , failures_count = store.failures.length
    , pendings_count = store.pendings.length
  let color = failures_count ? 'red' : 'green'
  console.log("\n\n")
  console.log("%c Succès : %i – échecs : %i – attentes : %i", `color:${color};font-weight:bold;font-size:1.1em;border-top:1px solid;width:100%;display:block;padding-top:2px;`, success_count, failures_count, pendings_count)
  logGris(`(durée totale : ${this.dureeTotale/1000} secs — durée hors attentes : ${this.dureeHorsAttentes/1000} secs`)
  if (failures_count) {
    logRed(store.failures.join("\n"))
  }

}

static get dureeHorsAttentes(){
  return this.dureeTotale - store.dureeWait
}
static get dureeTotale(){
  return store.endAt - store.startAt
}

/**
 * Pour afficher les messages (pour le moment ceux qui sont retournés
 * à la fin des tests par le after_suite)
 */
static displayMessages(ret){
  if (ret.error ) console.error(ret.error)
  else if (ret.message) log(ret.message, 5)
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

/**
 * Méthode permettant de définir un Case, dans un fichier test
 * 
 */
static add(testName, testFunction){
  let stack = new Error().stack.split("\n")[1]
  let idx = stack.indexOf('js/MiniTests') + 'js/MiniTests'.length
  let lastIdx = stack.lastIndexOf(':')
  stack = stack.substring(idx, lastIdx)
  this.cases_list.push(new MiniTest(stack, testName, testFunction))
}

constructor(relpath, name, fonction){
  this.relpath = relpath
  this.name = name
  this.fonction = fonction
}

run(){
  const my = this
  return new Promise(async function(ok,ko){
    Console.output(`--> ./js/MiniTests/${my.relpath}`,{color:'grey', left:60})
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
      log("Je passe dans le catch du run", 1)
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
      my.writeMessageSynthese(true)
      store.addSuccess(my)
    } else if ( resultat === 'pending' ) {
      // Test à implémenter
      logOrange(my.name)
      store.addPending(my)
    } else if ( resultat === false || 'string' == typeof(resultat)) {
      // Échec
      my.writeMessageSynthese(false, resultat)
      my.raison_failure = resultat
      store.addFailure(my)
    } else {
      console.error("Résultat invalide :", resultat)
      console.error(`Le test ${my.name} doit absolument retourner une valeur valide.`)
    }
    ok()
  })
}

/**
 * Définit le message (vert ou rouge) qui doit s'afficher en console
 * avec le nom du test, les éventuelles erreurs et le suivi s'il 
 * existe.
 * 
 * +ok+   {Boolean} True si c'est un succès, false dans le cas contraire
 * 
 * +motif_erreur+   {String} Le message d'erreur donné en résultat
 *                  if any.
 * 
 */
writeMessageSynthese(ok, motif_erreur){
  let msg = ""
  msg += this.name + '. '

  if (ok){ 
    logGreenBold(msg)
  } else {
    motif_erreur && (msg += "\nErreur : " + motif_erreur)
    logRedBold(msg)
  }
  
  if (this.suivis && !MiniTest.config.hide_suivi_messages) {
    logGreen("\t- " + this.suivis.join("\n\t- "))
  }
}


/**
 * Message d'erreur complet, storé, pour rapport final
 * 
 */
get failureFullMessage(){
  return `ERREUR : "${this.name}" (${this.relpath})\n${this.raison_failure}`
}

/**
 * Message de pending complet, storé, pour rapport final
 * 
 */
get pendingFullMessage(){
  return `PENDING: "${this.name}" (${this.relpath})`
}

/**
 * Pour ajouter des messages de suivi positif au test
 * 
 * Dans le test, on écrit 'this.suivi("<message>")'
 * 
 */
suivi(msg){
  this.suivis || (this.suivis = [])
  this.suivis.push(msg)
}

}//class MiniTest

