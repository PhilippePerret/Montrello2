'use strict'

/**
 * Class Store
 * -----------
 * Pour simplifier le travail avec la localStorage
 * 
 * On utilise l'instance 'store'
 * Par exemple :
 * 
 *    store.last_case_index = 5
 * 
 * ou
 * 
 *    if ( idx == store.last_case_index ) { ... }
 * 
 */

class Store {
static get current(){return this._current || (this._current = new Store())}

/**
 * @return Les données à enregistrer par le after_suite.rb contenant
 * les données du test courant.
 * 
 */
getData(){
  return {
      success:  this.success
    , failures: this.failures
    , pendings: this.pendings
    , date: new Date()
    , start_at: MiniTest.start_at
    , end_at:   MiniTest.end_at
  }
}
/**
 * Ajouter le test +test+ aux succès, failures ou pendings ({MiniTest})
 * 
 */
addSuccess(test){ this.add('success', test.name) }
addFailure(test){this.add('failures', test.failureFullMessage)}
addPending(test){this.add('pendings', test.pendingFullMessage)}

add(type, str){
  // console.log("J'ajoute '%s' au type '%s'", str, type)
  var s = this[type]
  s.push(str)
  this[type] = s
}

get success() { return this.get('success')   || []}
set success(v){this.set('success', v)}
get failures(){ return this.get('failures')  || []}
set failures(v){this.set('failures', v)}
get pendings(){ return this.get('pendings')  || []}
set pendings(v){this.set('pendings', v)}


/**
 * Pour ajouter une ligne de console (à remettre à la fin)
 * 
 * Cf. le manuel pour le détail (bin/minitest-manuel)
 * 
 * +dline+    Soit un String, soit une liste des paramètres
 *            de console.log, pour styles par exemple.
 */
addConsoleLine(dline){
  var line_id   = 1 + this.lastIdConsoleLine
  var line_key  = `console_line_${line_id}`
  this.set(line_key, dline)
  this.set('last_id_console_line', line_id)
}

/**
 * Pour écrire en console toutes les lignes
 * 
 */
writeConsoleLines(){
  var lines_count = this.lastIdConsoleLine
  if ( lines_count == 0 ) return 
  var i = 1, line_key, dline
  for(; i <= lines_count; ++i){
    line_key = `console_line_${i}`
    dline = this.get(line_key)
    if ( 'string' == typeof dline ) {
      console.log(dline)
    } else if ( null == dline ) {
      // Ne rien faire
    } else {
      console.log(...dline)
    }
  }
}

get lastIdConsoleLine(){
  return this.get('last_id_console_line') || 0
}

/**
 * Index du fichier test courant
 * 
 */
get test_index(){return this.get('test_index') || 0}
set test_index(v){ this.set('test_index', v) }

get startAt(){return this.get('start_at')}
set startAt(v){this.set('start_at', v)}
get endAt(){return this.get('end_at')}
set endAt(v){this.set('end_at', v)}
get dureeWait(){return this.get('duree_wait')}
set dureeWait(v){this.set('duree_wait', v)}
// Ajoute +v+ millisecondes d'attente
addDureeWait(v){
  this.dureeWait = v + this.dureeWait
}

/**
 * Index du dernier cas joué dans le fichier test courant
 * 
 */
get last_case_index(){ 
  var lci = this.get('last_case_index') 
  if ( undefined == lci ) lci = -1 
  return lci
}
set last_case_index(v){
  this.set('last_case_index', v)
}

/**
 * Incrémente l'index du test courant
 * 
 * Note : on met aussi last_case_index à -1 pour partir depuis le
 * premier case.
 */
incrementeTestIndex(){
  this.test_index = 1 + this.test_index
  this.last_case_index = -1
}

/**
 * Appelée pour incrémenter l'index du cas courant
 */
incrementeCaseIndex(){
  this.last_case_index = (1 + this.last_case_index)
  // console.log("J'ai incrémenté last_case_index à ", this.last_case_index)
}

/**
 * Les données des mini-tests
 * 
 */
get data(){return this.get('data')}
set data(v){this.set('data', v)}

/**
 * Pour vider complètement la base
 */
clear(){ localStorage.clear() }



get(k){ 
  k = `minitest_${k}`
  var d = localStorage.getItem(k)
  if ( d ) return JSON.parse(d)
}
set(k,v){ 
  k = `minitest_${k}`
  localStorage.setItem(k, JSON.stringify(v)) 
}
}

const store = Store.current