'use strict'
class INTests {

static async run_test(test_name) {
  // console.log("-> INTests.run_test(%s)", test_name)
  const test = new this(test_name)
  await test.load()
  await test.run()
}

constructor(name){
  this.name = name
}

/**
 * On joue le test
 * 
 */
async run(){
  console.log("Je dois jouer le test", this)
  if ( 'function' == typeof window[this.function_name] ) {
    let resultat = await window[this.function_name]()
    console.log("Résultat = ", resultat)
  } else {
    console.error("Le fichier '%s' doit définir la fonction asynchrone '%s' comme test.", this.path_js, this.function_name)
  }
}

get function_name(){return `${this.name}Test` }

async load(){
  return new Promise((ok,ko)=>{
    const script = DCreate('SCRIPT',{src:`js/INTests/tests/${this.name}/test.js`, type:"text/javascript"})
    document.body.appendChild(script)
    script.addEventListener('load', ok)
  })
}


} // class INTests