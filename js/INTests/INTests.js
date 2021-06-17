'use strict'
class INTests {

statit

/**
 * Méthode appelée à chaque rechargement de l'application
 * Donc :
 *  - quand on commence une suite de tests (params.start est true)
 *  - quand on poursuit une suite de tests (params.start est false)
 *  - quand on finit la suite de tests ()
 * 
 */
static async restart(params){
  await loadJS('INTests/INTests_helpers.js')
  await loadJS('INTests/config.js')
  await this.loadAllRequired()
  this.current_test   = new this(params.intest_name)
  if (params.has_helpers) { await this.loadGelHelpers(params.gel_name) }
  if (params.has_expectations) { await this.loadGelExpectations(params.gel_name) }
  this.has_next_test  = params.has_next_intest
  if (params.start) { await this.onStart() }
}

static async loadAllRequired(){
  await this.extensions_list.forEach(async relpath => {
    await loadJS(`INTests/lib/extensions/${relpath}.js`)
  })
}

/**
 * Chargement des helpers et des expectations propres au gel du test
 * si ces fichiers existent.
 * 
 */
static async loadGelHelpers(gel_name){
  await loadJS(`INTests/gels/${gel_name}/helpers.js`)
}
static async loadGelExpectations(gel_name){
  await loadJS(`INTests/gels/${gel_name}/expectations.js`)
}

/**
 * Méthode appelée au tout début des tests pour préparer les
 * choses et notamment la fenêtre qui reçoit les messages
 * 
 */
static onStart(){
  store.clear()
  store.startAt = new Date().getTime()
}

/**
 * Pour jouer le test courant et passer à la suite
 * ou s'arrêter
 * 
 */
static async run_test_and_suite(){
  await this.run_current_test()
  
  if ( this.has_next_test ) {
    
    document.location.reload()
  
  } else {

      // *** FIN DES TESTS ***

      this.report()
  }

}
/**
 * Charger et jouer le test courant
 * --------------------------------
 * 
 * Noter que c'est avec la fonction load que sera chargé le titre et
 * la fonction qui contient le test. Avant l'appel de cette méthode, 
 * seul le nom (et donc l'emplacement) du test est défini.
 * 
 */
static async run_current_test() {
  await this.current_test.load()
  await this.current_test.run()
}

/**
 * Méthode pour définir le test courant
 * 
 */
static define(test_titre, test_function){
  this.current_test.fonction = test_function
  this.current_test.titre = test_titre
}

/**
 * Pour écrire le rapport final
 * 
 */
static async report(){
  store.endAt = new Date().getTime()
  // console.clear()
  await wait(1)
  let success_count  = store.success.length
    , failures_count = store.failures.length
    , pendings_count = store.pendings.length
  let color = failures_count ? 'red' : 'green'
  // On écrit toutes les lignes mémorisées
  store.writeConsoleLines()
  // On écrit le résultat
  console.log("\n\n")
  console.log("%c success: %i – failures: %i – pendings: %i", `color:${color};font-weight:bold;font-size:1.1em;border-top:1px solid;width:100%;display:block;padding-top:2px;`, success_count, failures_count, pendings_count)
  logGris(`(durée totale : ${this.dureeTotale/1000} secs — durée hors attentes : ${this.dureeHorsAttentes/1000} secs`)
  failures_count && logRed(store.failures.join("\n"))

}

static get dureeHorsAttentes(){
  return this.dureeTotale - store.dureeWait
}
static get dureeTotale(){
  return store.endAt - store.startAt
}


constructor(name){
  this.name = name
}

/**
 * On joue le test
 * 
 */
async run(){
  const my = this
  let res_appel_fonction, resultat, raison ;
  try {
    let res_appel_fonction = await this.fonction().catch(ret => {
        console.log("Je passe dans le catch du fonction.call avec", ret)
        /**
         * On passe ici avec les méthodes expect, par exemple, quand
         * un throw est invoqué dans la fonction du test.
         * 
         * On passe aussi quand c'est un pending, le message est
         * alors préfixé par "PENDING:"
         */
        if ( 'string' == typeof(ret) && ret.substring(0,8) === 'PENDING:'){
          raison = ret.substring(8, ret.length).trim()
          resultat = 'pending'
        }
        else {
          resultat = ret
        }
    })
  } catch(erreur) {
    log("Je passe dans le catch du try avec " + erreur, 2)
    raison = erreur
    resultat = false
  }
  /**
   * Le résultat estimé est soi celui retourné par la fonction du 
   * test, soit celui défini par un throw (avec les méthodes expect
   * par exemple)
   */
  resultat = resultat || res_appel_fonction
  if ( resultat === true ) {
    my.writeMessageSynthese(true)
    store.addSuccess(this)
  } else if ( 'string' == typeof resultat || resultat === false ) {
    my.writeMessageSynthese(false, resultat)
    my.raison_failure = resultat
    store.addFailure(this)
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

async load(){
  return new Promise((ok,ko)=>{
    const script = DCreate('SCRIPT',{src:`js/INTests/tests/${this.name}/test.js`, type:"text/javascript"})
    document.body.appendChild(script)
    script.addEventListener('load', ok)
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
  msg += this.titre + '. '

  if (ok === true){ 
    logGreenBold(msg)
  } else if (ok == 'pending') {
    motif_erreur && (msg += "\nAttente : " + motif_erreur)
    logOrangeBold(msg)
  } else {
    motif_erreur && (msg += "\nErreur : " + motif_erreur)
    logRedBold(msg)
  }
  
  if (this.suivis) {
    logGreen("\t- " + this.suivis.join("\n\t- "))
  }
}



} // class INTests